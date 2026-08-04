import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSettings, updateSettings, updateMyAccount } from "../../services/adminApi";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [toggling, setToggling] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [account, setAccount] = useState({
    name: currentUser.name || "",
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => toast.error(err.message || "Failed to load settings"));
  }, []);

  const toggleMaintenance = async () => {
    setToggling(true);
    try {
      const updated = await updateSettings({
        maintenanceMode: !settings.maintenanceMode,
      });
      setSettings(updated);
      toast.success(
        updated.maintenanceMode ? "Maintenance mode enabled" : "Maintenance mode disabled",
      );
    } catch (err) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setToggling(false);
    }
  };

  const saveAccount = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMyAccount(account);
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.name = res.name;
      localStorage.setItem("user", JSON.stringify(stored));
      toast.success("Account updated");
      setAccount({ name: res.name, currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-xl font-semibold text-gray-800">Settings</h1>

      <div className="rounded-xl bg-white border border-gray-200 p-4 space-y-3">
        <h2 className="text-sm font-medium text-gray-700">Site status</h2>
        {settings ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Maintenance mode</p>
              <p className="text-xs text-gray-500">
                When on, the site returns a maintenance message to everyone except admins.
              </p>
            </div>
            <button
              onClick={toggleMaintenance}
              disabled={toggling}
              className={`shrink-0 rounded-full w-11 h-6 flex items-center px-0.5 transition-colors ${
                settings.maintenanceMode ? "bg-red-500 justify-end" : "bg-gray-300 justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white block" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Loading…</p>
        )}
      </div>

      <form
        onSubmit={saveAccount}
        className="rounded-xl bg-white border border-gray-200 p-4 space-y-3"
      >
        <h2 className="text-sm font-medium text-gray-700">Your account</h2>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Name</label>
          <input
            value={account.name}
            onChange={(e) => setAccount({ ...account, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Current password</label>
          <input
            type="password"
            value={account.currentPassword}
            onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
            placeholder="Only needed when changing your password"
            className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">New password</label>
          <input
            type="password"
            value={account.newPassword}
            onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
            placeholder="Leave blank to keep current password"
            className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
