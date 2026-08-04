export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 flex items-center gap-3">
      {Icon && (
        <div className="shrink-0 rounded-lg bg-pink-50 text-pink-500 p-2.5">
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xl font-semibold text-gray-800 tabular-nums">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
