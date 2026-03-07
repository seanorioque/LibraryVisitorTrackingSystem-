import { useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut, deleteUser,
} from "firebase/auth"; // ✅ add signOut
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ConstellationAnimation } from "./LoginAnimation";
import Logo from "../../assets/newEraLogo.png";

const ALLOWED_DOMAIN = "neu.edu.ph"; // ✅ your institutional domain

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

      // ✅ Force Google to show the account picker every time
      provider.setCustomParameters({ prompt: "select_account" });

      const response = await signInWithPopup(auth, provider);
      const email = response.user.email ?? "";
      const domain = email.split("@")[1];
      const user = response.user; 

      const adminUIDs = ["GtemhasdaB714wWi3hNl0FzArJtTXv42"];

      if (domain !== ALLOWED_DOMAIN) {
        // ✅ Immediately sign them out before they get any access
        await signOut(auth);
        await deleteUser(user);
        setError(`Access denied. Please use your @${ALLOWED_DOMAIN} account.`);
        setAuthing(false);
        return;
      }
      // GtemhB714wWi3hNl0FzArJtTXv42

      console.log("User UID:", response.user.uid);
      adminUIDs.includes(response.user.uid)
        ? navigate("/")
        : navigate("/Students");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setAuthing(false);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ConstellationAnimation />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto relative flex flex-col items-center w-full max-w-sm px-10 py-12 rounded-3xl border border-white/[0.08] bg-[#282c34]/60 backdrop-blur-2xl shadow-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent rounded-full" />

          <motion.img
            src={Logo}
            alt="New Era University Library"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.07, filter: "brightness(1.3)" }}
            onClick={() => navigate("/")}
            className="h-14 w-auto mb-8 cursor-pointer drop-shadow-lg"
          />

          <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-center mb-8 w-full"
          >
            <p className="text-[10px] tracking-[0.22em] uppercase text-blue-300/50 font-mono mb-3">
              New Era University Library
            </p>
            <h1
              className="text-white text-2xl font-bold tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Welcome
            </h1>
            <p className="mt-2 text-xs text-blue-200/40 font-mono tracking-wide">
              Sign in with your university account
            </p>
          </motion.div>

          {/* ✅ Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono tracking-wide text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInWithGoogle}
            disabled={authing}
            className="w-full py-4 rounded-2xl border border-blue-300/20 bg-blue-400/10 hover:bg-blue-400/20 hover:border-blue-300/40 text-blue-100/90 text-[11px] font-mono tracking-[0.18em] uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-6 text-[10px] font-mono tracking-[0.14em] text-blue-300/25 text-center uppercase"
          >
            Only @neu.edu.ph accounts are allowed
          </motion.p>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent rounded-full" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-0 right-0 z-10 flex justify-center pointer-events-none"
      ></motion.div>
    </div>
  );
};

export default Login;
