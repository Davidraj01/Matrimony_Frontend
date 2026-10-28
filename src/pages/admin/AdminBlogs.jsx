import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  fileUrl,
} from "../../services/adminApi";
import ConfirmModal from "../../components/admin/ConfirmModal";
import RichTextEditor from "../../components/admin/RichTextEditor";

const emptyForm = { title: "", body: "", tags: "", status: "draft", coverImage: null };

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [confirmDuplicate, setConfirmDuplicate] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setBlogs(await getBlogs());
    } catch (err) {
      toast.error(err.message || "Failed to load blogs");
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

  const openEdit = (b) => {
    setEditing(b);
    setForm({
      title: b.title,
      body: b.body,
      tags: (b.tags || []).join(", "),
      status: b.status,
      coverImage: null,
    });
  };

  const isBodyEmpty = (html) => !html || html.replace(/<[^>]*>/g, "").trim() === "";

  // Catches the thing that actually created three duplicate posts in
  // production: the same title submitted again days later because whoever
  // wrote it didn't realize a post with that title was already published.
  // The backend silently appends "-1" to the slug rather than rejecting it,
  // so this is the only place that can warn before it happens.
  const findDuplicateTitle = (title) => {
    const normalized = title.trim().toLowerCase();
    if (!normalized) return null;
    return blogs.find(
      (b) => b._id !== editing?._id && b.title.trim().toLowerCase() === normalized,
    );
  };

  const duplicateBlog = editing ? findDuplicateTitle(form.title) : null;

  const doSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("body", form.body);
      fd.append("tags", form.tags);
      fd.append("status", form.status);
      if (form.coverImage) fd.append("coverImage", form.coverImage);

      if (editing._id) {
        const updated = await updateBlog(editing._id, fd);
        setBlogs((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
        toast.success("Blog updated");
      } else {
        const created = await createBlog(fd);
        setBlogs((prev) => [created, ...prev]);
        toast.success("Blog created");
      }
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (isBodyEmpty(form.body)) {
      toast.error("Body can't be empty");
      return;
    }
    const duplicate = findDuplicateTitle(form.title);
    if (duplicate) {
      setConfirmDuplicate(duplicate);
      return;
    }
    await doSave();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteBlog(toDelete._id);
      setBlogs((prev) => prev.filter((b) => b._id !== toDelete._id));
      toast.success("Blog deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Blogs</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-2"
        >
          <Plus size={16} /> New post
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : blogs.length === 0 ? (
        <p className="text-sm text-gray-400">No blog posts yet.</p>
      ) : (
        <div className="rounded-xl bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Tags</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {b.coverImage && (
                        <img
                          src={fileUrl(b.coverImage)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="font-medium text-gray-800">{b.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">
                    {(b.tags || []).join(", ")}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full text-xs px-2 py-0.5 capitalize ${
                        b.status === "published"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(b)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setToDelete(b)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                {editing._id ? "Edit post" : "New post"}
              </h3>
              <button type="button" onClick={() => setEditing(null)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
                />
                {duplicateBlog && (
                  <p className="mt-1 text-xs text-amber-600">
                    A {duplicateBlog.status} post with this exact title already
                    exists (created{" "}
                    {new Date(duplicateBlog.createdAt).toLocaleDateString()}).
                    Saving will create a separate post, not update it.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Body</label>
                <RichTextEditor
                  key={editing._id || "new"}
                  value={form.body}
                  onChange={(html) => setForm((prev) => ({ ...prev, body: html }))}
                  placeholder="Write the post..."
                />
                <p className="mt-1 text-xs text-gray-400">
                  Use headings for section titles and link out with the link
                  button — both help the post rank and read well once
                  published.
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 text-sm p-2 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cover image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, coverImage: e.target.files[0] })}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="rounded-lg border border-gray-300 text-sm px-2 py-1.5"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
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
        title={`Delete "${toDelete?.title}"?`}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        open={!!confirmDuplicate}
        loading={saving}
        danger
        title={`A post titled "${confirmDuplicate?.title}" already exists`}
        message={`It's currently ${confirmDuplicate?.status}. Saving this one will publish a second, separate post with the same title instead of updating the existing one.`}
        confirmLabel="Save anyway"
        onCancel={() => setConfirmDuplicate(null)}
        onConfirm={async () => {
          await doSave();
          setConfirmDuplicate(null);
        }}
      />
    </div>
  );
}
