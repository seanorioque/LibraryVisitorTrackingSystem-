import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import T from "../../utils/theme.ts";
import Logo from "../../assets/newEraLogo.png";
import { PageDashboard } from "./PageDashboard.tsx";
import PageUsers from "./PageUsers.tsx";
import PageBlocked from "./PageBlocked.tsx";
import PageColleges from "./PageColleges.tsx";
import PageReports from "./PageReport.tsx";
import PageId from "../../types/PageId.ts";
import User from "../../types/User.ts";
import Log from "../../types/Log.ts";
import generateUsers from "../../mocks/generateUsers.ts";
import generateLogs from "../../mocks/generateLogs.ts";
import NAV from "../../constants/nav.ts";
import { PAGE_TITLES } from "../../constants/pages.ts";
import PageLogs from "./PageLogs.tsx";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const USERS: User[] = generateUsers();
export const LOGS: Log[] = generateLogs();

export default function App() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };
  const [page, setPage] = useState<PageId>("dashboard");
  const [liveCount, setLiveCount] = useState(23);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveCount((n: number) =>
        Math.max(1, n + Math.floor(Math.random() * 3) - 1),
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const sideW = collapsed ? 64 : 220;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
        color: T.text,
      }}
    >
      {/* Sidebar */}
      <motion.div
        animate={{ width: sideW }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        style={{
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 16px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            minHeight: 64,
          }}
        >
          <div>
            <img src={Logo} alt="Logo" style={{ width: 50, height: 50 }} />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  style={{
                    color: T.textHi,
                    fontWeight: 700,
                    fontSize: 12,
                    lineHeight: 1.2,
                  }}
                >
                  NEU Library
                </div>
                <div style={{ color: T.textLo, fontSize: 10 }}>Admin Panel</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav
          style={{
            flex: 1,
            padding: "10px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV.map((n) => {
            const active = page === n.id;
            return (
              <motion.button
                key={n.id}
                onClick={() => setPage(n.id)}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: active ? T.accent + "18" : "transparent",
                  color: active ? T.accent : T.textLo,
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.15s",
                  overflow: "hidden",
                  borderLeft: active
                    ? `2px solid ${T.accent}`
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = T.elevated;
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontSize: 12,
                        fontWeight: active ? 600 : 400,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {n.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        <div
          style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              background: T.elevated,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: T.textLo,
              padding: "6px 10px",
              cursor: "pointer",
              width: "100%",
              fontSize: 12,
            }}
          >
            {collapsed ? "→" : "← Collapse"}
          </button>
        </div>
        <div
          style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: T.elevated,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: "#ff0e0e",
              padding: "6px 10px",
              cursor: "pointer",
              width: "100%",
              fontSize: 12,
            }}
          >
            {collapsed ? "→" : "Log out"}
          </button>
        </div>
      </motion.div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          marginLeft: sideW,
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s",
          minWidth: 0,
        }}
      >
        <div
          style={{
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <span style={{ color: T.textHi, fontWeight: 700, fontSize: 14 }}>
            {PAGE_TITLES[page]}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            
              
            
          </div>
        </div>

        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {page === "dashboard" && (
                <PageDashboard liveCount={liveCount} setPage={setPage} />
              )}
              {page === "users" && <PageUsers />}
              {page === "logs" && <PageLogs />}
              {page === "blocked" && <PageBlocked />}
              {page === "colleges" && <PageColleges />}
              {page === "reports" && <PageReports />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
