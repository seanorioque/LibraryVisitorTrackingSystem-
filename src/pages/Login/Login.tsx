import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ConstellationAnimation } from "./LoginAnimation";
import Logo from "../../components/newEraLogo.png";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  const signInWithGoogle = async () => {
    setAuthing(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      console.log("User UID:", response.user.uid);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setAuthing(false);
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* Left — constellation */}
      <ConstellationAnimation />

      {/* Right — login */}
      <div className="w-1/2 h-full flex items-center justify-center bg-[#0d1117] relative overflow-hidden">

        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500 opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-purple-500 opacity-5 blur-3xl pointer-events-none" />

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center w-full max-w-sm mx-6 px-10 py-12 rounded-3xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl shadow-2xl"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent rounded-full" />

          {/* Logo */}
          <motion.img
            src={Logo}
            alt="New Era University Library"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.08, filter: "brightness(1.3)" }}
          
          />

          {/* Divider */}
          <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-blue-300/15 to-transparent" />

          {/* Labels + heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-center mb-8 w-full"
          >
            <p className="text-[10px] tracking-[0.22em] uppercase text-blue-300/40 font-mono mb-3">
              New Era University Library
            </p>
            <h1 className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              Welcome back
            </h1>
            <p className="mt-2 text-xs text-blue-200/30 font-mono tracking-wide">
              Sign in with your university account
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono tracking-wide text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInWithGoogle}
            disabled={authing}
            className="w-full py-4 rounded-2xl border border-blue-300/20 bg-blue-400/10 hover:bg-blue-400/15 hover:border-blue-300/35 text-blue-100/90 text-[11px] font-mono tracking-[0.18em] uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {authing ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-3 h-3 rounded-full border border-blue-300/30 border-t-blue-300 inline-block"
                />
                Signing in…
              </>
            ) : (
              "Log In With University Account"
            )}
          </motion.button>

          {/* Footer hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 text-[10px] font-mono tracking-[0.14em] text-blue-300/20 text-center uppercase"
          >
            Use your university credentials to access
          </motion.p>
        </motion.div>

        {/* Bottom watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none"
        >
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-blue-300/20">
            © {new Date().getFullYear()} New Era University
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;