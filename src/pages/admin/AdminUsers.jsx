import { useEffect, useState } from "react";
import { Search, ShieldOff, ShieldCheck, LogOut, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getUsers,
  blockUser,
  unblockUser,
  forceLogoutUser,
  deleteUser,
} from "../../services/adminApi";
import ConfirmModal from "../../components/admin/ConfirmModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(true);

  const [action, setAction] = useState(null); // { type, user }
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await getUsers({ search, status, plan, page: p, limit: 15 });
      setUsers(data.users);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, plan]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1);
  };

  const closeAction = () => {
    setAction(null);
    setReason("");
  };

  const runAction = async () => {
    if (!action) return;
    setBusy(true);
    try {
      if (action.type === "block") {
        await blockUser(action.user._id, reason);
        toast.success("User blocked");
      } else if (action.type === "unblock") {
        await unblockUser(action.user._id);
        toast.success("User unblocked");
      } else if (action.type === "logout") {
        await forceLogoutUser(action.user._id);
        toast.success("User signed out of all sessions");
      } else if (action.type === "delete") {
        await deleteUser(action.user._id);
        toast.success("User deleted");
      }
      closeAction();
      load();
    } catch (err) {
      toast.error(err.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const badge = (u) =>
    u.isBlocked ? (
      <span className="rounded-full bg-red-50 text-red-600 text-xs px-2 py-0.5">
        Blocked
      </span>
    ) : (
      <span className="rounded-full bg-green-50 text-green-600 text-xs px-2 py-0.5">
        Active
      </span>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Users</h1>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, ID…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 text-sm px-2 py-2"
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="rounded-lg border border-gray-300 text-sm px-2 py-2"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2"
        >
          Search
        </button>
      </form>

      <div className="rounded-xl bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Contact</th>
              <th className="px-4 py-2 font-medium">Plan</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.userUniqueId}</p>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">
                    <p>{u.email}</p>
                    <p className="text-xs text-gray-400">{u.phone}</p>
                  </td>
                  <td className="px-4 py-2.5 capitalize text-gray-600">
                    {u.subscription}
                  </td>
                  <td className="px-4 py-2.5">{badge(u)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      {u.isBlocked ? (
                        <button
                          title="Unblock"
                          onClick={() => setAction({ type: "unblock", user: u })}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-green-600"
                        >
                          <ShieldCheck size={16} />
                        </button>
                      ) : (
                        <button
                          title="Block"
                          onClick={() => setAction({ type: "block", user: u })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <ShieldOff size={16} />
                        </button>
                      )}
                      <button
                        title="Force logout"
                        onClick={() => setAction({ type: "logout", user: u })}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600"
                      >
                        <LogOut size={16} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setAction({ type: "delete", user: u })}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
            {total} user{total === 1 ? "" : "s"} — page {page} of {pages}
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
        open={!!action}
        loading={busy}
        onCancel={closeAction}
        onConfirm={runAction}
        danger={action?.type === "delete" || action?.type === "block"}
        title={
          action?.type === "block"
            ? `Block ${action.user.name}?`
            : action?.type === "unblock"
              ? `Unblock ${action.user.name}?`
              : action?.type === "logout"
                ? `Sign ${action?.user?.name} out of all sessions?`
                : action?.type === "delete"
                  ? `Delete ${action?.user?.name}'s account?`
                  : ""
        }
        message={
          action?.type === "delete"
            ? "This permanently removes the account and profile. This can't be undone."
            : action?.type === "logout"
              ? "Their current session token will stop working immediately."
              : undefined
        }
        confirmLabel={
          action?.type === "block"
            ? "Block"
            : action?.type === "unblock"
              ? "Unblock"
              : action?.type === "logout"
                ? "Sign out"
                : action?.type === "delete"
                  ? "Delete"
                  : "Confirm"
        }
      >
        {action?.type === "block" && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for blocking (optional)"
            rows={3}
            className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
          />
        )}
      </ConfirmModal>
    </div>
  );
}
