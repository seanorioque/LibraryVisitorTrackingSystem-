import T from "../utils/theme"
export const Badge = ({ status }: { status: "active" | "blocked" }) => (
  <span
    style={{
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: status === "active" ? T.green + "22" : T.red + "22",
      color: status === "active" ? T.green : T.red,
      border: `1px solid ${status === "active" ? T.green + "44" : T.red + "44"}`,
    }}
  >
    {status === "active" ? "Active" : "Blocked"}
  </span>
); 

export default Badge