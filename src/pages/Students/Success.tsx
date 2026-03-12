import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import T from "../../utils/theme";
import Logo from "../../assets/newEraLogo.png";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 4000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          textAlign: "center",
        }}
      >
        <motion.img
          src={Logo}
          alt="New Era University Library"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ height: 80, width: "auto", marginBottom: 8 }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ color: T.textHi, fontSize: 26, fontWeight: 700 }}
        >
          Welcome to NEU Library!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ color: T.textLo, fontSize: 14, lineHeight: 1.6 }}
        >
          Enjoy your time at the{" "}
          <span style={{ color: T.accent, fontWeight: 600 }}>NEU Library</span>!
        </motion.p>

        <motion.div
          style={{
            marginTop: 24,
            width: 200,
            height: 3,
            background: T.border,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }} 
            style={{
              height: "100%",
              background: T.accent,
              borderRadius: 999,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success;
