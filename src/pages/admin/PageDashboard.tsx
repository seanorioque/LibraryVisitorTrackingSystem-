import { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import T from "../../utils/theme.ts";
import PageId from "../../types/PageId.ts";
import { hourlyData, PIE_COLORS } from "../../constants/charts.ts";
import StatCard from "../../components/StatCard.tsx";
import Card from "../../components/Card.tsx";
import { SectionTitle } from "../../components/SectionTitle.tsx";
import Btn from "../../components/Btn.tsx";
import Visit from "../../types/Visit.ts"
import WeeklyEntry from "../../types/WeeklyEntry.ts";
import CollegeEntry from "../../types/CollegeEntry.ts";
import HourlyEntry from "../../types/HourlyEntry.ts"
import ReasonEntry from "../../types/ReasonEntry.ts";
import toDate from "../../helpers/toDate.ts";
import DAYS from "../../helpers/Days.ts";
import COLLEGE_COLORS from "../../helpers/CollegeColors.ts";


// ── Component ──────────────────────────────────────────────
export const PageDashboard = ({
  setPage,
}: {
  liveCount: number;
  setPage: (p: PageId) => void;
}) => {
  const db = getFirestore();


  const [visits, setVisits] = useState<Visit[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [weeklyData, setWeeklyData] = useState<WeeklyEntry[]>([]);
  const [collegeData, setCollegeData] = useState<CollegeEntry[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyEntry[]>([]);
  const [reasonData, setReasonData] = useState<ReasonEntry[]>([]);
  const [blockedCount, setBlockedCount] = useState(0);
  // ── Realtime listener ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const blocked = snap.docs.filter(
        (d) => d.data().status === "blocked",
      ).length;
      setBlockedCount(blocked);
    });
    return () => unsub();
  }, [db]);

  // ── Derive chart data from visits ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "visits"), (snap) => {
      const data = snap.docs.map((d) => d.data() as Visit);
      setVisits(data); // ← this is what uses setVisits
    });
    return () => unsub();
  }, [db]);
  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 29);

    // ── StatCards ──
    setTodayTotal(visits.filter((v) => toDate(v.timestamp) >= today).length);
    setWeekTotal(visits.filter((v) => toDate(v.timestamp) >= weekAgo).length);
    setMonthTotal(visits.filter((v) => toDate(v.timestamp) >= monthAgo).length);

    // ── Daily Traffic (last 7 days) ──
    const dayMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dayMap[DAYS[d.getDay()]] = 0;
    }
    visits.forEach((v) => {
      const d = toDate(v.timestamp);
      if (d >= weekAgo) {
        const label = DAYS[d.getDay()];
        if (label in dayMap) dayMap[label]++;
      }
    });
    setWeeklyData(
      Object.entries(dayMap).map(([day, visitors]) => ({ day, visitors })),
    );

    // ── Visitors per College ──
    const collegeMap: Record<string, number> = {};
    visits.forEach((v) => {
      if (v.college) collegeMap[v.college] = (collegeMap[v.college] ?? 0) + 1;
    });
    setCollegeData(
      Object.entries(collegeMap).map(([name, visitors], i) => ({
        name,
        visitors,
        fill: COLLEGE_COLORS[i % COLLEGE_COLORS.length],
      })),
    );

    //Library Opening Hours
    const hourMap: Record<string, number> = {};
    for (let h = 8; h <= 17; h++) {
      hourMap[`${h}:00`] = 0;
    }
    visits.forEach((v) => {
      const d = toDate(v.timestamp);
      if (d >= today) {
        const h = d.getHours();
        const label = h < 10 ? `0${h}:00` : `${h}:00`;
        if (label in hourMap) hourMap[label]++;
      }
    });
    setHourlyData(
      Object.entries(hourMap).map(([hour, count]) => ({ hour, count })),
    );

    // ── Top Reasons ──
    const reasonMap: Record<string, number> = {};
    visits.forEach((v) => {
      if (v.reason) reasonMap[v.reason] = (reasonMap[v.reason] ?? 0) + 1;
    });
    setReasonData(
      Object.entries(reasonMap).map(([name, value]) => ({ name, value })),
    );
  }, [visits]);

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── StatCards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
        }}
      >
        <StatCard
          label="Total Visitors Today"
          value={todayTotal}
          color={T.accent}
        />
        <StatCard label="This Week" value={weekTotal} color={T.green} />
        <StatCard
          label="This Month"
          value={monthTotal}
          color={T.purple}
          sub={new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        />
        <StatCard
          label="Blocked Users"
          value={blockedCount}
          color={T.red}
          sub=""
        />
      </div>

      {/* ── Quick Actions ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }} />
        <Btn variant="ghost" onClick={() => setPage("users")}>
          Manage Users
        </Btn>
        <Btn variant="ghost" onClick={() => setPage("logs")}>
          View Logs
        </Btn>
        <Btn variant="ghost" onClick={() => setPage("reports")}>
          Reports
        </Btn>
      </div>

      {/* ── Row 1: Daily Traffic + Visitors per College ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Daily Traffic (This Week)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis
                dataKey="day"
                tick={{ fill: T.textLo, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
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
                stroke={T.accent}
                fill="url(#colorV)"
                strokeWidth={2}
                dot={{ fill: T.accent, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Visitors per College</SectionTitle>
          {collegeData.length === 0 ? (
            <div
              style={{
                color: T.textLo,
                fontSize: 12,
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={collegeData} layout="vertical" barSize={10}>
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
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: T.elevated,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    color: T.textHi,
                  }}
                />
                <Bar dataKey="visitors" radius={[0, 4, 4, 0]}>
                  {collegeData.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* ── Row 2: Hourly Traffic + Top Reasons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Hourly Traffic (Today)</SectionTitle>
          <div
            style={{
              overflowX: "scroll",
              overflowY: "hidden",
              width: "100%", // ← constrained to card width
              paddingBottom: 8,
              scrollbarWidth: "thin",
              scrollbarColor: `${T.border} transparent`,
            }}
          >
            <LineChart
              width={900}
              height={200}
              data={hourlyData}
              margin={{ left: 8, right: 24, top: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis
                dataKey="hour"
                tick={{ fill: T.textLo, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fill: T.textLo, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={20}
              />
              <Tooltip
                contentStyle={{
                  background: T.elevated,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  color: T.textHi,
                }}
                labelFormatter={(label) => `🕐 ${label}`}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={T.yellow}
                strokeWidth={2}
                dot={{ fill: T.yellow, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </div>
        </Card>

        <Card>
          <SectionTitle>Top Reasons for Visit</SectionTitle>
          {reasonData.length === 0 ? (
            <div
              style={{
                color: T.textLo,
                fontSize: 12,
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={reasonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {reasonData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: T.elevated,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    color: T.textHi,
                  }}
                />
                <Legend
                  formatter={(v: string) => (
                    <span style={{ color: T.textLo, fontSize: 10 }}>{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PageDashboard;
