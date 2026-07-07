import { AlertCircle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-amber-600" size={24} />
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>

        <p className="text-slate-600">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-50 font-medium transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-navy-800 hover:bg-navy-900"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
