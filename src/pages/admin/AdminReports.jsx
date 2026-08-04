import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getReports, updateReportStatus } from "../../services/adminApi";

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-600",
  resolved: "bg-green-50 text-green-600",
  dismissed: "bg-gray-100 text-gray-500",
};

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getReports({ status, limit: 50 });
      setReports(data.reports);
    } catch (err) {
      toast.error(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const act = async (report, nextStatus) => {
    setBusyId(report._id);
    try {
      await updateReportStatus(report._id, {
        status: nextStatus,
        adminNote: notes[report._id] || "",
      });
      toast.success(`Report ${nextStatus}`);
      setReports((prev) => prev.filter((r) => r._id !== report._id));
    } catch (err) {
      toast.error(err.message || "Failed to update report");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Reports &amp; complaints</h1>

      <div className="flex gap-2">
        {["pending", "resolved", "dismissed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`text-sm px-3 py-1.5 rounded-lg capitalize ${
              status === s
                ? "bg-pink-500 text-white"
                : "bg-white border border-gray-300 text-gray-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-gray-400">No {status} reports.</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r._id} className="rounded-xl bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm text-gray-800">
                    <strong>{r.reporter?.name}</strong> reported{" "}
                    <strong>{r.reportedUser?.name}</strong>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full text-xs px-2 py-0.5 capitalize ${STATUS_STYLE[r.status]}`}
                >
                  {r.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">{r.reason}</p>

              {status === "pending" && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input
                    value={notes[r._id] || ""}
                    onChange={(e) =>
                      setNotes({ ...notes, [r._id]: e.target.value })
                    }
                    placeholder="Note (optional)"
                    className="flex-1 min-w-[160px] rounded-lg border border-gray-300 text-sm px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    disabled={busyId === r._id}
                    onClick={() => act(r, "resolved")}
                    className="text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 disabled:opacity-60"
                  >
                    Resolve
                  </button>
                  <button
                    disabled={busyId === r._id}
                    onClick={() => act(r, "dismissed")}
                    className="text-xs rounded-lg border border-gray-300 text-gray-600 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-60"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {r.adminNote && (
                <p className="mt-2 text-xs text-gray-400">Note: {r.adminNote}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
