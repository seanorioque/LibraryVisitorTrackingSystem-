import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { exportToExcel } from "../../utils/export.ts";

import VISIT_REASONS from "../../types/ReasonsForVisit.ts";
import T from "../../utils/theme.ts";
import { AnimatePresence } from "framer-motion";
import EmailModal from "../../components/EmailModal.tsx";
import TD from "../../components/TD.tsx";
import Table from "../../components/Table.tsx";
import Card from "../../components/Card.tsx";
import Btn from "../../components/Btn.tsx";
import Select from "../../components/Select.tsx";
import { printReport } from "../../utils/printReport.ts";
import Log from "../../types/Log.ts"
import toDate from "../../helpers/toDate.ts";
import normalizeReason from "../../types/normalizeReason.ts";





const PageLogs = () => {
  const db = getFirestore();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterCollege, setFilterCollege] = useState("all");
  const [filterReason, setFilterReason] = useState("all");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [colleges, setColleges] = useState<string[]>([]);

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
            reason: normalizeReason(v.reason ?? "—"),
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
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "colleges"), (snap) => {
      const names = snap.docs
        .map((d) => d.data().name as string)
        .filter(Boolean)
        .sort();
      setColleges(names);
    });
    return () => unsub();
  }, [db]);

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
            ...colleges.map((c: any) => ({ value: c, label: c })),
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
              "NEU-LIBRARY-VISIT-LOGS",
              "logs",
            )
          }
        >
          Export Excel
        </Btn>
        <Btn variant="ghost" onClick={() => printReport("print-logs-table")}>
          Print
        </Btn>
      </div>

      {/* ── Table ── */}
      <div id="print-logs-table">
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
      </div>
      {/* ← end print-logs-table */}

      <AnimatePresence>
        {showEmailModal && (
          <EmailModal onClose={() => setShowEmailModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageLogs;
