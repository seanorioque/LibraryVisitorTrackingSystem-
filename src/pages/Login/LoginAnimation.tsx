import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const NUM_PARTICLES = 38;
const CONNECTION_DIST = 130;
const REPEL_DIST = 80;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function initParticles(w: number, h: number) {
  return Array.from({ length: NUM_PARTICLES }, (_, i) => ({
    id: i,
    x: randomBetween(20, w - 20),
    y: randomBetween(20, h - 20),
    vx: randomBetween(-0.3, 0.3),
    vy: randomBetween(-0.3, 0.3),
    r: randomBetween(2, 4.5),
    pulse: randomBetween(0, Math.PI * 2),
    hue: randomBetween(180, 260),
  }));
}

type Flash = { x: number; y: number; age: number; life: number; maxR: number };

export function ConstellationAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ReturnType<typeof initParticles>>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const clickFlashRef = useRef<Flash[]>([]); // ✅ fixed — was missing the generic bracket
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const pts = particlesRef.current;

      for (const p of pts) {
        p.pulse += 0.04;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DIST && dist > 0) {
          const force = ((REPEL_DIST - dist) / REPEL_DIST) * 0.6;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.5) {
          p.vx = (p.vx / spd) * 1.5;
          p.vy = (p.vy / spd) * 1.5;
        }
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.55;
            const avgHue = (pts[i].hue + pts[j].hue) / 2;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `hsla(${avgHue}, 80%, 72%, ${alpha})`;
            ctx.lineWidth = alpha * 1.8;
            ctx.stroke();
          }
        }
      }

      // ✅ fixed — f is now typed via the Flash type above
      clickFlashRef.current = clickFlashRef.current.filter((f: Flash) => {
        f.age += 1;
        const progress = f.age / f.life;
        if (progress >= 1) return false;
        const r = f.maxR * progress;
        const a = (1 - progress) * 0.7;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(200, 100%, 80%, ${a})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(f.x, f.y, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(200, 100%, 90%, ${a * 1.5})`;
        ctx.fill();
        return true;
      });

      for (const p of pts) {
        const pulse = 0.7 + Math.sin(p.pulse) * 0.3;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `hsla(${p.hue}, 90%, 80%, ${0.9 * pulse})`);
        glow.addColorStop(0.4, `hsla(${p.hue}, 80%, 65%, ${0.4 * pulse})`);
        glow.addColorStop(1, `hsla(${p.hue}, 70%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 88%, 1)`;
        ctx.fill();
      }

      if (mx > 0 && mx < W) {
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, REPEL_DIST);
        aura.addColorStop(0, "hsla(200, 100%, 80%, 0.06)");
        aura.addColorStop(1, "hsla(200, 100%, 80%, 0)");
        ctx.beginPath();
        ctx.arc(mx, my, REPEL_DIST, 0, Math.PI * 2);
        ctx.fillStyle = aura;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    particlesRef.current.push({
      id: Date.now(),
      x: cx,
      y: cy,
      vx: randomBetween(-0.6, 0.6),
      vy: randomBetween(-0.6, 0.6),
      r: randomBetween(2.5, 4),
      pulse: 0,
      hue: randomBetween(180, 260),
    });

    if (particlesRef.current.length > NUM_PARTICLES + 20) {
      particlesRef.current.shift();
    }

    clickFlashRef.current.push({ x: cx, y: cy, age: 0, life: 40, maxR: 60 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#282c34] relative overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,180,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <motion.div
        className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-blue-300/45">
          New Era University Library
        </span>
      </motion.div>
    </div>
  );
}