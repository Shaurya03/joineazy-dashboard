type ToastProps = {
  message: string
  type?: "success" | "error"
  onClose: () => void
}

function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm animate-[slideIn_0.25s_ease-out]">
      <div
        className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg ${type === "success"
            ? "border-emerald-200"
            : "border-red-200"
          }`}
      >
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {type === "success" ? "✓" : "!"}
        </div>

        <p className="flex-1 text-sm font-medium text-gray-700">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-700"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast