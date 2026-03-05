
import { exportToExcel } from "../../utils/export.ts";
import Colleges from "../../utils/College.ts";
import { useState,  } from "react";
import Reasons from "../../utils/Reasons.ts";
import Log from "../../types/Log.ts"
import { LOGS,  } from "./Admin.tsx";
import T from "../../utils/theme.ts"
import { AnimatePresence } from "framer-motion";
import EmailModal from "../../components/EmailModal.tsx";
import TD from "../../components/TD.tsx"
import Table from "../../components/Table.tsx";
import Card from "../../components/Card.tsx";
import Btn from "../../components/Btn.tsx"
import Select from "../../components/Select.tsx"
import printReport from "../../utils/printReport.ts";




const PageLogs = () => {
  const [logs] = useState<Log[]>(LOGS);
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

export default PageLogs;