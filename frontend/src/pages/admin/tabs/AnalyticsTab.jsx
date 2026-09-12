import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#9333ea', '#0284c7'];
const STATUS_COLORS = {
  pending: '#d97706',
  approved: '#16a34a',
  rejected: '#dc2626',
  completed: '#2563eb'
};

export default function AnalyticsTab() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics');
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  if (error) {
    return <div className="text-rose-500 p-8">Failed to load analytics data.</div>;
  }

  const { enrollments_by_month, scholarships_by_month, top_courses, scholarship_statuses } = data;

  // Merge trends by month for a combined chart
  const monthsSet = new Set([
    ...enrollments_by_month.map(d => d.month),
    ...scholarships_by_month.map(d => d.month)
  ]);
  const sortedMonths = Array.from(monthsSet).sort();
  
  const combinedTrends = sortedMonths.map(month => {
    const e = enrollments_by_month.find(x => x.month === month);
    const s = scholarships_by_month.find(x => x.month === month);
    return {
      month: new Date(`${month}-01`).toLocaleDateString('default', { month: 'short', year: '2-digit' }),
      enrollments: e ? e.count : 0,
      scholarships: s ? s.count : 0
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-medium text-2xl text-foreground">Analytics Overview</h3>
          <p className="text-sm text-muted-foreground mt-1">Key metrics and growth trends across all programs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Growth Trends Chart */}
        <div className="glass border border-border rounded-3xl p-6 shadow-sm col-span-1 lg:col-span-2">
          <div className="mb-6">
            <h4 className="font-display font-medium text-lg text-foreground">Acquisition Trends</h4>
            <p className="text-xs text-muted-foreground">Monthly inbound volume for regular enrollments vs scholarships</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => v} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" name="Enrollments" dataKey="enrollments" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorE)" />
                <Area type="monotone" name="Scholarships" dataKey="scholarships" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorS)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Courses Bar Chart */}
        <div className="glass border border-border rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h4 className="font-display font-medium text-lg text-foreground">Top Courses</h4>
            <p className="text-xs text-muted-foreground">Most popular regular programs by total enrollments</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top_courses} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="course_id" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <Tooltip cursor={{fill: 'var(--muted)', opacity: 0.4}} contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)' }} />
                <Bar dataKey="count" name="Enrollments" fill="#2563eb" radius={[0, 4, 4, 0]}>
                  {top_courses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scholarship Pipeline Status Pie Chart */}
        <div className="glass border border-border rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h4 className="font-display font-medium text-lg text-foreground">Scholarship Pipeline</h4>
            <p className="text-xs text-muted-foreground">Distribution of applicant statuses</p>
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            {scholarship_statuses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scholarship_statuses}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {scholarship_statuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status.toLowerCase()] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', textTransform: 'capitalize' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="capitalize">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">No status data available.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
