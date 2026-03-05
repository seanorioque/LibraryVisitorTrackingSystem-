import { motion } from "framer-motion";
import T from "../utils/theme"
export const RealTimePulse = ({ count }: { count: number }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 14px",
      background: T.green + "15",
      border: `1px solid ${T.green}44`,
      borderRadius: 20,
      fontSize: 13,
    }}
  >
    <motion.div
      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      style={{ width: 8, height: 8, borderRadius: "50%", background: T.green }}
    />
    <span style={{ color: T.green, fontWeight: 700 }}>{count}</span>
    <span style={{ color: T.textLo }}>visitors now</span>
  </div>
);

export default RealTimePulse