import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  getStories,
  createStory,
  updateStory,
  deleteStory,
  fileUrl,
} from "../../services/adminApi";
import ConfirmModal from "../../components/admin/ConfirmModal";

const emptyForm = { coupleNames: "", story: "", isPublished: true, photo: null };

export default function AdminStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setStories(await getStories());
    } catch (err) {
      toast.error(err.message || "Failed to load success stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing({});
    setForm(emptyForm);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      coupleNames: s.coupleNames,
      story: s.story,
      isPublished: s.isPublished,
      photo: null,
    });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("coupleNames", form.coupleNames);
      fd.append("story", form.story);
      fd.append("isPublished", form.isPublished);
      if (form.photo) fd.append("photo", form.photo);

      if (editing._id) {
        const updated = await updateStory(editing._id, fd);
        setStories((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
        toast.success("Story updated");
      } else {
        const created = await createStory(fd);
        setStories((prev) => [created, ...prev]);
        toast.success("Story added");
      }
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Failed to save story");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteStory(toDelete._id);
      setStories((prev) => prev.filter((s) => s._id !== toDelete._id));
      toast.success("Story deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete story");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Success stories</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-2"
        >
          <Plus size={16} /> Add story
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : stories.length === 0 ? (
        <p className="text-sm text-gray-400">No success stories yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => (
            <div key={s._id} className="rounded-xl bg-white border border-gray-200 overflow-hidden">
              {s.photo && (
                <img
                  src={fileUrl(s.photo)}
                  alt={s.coupleNames}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-36 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-gray-800">{s.coupleNames}</h3>
                  <span
                    className={`shrink-0 text-xs rounded-full px-2 py-0.5 ${
                      s.isPublished
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {s.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{s.story}</p>
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setToDelete(s)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                {editing._id ? "Edit story" : "Add story"}
              </h3>
              <button type="button" onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Couple names</label>
                <input
                  required
                  value={form.coupleNames}
                  onChange={(e) => setForm({ ...form, coupleNames: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Story</label>
                <textarea
                  required
                  rows={4}
                  value={form.story}
                  onChange={(e) => setForm({ ...form, story: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
                  className="w-full text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                />
                Published on homepage
              </label>
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
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        loading={deleting}
        danger
        title={`Delete ${toDelete?.coupleNames}'s story?`}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
