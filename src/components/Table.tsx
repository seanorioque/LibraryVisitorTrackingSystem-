import { motion } from "framer-motion";
import TableProps from "../utils/TableProps";
import T from "../utils/theme";
export function Table<T extends { id?: number }>({
  columns,
  data,
  renderRow,
}: TableProps<T>) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  color: T.textLo,
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: 32, textAlign: "center", color: T.textLo }}
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <motion.tr
                key={row.id ?? i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                style={{ borderBottom: `1px solid ${T.border}22` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = T.elevated)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {renderRow(row)}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;