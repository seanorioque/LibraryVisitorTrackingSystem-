import { USERS,PageId, StatCard, T, RealTimePulse, Btn, Card, SectionTitle, weeklyData, collegeData,hourlyData,reasonData,PIE_COLORS} from "./Admin";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";
import React from "react";




export const PageDashboard = ({ liveCount, setPage }: { liveCount: number; setPage: (p: PageId) => void }) => {
  const todayTotal  = 247;
  const weekTotal   = 1432;
  const monthTotal  = 5891;
  const blockedCount = USERS.filter(u => u.status === "blocked").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <StatCard icon="👥" label="Total Visitors Today" value={todayTotal} color={T.accent} trend={12} />
        <StatCard icon="📅" label="This Week"            value={weekTotal}  color={T.green}  trend={5} />
        <StatCard icon="🗓️" label="This Month"           value={monthTotal} color={T.purple} sub="June 2025" />
        <StatCard icon="🚫" label="Blocked Users"        value={blockedCount} color={T.red}  sub="Click to manage" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <RealTimePulse count={liveCount} />
        <div style={{ flex: 1 }} />
        <Btn variant="ghost" onClick={() => setPage("users")}>👤 Manage Users</Btn>
        <Btn variant="ghost" onClick={() => setPage("logs")}>📋 View Logs</Btn>
        <Btn variant="ghost" onClick={() => setPage("reports")}>📊 Reports</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>📈 Daily Traffic (This Week)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="day" tick={{ fill: T.textLo, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textLo, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textHi }} />
              <Area type="monotone" dataKey="visitors" stroke={T.accent} fill="url(#colorV)" strokeWidth={2} dot={{ fill: T.accent, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>🏛️ Visitors per College</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={collegeData} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.textLo, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: T.textLo, fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textHi }} />
              <Bar dataKey="visitors" radius={[0, 4, 4, 0]}>
                {collegeData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>⏰ Hourly Traffic (Today)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="hour" tick={{ fill: T.textLo, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textLo, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textHi }} />
              <Line type="monotone" dataKey="count" stroke={T.yellow} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>📝 Top Reasons for Visit</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={reasonData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                {reasonData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textHi }} />
              <Legend formatter={(v: string) => <span style={{ color: T.textLo, fontSize: 10 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
export default PageDashboard;