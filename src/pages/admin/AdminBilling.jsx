import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBilling, refundBilling } from "../../services/adminApi";
import ConfirmModal from "../../components/admin/ConfirmModal";

const STATUS_STYLE = {
  success: "bg-green-50 text-green-600",
  created: "bg-amber-50 text-amber-600",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-gray-100 text-gray-500",
};

export default function AdminBilling() {
  const [rows, setRows] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

  const [toRefund, setToRefund] = useState(null);
  const [refunding, setRefunding] = useState(false);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await getBilling({ status, from, to, page: p, limit: 20 });
      setRows(data.transactions);
      setRevenue(data.revenue);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      toast.error(err.message || "Failed to load billing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, from, to]);

  const confirmRefund = async () => {
    setRefunding(true);
    try {
      await refundBilling(toRefund._id);
      toast.success("Refund issued");
      setToRefund(null);
      load();
    } catch (err) {
      toast.error(err.message || "Refund failed");
    } finally {
      setRefunding(false);
    }
  };

  const exportCsv = () => {
    const header = ["Date", "User", "Order ID", "Payment ID", "Plan", "Amount", "Status"];
    const lines = rows.map((r) => [
      new Date(r.createdAt).toLocaleString(),
      r.userName,
      r.orderId,
      r.paymentId,
      r.plan,
      r.amount,
      r.status,
    ]);
    const csv = [header, ...lines].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "billing.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-gray-800">Billing &amp; payments</h1>
        <button
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="rounded-lg border border-gray-300 text-sm px-3 py-1.5 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-xl bg-white border border-gray-200 p-4 inline-block">
        <p className="text-xs text-gray-500">Revenue (filtered)</p>
        <p className="text-xl font-semibold text-gray-800 tabular-nums">
          ₹{Number(revenue).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 text-sm px-2 py-2"
        >
          <option value="">All status</option>
          <option value="success">Success</option>
          <option value="created">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-lg border border-gray-300 text-sm px-2 py-2"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-lg border border-gray-300 text-sm px-2 py-2"
        />
      </div>

      <div className="rounded-xl bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="px-4 py-2 font-medium">User</th>
              <th className="px-4 py-2 font-medium">Plan</th>
              <th className="px-4 py-2 font-medium">Amount</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-gray-800">{r.userName}</p>
                    <p className="text-xs text-gray-400">{r.userEmail}</p>
                  </td>
                  <td className="px-4 py-2.5 capitalize text-gray-600">{r.plan}</td>
                  <td className="px-4 py-2.5 tabular-nums text-gray-600">
                    ₹{Number(r.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full text-xs px-2 py-0.5 capitalize ${STATUS_STYLE[r.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {r.status === "success" && (
                      <button
                        onClick={() => setToRefund(r)}
                        className="text-xs rounded-lg border border-red-200 text-red-600 px-2.5 py-1 hover:bg-red-50"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {total} transaction{total === 1 ? "" : "s"} — page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => load(page - 1)}
              className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page >= pages}
              onClick={() => load(page + 1)}
              className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!toRefund}
        loading={refunding}
        danger
        title={`Refund ₹${toRefund?.amount}?`}
        message={`This issues a refund to ${toRefund?.userName} via Razorpay.`}
        confirmLabel="Issue refund"
        onCancel={() => setToRefund(null)}
        onConfirm={confirmRefund}
      />
    </div>
  );
}
