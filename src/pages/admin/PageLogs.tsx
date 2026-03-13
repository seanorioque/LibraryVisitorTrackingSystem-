import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { exportToExcel } from "../../utils/export.ts";
import Colleges from "../../utils/College.ts";
import VISIT_REASONS from "../../types/ReasonsForVisit.ts";
import T from "../../utils/theme.ts";
import { AnimatePresence } from "framer-motion";
import EmailModal from "../../components/EmailModal.tsx";
import TD from "../../components/TD.tsx";
import Table from "../../components/Table.tsx";
import Card from "../../components/Card.tsx";
import Btn from "../../components/Btn.tsx";
import Select from "../../components/Select.tsx";
import printReport from "../../utils/printReport.ts";

// ── Type ──
interface Log {
  id: string;
  uid: string;
  name: string;
  email: string;
  college: string;
  studentId: string;
  reason: string;
  date: string;
  time: string;
  timestamp: { seconds: number } | Date;
}

const toDate = (ts: Log["timestamp"]): Date =>
  ts instanceof Date
    ? ts
    : new Date((ts as { seconds: number }).seconds * 1000);

// ✅ Normalize reason: handles both old (value) and new (label) saved formats
const normalizeReason = (reason: string): string => {
  const match = VISIT_REASONS.find(
    (r) => r.value === reason || r.label === reason,
  );
  return match?.label ?? reason;
};

const PageLogs = () => {
  const db = getFirestore();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterCollege, setFilterCollege] = useState("all");
  const [filterReason, setFilterReason] = useState("all");
  const [showEmailModal, setShowEmailModal] = useState(false);

  // ── Realtime: visits collection ──
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "visits"), orderBy("timestamp", "desc")),
      (snap) => {
        const data: Log[] = snap.docs.map((d) => {
          const v = d.data();
          const date = toDate(v.timestamp);
          return {
            id: d.id,
            uid: v.uid ?? "",
            name: v.name ?? "—",
            email: v.email ?? "—",
            college: v.college ?? "—",
            studentId: v.studentId ?? "—",
            reason: normalizeReason(v.reason ?? "—"), // ✅ normalize here
            date: date.toLocaleDateString("en-CA"),
            time: date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: v.timestamp,
          };
        });
        setLogs(data);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [db]);

  // ── Filter ──
  const filtered = logs.filter((l) => {
    const matchDate = !filterDate || l.date === filterDate;
    const matchCollege = filterCollege === "all" || l.college === filterCollege;
    const matchReason = filterReason === "all" || l.reason === filterReason;
    return matchDate && matchCollege && matchReason;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Filters ── */}
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
            ...Colleges.map((c: any) => ({ value: c, label: c })),
          ]}
          style={{ minWidth: 180 }}
        />
        <Select
          value={filterReason}
          onChange={setFilterReason}
          options={[
            { value: "all", label: "All Reasons" },
            ...VISIT_REASONS.map((r) => ({ value: r.label, label: r.label })),
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
          Export Excel
        </Btn>
        <Btn variant="ghost" onClick={printReport}>
          Print
        </Btn>
        <Btn variant="ghost" onClick={() => setShowEmailModal(true)}>
          Email
        </Btn>
        <span style={{ color: T.textLo, fontSize: 12 }}>
          {loading ? "Loading..." : `${filtered.length} records`}
        </span>
      </div>

      {/* ── Table ── */}
      <Card style={{ padding: 0 }}>
        {loading ? (
          <div
            style={{
              color: T.textLo,
              fontSize: 13,
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            Loading logs...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              color: T.textLo,
              fontSize: 13,
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No records found.
          </div>
        ) : (
          <Table
            columns={[
              "Name",
              "Email",
              "College",
              "Student ID",
              "Reason",
              "Date",
              "Time",
            ]}
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
                <TD style={{ fontSize: 11 }}>{l.studentId}</TD>
                <TD style={{ fontSize: 11 }}>{l.reason}</TD>
                <TD style={{ fontSize: 11 }}>{l.date}</TD>
                <TD style={{ fontSize: 11 }}>{l.time}</TD>
              </>
            )}
          />
        )}
      </Card>

      <AnimatePresence>
        {showEmailModal && (
          <EmailModal onClose={() => setShowEmailModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageLogs;
