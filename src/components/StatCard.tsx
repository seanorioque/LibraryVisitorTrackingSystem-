import T from "../utils/theme";
import { fmt } from "../utils/format";
import StatCardProps from "../types/StatCardProps";
import { motion } from "framer-motion";
export const StatCard = ({
  icon,
  label,
  value,
  sub,
  color,
  trend,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "20px 24px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <div
          style={{
            color: T.textLo,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: T.textHi,
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {fmt(value)}
        </div>
        {sub && (
          <div style={{ color: T.textLo, fontSize: 12, marginTop: 4 }}>
            {sub}
          </div>
        )}
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: color + "22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        {icon}
      </div>
    </div>
    {trend !== undefined && (
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
        }}
      >
        <span style={{ color: trend >= 0 ? T.green : T.red }}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </span>
        <span style={{ color: T.textLo }}>vs yesterday</span>
      </div>
    )}
  </motion.div>
);
export default StatCard