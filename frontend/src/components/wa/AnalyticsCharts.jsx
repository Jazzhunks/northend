import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#25D366", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsCharts({ analytics }) {
  const statusData = useMemo(() => {
    if (!analytics?.by_status) return [];
    return Object.entries(analytics.by_status).map(([name, value]) => ({ name, value }));
  }, [analytics]);

  const costData = useMemo(() => {
    if (!analytics?.cost?.by_category) return [];
    return Object.entries(analytics.cost.by_category).map(([name, value]) => ({ name, value }));
  }, [analytics]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-4 rounded-2xl border border-border bg-background/40">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Delivery Status Breakdown
        </div>
        {statusData.length === 0 ? (
          <div className="text-sm text-muted-foreground">No data yet</div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="p-4 rounded-2xl border border-border bg-background/40">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Cost by Category (USD)
        </div>
        {costData.length === 0 ? (
          <div className="text-sm text-muted-foreground">No cost data yet</div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {costData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
