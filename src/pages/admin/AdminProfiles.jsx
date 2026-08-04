import { useEffect, useState } from "react";
import { Search, Star, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  getProfiles,
  updateProfile,
  deleteProfile,
  toggleFeaturedProfile,
} from "../../services/adminApi";
import ConfirmModal from "../../components/admin/ConfirmModal";

const EDIT_FIELDS = [
  ["name", "Name"],
  ["age", "Age"],
  ["gender", "Gender"],
  ["height", "Height"],
  ["religion", "Religion"],
  ["caste", "Caste"],
  ["location", "Location"],
  ["education", "Education"],
  ["job", "Occupation"],
  ["income", "Income"],
  ["maritalStatus", "Marital status"],
  ["bio", "Bio"],
];

export default function AdminProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await getProfiles({ search, page: p, limit: 15 });
      setProfiles(data.profiles);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      toast.error(err.message || "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1);
  };

  const openEdit = (p) => {
    setEditing(p);
    const initial = {};
    EDIT_FIELDS.forEach(([key]) => (initial[key] = p[key] ?? ""));
    setForm(initial);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(editing._id, form);
      setProfiles((prev) => prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)));
      toast.success("Profile updated");
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFeature = async (p) => {
    try {
      const { isFeatured } = await toggleFeaturedProfile(p._id);
      setProfiles((prev) =>
        prev.map((row) => (row._id === p._id ? { ...row, isFeatured } : row)),
      );
      toast.success(isFeatured ? "Featured on homepage" : "Removed from homepage");
    } catch (err) {
      toast.error(err.message || "Failed to update");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteProfile(toDelete._id);
      toast.success("Profile deleted");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Profiles</h1>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, location, religion…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
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
              <th className="px-4 py-2 font-medium">Profile</th>
              <th className="px-4 py-2 font-medium">Location</th>
              <th className="px-4 py-2 font-medium">Contact</th>
              <th className="px-4 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : profiles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  No profiles found.
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr key={p._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      {p.name}
                      {p.isFeatured && (
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {p.age ? `${p.age} yrs` : ""} {p.gender}
                    </p>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{p.location || "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600">
                    <p>{p.userId?.email}</p>
                    <p className="text-xs text-gray-400">{p.userId?.phone}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        title={p.isFeatured ? "Unfeature" : "Feature on homepage"}
                        onClick={() => handleFeature(p)}
                        className={`p-1.5 rounded-lg hover:bg-amber-50 ${
                          p.isFeatured ? "text-amber-500" : "text-gray-400"
                        }`}
                      >
                        <Star size={16} />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setToDelete(p)}
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
            {total} profile{total === 1 ? "" : "s"} — page {page} of {pages}
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

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={saveEdit}
            className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                Edit {editing.name}'s profile
              </h3>
              <button type="button" onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {EDIT_FIELDS.map(([key, label]) => (
                <div key={key} className={key === "bio" ? "col-span-2" : ""}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  {key === "bio" ? (
                    <textarea
                      rows={3}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  ) : (
                    <input
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-pink-500 hover:bg-pink-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        loading={deleting}
        danger
        title={`Delete ${toDelete?.name}'s profile?`}
        message="This permanently removes the profile. This can't be undone."
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
