import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext({ toast: () => {} })

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const toast = useCallback(
    (message, type = 'success') => {
      const id = (idSeq += 1)
      setToasts((list) => [...list, { id, message, type }])
      timers.current[id] = setTimeout(() => dismiss(id), 3200)
      return id
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      toast,
      success: (m) => toast(m, 'success'),
      error: (m) => toast(m, 'error'),
      info: (m) => toast(m, 'info'),
    }),
    [toast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-medium shadow-xl ${
              t.type === 'error' ? 'border-rose-200 text-rose-700' : t.type === 'info' ? 'border-sky-200 text-sky-700' : 'border-emerald-200 text-emerald-700'
            }`}
          >
            <span className="mt-0.5 shrink-0">
              {t.type === 'error' ? (
                <XCircle className="h-5 w-5" />
              ) : t.type === 'info' ? (
                <Info className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </span>
            <span className="flex-1 text-slate-700">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Tutup notifikasi"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
