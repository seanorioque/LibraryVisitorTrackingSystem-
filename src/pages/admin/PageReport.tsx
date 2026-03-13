import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import T from "../../utils/theme.ts";
import User from "../../types/User.ts";
import { PIE_COLORS } from "../../constants/charts.ts";
import { exportToExcel } from "../../utils/export.ts";
import { fmt } from "../../utils/format.ts";
import EmailModal from "../../components/EmailModal.tsx";
import TD from "../../components/TD.tsx";
import Table from "../../components/Table.tsx";
import Card from "../../components/Card.tsx";
import { SectionTitle } from "../../components/SectionTitle.tsx";
import Btn from "../../components/Btn.tsx";
import printReport from "../../utils/printReport.ts";

// ── Types ──
interface Visit {
  uid: string;
  name: string;
  email: string;
  college: string;
  reason: string;
  timestamp: { seconds: number } | Date;
}

interface MonthlyEntry  { date: string; visitors: number }
interface CollegeEntry  { name: string; visitors: number; fill: string }
interface ReasonEntry   { name: string; value: number }

const toDate = (ts: Visit["timestamp"]): Date =>
  ts instanceof Date ? ts : new Date((ts as { seconds: number }).seconds * 1000);

const COLLEGE_COLORS = [
  T.accent, T.green, T.purple, T.yellow, T.red, "#06b6d4", "#f97316",
];

const PageReports = () => {
  const db = getFirestore();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyEntry[]>([]);
  const [collegeData, setCollegeData] = useState<CollegeEntry[]>([]);
  const [reasonData, setReasonData] = useState<ReasonEntry[]>([]);
  const [topVisitors, setTopVisitors] = useState<(User & { rank: number; visitCount: number; lastVisitDate: string })[]>([]);

  // ── Realtime: visits ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "visits"), (snap) => {
      setVisits(snap.docs.map((d) => d.data() as Visit));
    });
    return () => unsub();
  }, [db]);

  // ── Realtime: users ──
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<User, "id">) })));
      }
    );
    return () => unsub();
  }, [db]);

  // ── Derive chart data ──
  useEffect(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ── Monthly Traffic (current month, by day) ──
    const dayMap: Record<string, number> = {};
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const label = `${now.toLocaleString("default", { month: "short" })} ${d}`;
      dayMap[label] = 0;
    }
    visits.forEach((v) => {
      const d = toDate(v.timestamp);
      if (d >= thisMonth) {
        const label = `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`;
        if (label in dayMap) dayMap[label]++;
      }
    });
    setMonthlyData(Object.entries(dayMap).map(([date, visitors]) => ({ date, visitors })));

    // ── Visitors per College ──
    const collegeMap: Record<string, number> = {};
    visits.forEach((v) => {
      if (v.college) collegeMap[v.college] = (collegeMap[v.college] ?? 0) + 1;
    });
    setCollegeData(
      Object.entries(collegeMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name, visitors], i) => ({
          name,
          visitors,
          fill: COLLEGE_COLORS[i % COLLEGE_COLORS.length],
        }))
    );

    // ── Top Reasons ──
    const reasonMap: Record<string, number> = {};
    visits.forEach((v) => {
      if (v.reason) reasonMap[v.reason] = (reasonMap[v.reason] ?? 0) + 1;
    });
    setReasonData(
      Object.entries(reasonMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, value }))
    );

    // ── Top Visitors (from users + visit counts) ──
    const countMap: Record<string, number> = {};
    const latestMap: Record<string, number> = {};
    visits.forEach((v) => {
      if (!v.uid) return;
      countMap[v.uid] = (countMap[v.uid] ?? 0) + 1;
      const ts = (v.timestamp as { seconds: number })?.seconds
        ? (v.timestamp as { seconds: number }).seconds * 1000
        : new Date(v.timestamp as Date).getTime();
      if (!latestMap[v.uid] || ts > latestMap[v.uid]) latestMap[v.uid] = ts;
    });

    const ranked = users
      .map((u) => ({
        ...u,
        visitCount: countMap[u.uid] ?? 0,
        lastVisitDate: latestMap[u.uid]
          ? new Date(latestMap[u.uid]).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })
          : "No visits yet",
      }))
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 10)
      .map((u, i) => ({ ...u, rank: i + 1 }));

    setTopVisitors(ranked);
  }, [visits, users]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn onClick={() => exportToExcel(visits as unknown as Record<string, unknown>[], "full-report")}>
          Export to Excel
        </Btn>
        <Btn variant="ghost" onClick={printReport}>
          Print Report
        </Btn>
        <Btn variant="ghost" onClick={() => setShowEmailModal(true)}>
          Email Summary
        </Btn>
      </div>

      {/* ── Monthly Traffic ── */}
      <Card>
        <SectionTitle>
          Monthly Traffic — {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        </SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.purple} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="date" tick={{ fill: T.textLo, fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: T.textLo, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textHi }} />
            <Area type="monotone" dataKey="visitors" stroke={T.purple} fill="url(#monthGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* ── College + Reasons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Most Frequent by College</SectionTitle>
          {collegeData.length === 0 ? (
            <div style={{ color: T.textLo, fontSize: 12, textAlign: "center", padding: "24px 0" }}>No data yet</div>
          ) : (
            collegeData.map((c, i) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: c.fill + "33", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: c.fill, fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: T.textHi, fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ height: 4, background: T.elevated, borderRadius: 2, marginTop: 4 }}>
                    <div style={{
                      height: "100%", background: c.fill, borderRadius: 2,
                      width: `${(c.visitors / collegeData[0].visitors) * 100}%`,
                    }} />
                  </div>
                </div>
                <div style={{ color: c.fill, fontSize: 12, fontWeight: 700, minWidth: 36, textAlign: "right" }}>
                  {fmt(c.visitors)}
                </div>
              </div>
            ))
          )}
        </Card>

        <Card>
          <SectionTitle>Top Visit Reasons</SectionTitle>
          {reasonData.length === 0 ? (
            <div style={{ color: T.textLo, fontSize: 12, textAlign: "center", padding: "24px 0" }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reasonData} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                <XAxis type="number" tick={{ fill: T.textLo, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: T.textLo, fontSize: 10 }} axisLine={false} tickLine={false} width={95} />
                <Tooltip contentStyle={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textHi }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {reasonData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* ── Top Visitors Table ── */}
      <Card>
        <SectionTitle>Most Frequent Visitors</SectionTitle>
        {topVisitors.length === 0 ? (
          <div style={{ color: T.textLo, fontSize: 12, textAlign: "center", padding: "24px 0" }}>No data yet</div>
        ) : (
          <Table
            columns={["Rank", "Name", "Email", "College", "Total Visits", "Last Visit"]}
            data={topVisitors}
            renderRow={(u) => (
              <>
                <TD style={{ color: u.rank <= 3 ? T.yellow : T.textLo, fontWeight: 700 }}>
                  #{u.rank}
                </TD>
                <TD style={{ color: T.textHi, fontWeight: 500 }}>{u.name}</TD>
                <TD style={{ fontSize: 11 }}>{u.email}</TD>
                <TD style={{ fontSize: 11 }}>{u.college?.replace("College of ", "") ?? "—"}</TD>
                <TD>
                  <span style={{ color: T.accent, fontWeight: 700 }}>{u.visitCount}</span>
                </TD>
                <TD style={{ fontSize: 11 }}>{u.lastVisitDate}</TD>
              </>
            )}
          />
        )}
      </Card>

      {/* ── Email Modal ── */}
      <AnimatePresence>
        {showEmailModal && (
          <EmailModal onClose={() => setShowEmailModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageReports;