export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
  children,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
        {children && <div className="mt-3">{children}</div>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
