import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import Colleges from "../../utils/College.ts";
import Reasons from "../../utils/Reasons.ts";
import T from "../../utils/theme.ts";
import Logo from "../../assets/newEraLogo.png";
import { PageDashboard } from "./PageDashboard.tsx";
import PageUsers from "./PageUsers.tsx";
import PageBlocked from "./PageBlocked.tsx";
import PageColleges from "./PageColleges.tsx";
import PageReports from "./PageReport.tsx";
import PageId from "../../types/PageId.ts";
import BtnVariant from "../../types/BtnVariant.ts";
import User from "../../types/User.ts";
import Log from "../../types/Log.ts";
import generateUsers from "../../mocks/generateUsers.ts";
import generateLogs from "../../mocks/generateLogs.ts";



export const USERS: User[] = generateUsers();
export const LOGS: Log[] = generateLogs();

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const fmt = (n: number) => n.toLocaleString();

export const exportToExcel = (
  data: Record<string, unknown>[],
  filename: string,
) => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data
    .map((r) =>
      Object.values(r)
        .map((v) => `"${v}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();
};

export const printReport = () => window.print();

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  sub?: string;
  color: string;
  trend?: number;
}
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

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}
export const Input = ({ placeholder, value, onChange, style }: InputProps) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      background: T.elevated,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      color: T.textHi,
      padding: "8px 12px",
      fontSize: 13,
      outline: "none",
      ...style,
    }}
  />
);

interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  style?: React.CSSProperties;
}
export const Select = ({ value, onChange, options, style }: SelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      background: T.elevated,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      color: T.text,
      padding: "8px 12px",
      fontSize: 13,
      outline: "none",
      cursor: "pointer",
      ...style,
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

interface BtnProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: BtnVariant;
  style?: React.CSSProperties;
  disabled?: boolean;
}
export const Btn = ({
  children,
  onClick,
  variant = "primary",
  style,
  disabled,
}: BtnProps) => {
  const colors: Record<
    BtnVariant,
    { bg: string; color: string; border?: string }
  > = {
    primary: { bg: T.accent, color: "#fff" },
    danger: { bg: T.red, color: "#fff" },
    success: { bg: T.green, color: "#fff" },
    ghost: { bg: T.elevated, color: T.text, border: `1px solid ${T.border}` },
  };
  const c = colors[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: c.bg,
        color: c.color,
        border: c.border ?? "none",
        padding: "7px 14px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      color: T.textHi,
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    {children}
  </div>
);

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

interface TableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (row: T) => React.ReactNode;
}
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

export const TD = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <td
    style={{
      padding: "10px 12px",
      color: T.text,
      verticalAlign: "middle",
      ...style,
    }}
  >
    {children}
  </td>
);

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

// ─── MODALS ───────────────────────────────────────────────────────────────────
export const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: "fixed",
      inset: 0,
      background: "#000a",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: 24,
        minWidth: 340,
        maxWidth: 520,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <span style={{ color: T.textHi, fontWeight: 700, fontSize: 15 }}>
          {title}
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: T.textLo,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

export const EmailModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Modal title="📧 Email Report Summary" onClose={onClose}>
      {sent ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
          <div style={{ color: T.green, fontWeight: 600 }}>
            Report sent successfully!
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: T.text, fontSize: 13 }}>
            Send today's library visitor report summary to an email address.
          </div>
          <Input
            placeholder="recipient@neu.edu.ph"
            value={email}
            onChange={setEmail}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={onClose}>
              Cancel
            </Btn>
            <Btn
              onClick={() => {
                if (email) setSent(true);
              }}
            >
              Send Report
            </Btn>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── PAGES ────────────────────────────────────────────────────────────────────

// ── Users ──

export const BlockModal = ({
  user,
  onConfirm,
  onClose,
}: {
  user: User;
  onConfirm: (r: string) => void;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState("");
  return (
    <Modal title={`🚫 Block ${user.name}?`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ color: T.text, fontSize: 13 }}>
          This will prevent the user from accessing the library system. Please
          provide a reason.
        </div>
        <Input
          placeholder="Reason for blocking..."
          value={reason}
          onChange={setReason}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              if (reason) onConfirm(reason);
            }}
            disabled={!reason}
          >
            Confirm Block
          </Btn>
        </div>
      </div>
    </Modal>
  );
};

// ── Logs ──
const PageLogs = () => {
  const [logs, setLogs] = useState<Log[]>(LOGS);
  const [filterDate, setFilterDate] = useState("");
  const [filterCollege, setFilterCollege] = useState("all");
  const [filterReason, setFilterReason] = useState("all");
  const [showEmailModal, setShowEmailModal] = useState(false);

  const filtered = logs.filter((l) => {
    const matchDate = !filterDate || l.date === filterDate;
    const matchCollege = filterCollege === "all" || l.college === filterCollege;
    const matchReason = filterReason === "all" || l.reason === filterReason;
    return matchDate && matchCollege && matchReason;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{
            background: T.elevated,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            color: T.text,
            padding: "8px 12px",
            fontSize: 13,
            outline: "none",
          }}
        />
        <Select
          value={filterCollege}
          onChange={setFilterCollege}
          options={[
            { value: "all", label: "All Colleges" },
            ...Colleges.map((c) => ({ value: c, label: c })),
          ]}
          style={{ minWidth: 180 }}
        />
        <Select
          value={filterReason}
          onChange={setFilterReason}
          options={[
            { value: "all", label: "All Reasons" },
            ...Reasons.map((r) => ({ value: r, label: r })),
          ]}
          style={{ minWidth: 160 }}
        />
        <div style={{ flex: 1 }} />
        <Btn
          variant="ghost"
          onClick={() =>
            exportToExcel(
              filtered as unknown as Record<string, unknown>[],
              "visit-logs-export",
            )
          }
        >
          📥 Export Excel
        </Btn>
        <Btn variant="ghost" onClick={printReport}>
          🖨️ Print
        </Btn>
        <Btn variant="ghost" onClick={() => setShowEmailModal(true)}>
          📧 Email
        </Btn>
        <span style={{ color: T.textLo, fontSize: 12 }}>
          {filtered.length} records
        </span>
      </div>

      <Card style={{ padding: 0 }}>
        <Table
          columns={["Name", "Email", "College", "Reason", "Date", "Time"]}
          data={filtered}
          renderRow={(l: Log) => (
            <>
              <TD
                style={{
                  color: T.textHi,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {l.name}
              </TD>
              <TD style={{ fontSize: 11 }}>{l.email}</TD>
              <TD style={{ fontSize: 11, maxWidth: 120 }}>
                {l.college.replace("College of ", "")}
              </TD>
              <TD style={{ fontSize: 11 }}>{l.reason}</TD>
              <TD style={{ fontSize: 11 }}>{l.date}</TD>
              <TD style={{ fontSize: 11 }}>{l.time}</TD>
            </>
          )}
        />
      </Card>

      <AnimatePresence>
        {showEmailModal && (
          <EmailModal onClose={() => setShowEmailModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Colleges ──

// ── Reports ──

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV: { id: PageId; icon: string; label: string }[] = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "users", icon: "👤", label: "Users" },
  { id: "logs", icon: "📋", label: "Visit Logs" },
  { id: "blocked", icon: "🚫", label: "Blocked Users" },
  { id: "colleges", icon: "🏛️", label: "Colleges" },
  { id: "reports", icon: "📊", label: "Reports" },
];

const PAGE_TITLES: Record<PageId, string> = {
  dashboard: "Dashboard Overview",
  users: "User Management",
  logs: "Visit Logs Management",
  blocked: "Blocked Users",
  colleges: "College & Department Management",
  reports: "Reports & Analytics",
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
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
                <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
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
            <RealTimePulse count={liveCount} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px",
                background: T.elevated,
                borderRadius: 20,
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: T.accent + "33",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                }}
              >
                🔑
              </div>
              <span style={{ fontSize: 11, color: T.textLo }}>Admin</span>
            </div>
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
