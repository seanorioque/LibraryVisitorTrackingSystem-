import {
  Btn,
  Card,
  USERS,
  LOGS,
  printReport,
  SectionTitle,
  Table,
} from "./Admin";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import T from "../../utils/theme.ts";
import User from "../../types/User.ts";
import monthlyData from "../../mocks/monthlyData.ts";
import collegeData from "../../mocks/collegeData.ts";
import reasonData from "../../mocks/reasonData.ts";
import { PIE_COLORS } from "../../constants/charts.ts";
import { exportToExcel } from "../../utils/export.ts";
import { fmt } from "../../utils/format.ts";
import EmailModal from "../../components/EmailModal.tsx";
import TD from "../../components/TD.tsx"

const PageReports = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const topVisitors = [...USERS]
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);
  const topColleges = [...collegeData].sort((a, b) => b.visitors - a.visitors);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn
          onClick={() =>
            exportToExcel(
              LOGS as unknown as Record<string, unknown>[],
              "full-report",
            )
          }
        >
          📥 Export to Excel
        </Btn>
        <Btn variant="ghost" onClick={printReport}>
          🖨️ Print Report
        </Btn>
        <Btn variant="ghost" onClick={() => setShowEmailModal(true)}>
          📧 Email Summary
        </Btn>
      </div>

      <Card>
        <SectionTitle>📅 Monthly Traffic — June 2025</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.purple} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis
              dataKey="date"
              tick={{ fill: T.textLo, fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: T.textLo, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: T.elevated,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                color: T.textHi,
              }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke={T.purple}
              fill="url(#monthGrad)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>🏆 Most Frequent by College</SectionTitle>
          {topColleges.map((c, i) => (
            <div
              key={c.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: c.fill + "33",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: c.fill,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: T.textHi, fontSize: 12, fontWeight: 500 }}>
                  {c.name}
                </div>
                <div
                  style={{
                    height: 4,
                    background: T.elevated,
                    borderRadius: 2,
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: c.fill,
                      borderRadius: 2,
                      width: `${(c.visitors / topColleges[0].visitors) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  color: c.fill,
                  fontSize: 12,
                  fontWeight: 700,
                  minWidth: 36,
                  textAlign: "right",
                }}
              >
                {fmt(c.visitors)}
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle>📋 Top Visit Reasons</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reasonData} layout="vertical" barSize={12}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={T.border}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: T.textLo, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: T.textLo, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={95}
              />
              <Tooltip
                contentStyle={{
                  background: T.elevated,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  color: T.textHi,
                }}
              />
              <Bar dataKey="value" fill={T.cyan} radius={[0, 4, 4, 0]}>
                {reasonData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <SectionTitle>👑 Most Frequent Visitors</SectionTitle>
        <Table
          columns={[
            "Rank",
            "Name",
            "Email",
            "College",
            "Total Visits",
            "Last Visit",
          ]}
          data={topVisitors.map((u, i) => ({ ...u, rank: i + 1 }))}
          renderRow={(u: User & { rank: number }) => (
            <>
              <TD
                style={{
                  color: u.rank <= 3 ? T.yellow : T.textLo,
                  fontWeight: 700,
                }}
              >
                #{u.rank}
              </TD>
              <TD style={{ color: T.textHi, fontWeight: 500 }}>{u.name}</TD>
              <TD style={{ fontSize: 11 }}>{u.email}</TD>
              <TD style={{ fontSize: 11 }}>
                {u.college.replace("College of ", "")}
              </TD>
              <TD>
                <span style={{ color: T.accent, fontWeight: 700 }}>
                  {u.visits}
                </span>
              </TD>
              <TD style={{ fontSize: 11 }}>{u.lastVisit}</TD>
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
export default PageReports;
