import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getNotifications,
  sendNotification,
  sendExpiryReminders,
} from "../../services/adminApi";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ title: "", message: "", audience: "all" });
  const [sending, setSending] = useState(false);
  const [remindersBusy, setRemindersBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setNotifications(await getNotifications());
    } catch (err) {
      toast.error(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const created = await sendNotification(form);
      setNotifications((prev) => [created, ...prev]);
      toast.success(`Sent to ${created.recipientCount} user(s)`);
      setForm({ title: "", message: "", audience: "all" });
    } catch (err) {
      toast.error(err.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const remindExpiring = async () => {
    setRemindersBusy(true);
    try {
      const created = await sendExpiryReminders();
      setNotifications((prev) => [created, ...prev]);
      toast.success(`Reminder sent to ${created.recipientCount} user(s)`);
    } catch (err) {
      toast.error(err.message || "Failed to send reminders");
    } finally {
      setRemindersBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Notifications</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <form
          onSubmit={submit}
          className="rounded-xl bg-white border border-gray-200 p-4 space-y-3"
        >
          <h2 className="text-sm font-medium text-gray-700">Send an announcement</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Message</label>
            <textarea
              required
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Audience</label>
            <select
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              className="rounded-lg border border-gray-300 text-sm px-2 py-1.5"
            >
              <option value="all">All users</option>
              <option value="premium">Premium users</option>
              <option value="free">Free users</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </form>

        <div className="rounded-xl bg-white border border-gray-200 p-4 space-y-3">
          <h2 className="text-sm font-medium text-gray-700">Plan-expiry reminder</h2>
          <p className="text-sm text-gray-500">
            One click, sends a reminder to every premium user whose plan expires in
            the next 7 days.
          </p>
          <button
            onClick={remindExpiring}
            disabled={remindersBusy}
            className="rounded-lg border border-pink-300 text-pink-600 hover:bg-pink-50 text-sm px-4 py-2 disabled:opacity-60"
          >
            {remindersBusy ? "Sending…" : "Send expiry reminders"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-2">Sent history</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-400">No notifications sent yet.</p>
        ) : (
          <div className="rounded-xl bg-white border border-gray-200 divide-y divide-gray-100">
            {notifications.map((n) => (
              <div key={n._id} className="p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-800">{n.title}</p>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {n.audience} · {n.recipientCount} recipient
                  {n.recipientCount === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
