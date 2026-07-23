"use client";

import { useEffect, useState } from "react";
import { BookOpen, Mail, MessageSquare, Trophy } from "lucide-react";
import { api } from "@/lib/api";
import TableSkeleton from "@/components/admin/TableSkeleton";

const statCards = [
  { key: "courses", label: "Total Courses", icon: BookOpen, color: "bg-brand-primary" },
  { key: "enquiries", label: "Total Enquiries", icon: Mail, color: "bg-[#921313]" },
  { key: "results", label: "Total Results", icon: Trophy, color: "bg-brand-accent" },
  { key: "testimonials", label: "Total Testimonials", icon: MessageSquare, color: "bg-brand-secondary" },
];

export default function DashboardClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <TableSkeleton rows={4} cols={4} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {data?.stats?.[key] ?? 0}
                </p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${color}`}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
        <div className="mt-4 space-y-3">
          {data?.recentActivities?.length ? (
            data.recentActivities.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-medium capitalize text-slate-800">
                  {item.action} {item.entity}
                </span>
                <span className="text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No recent activities yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
