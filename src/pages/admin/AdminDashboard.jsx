import { useEffect, useState } from "react";
import { Users, Crown, Sparkles, IndianRupee, TrendingUp } from "lucide-react";
import { getDashboard } from "../../services/adminApi";
import StatCard from "../../components/admin/StatCard";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading dashboard…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  const trend = data.signupTrend || [];
  const maxCount = Math.max(1, ...trend.map((d) => d.count));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total users" value={data.users} icon={Users} />
        <StatCard label="Active premium" value={data.activePremium} icon={Crown} />
        <StatCard label="Today's signups" value={data.todaySignups} icon={Sparkles} />
        <StatCard
          label="Revenue"
          value={`₹${Number(data.revenue).toLocaleString("en-IN")}`}
          icon={IndianRupee}
        />
        <StatCard
          label="Premium conversion"
          value={`${data.premiumConversionRate}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          Signups — last 7 days
        </h2>
        {trend.length === 0 ? (
          <p className="text-sm text-gray-400">No signups in this period.</p>
        ) : (
          <div className="flex items-end gap-3 h-32">
            {trend.map((d) => (
              <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-pink-400"
                  style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: 4 }}
                  title={`${d.count} signups`}
                />
                <span className="text-[10px] text-gray-400">
                  {d._id.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
