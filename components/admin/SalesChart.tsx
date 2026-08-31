"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  return (
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="total" stroke="#2c3a32" fill="#e7d9c4" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
