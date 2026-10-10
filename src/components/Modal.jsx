import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, title, onClose, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const width = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg'

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 max-h-[92vh] w-full ${width} overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(92vh-64px)] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title = 'Konfirmasi', message, confirmLabel = 'Hapus', onConfirm, onCancel, danger = true }) {
  return (
    <Modal open={open} title={title} onClose={onCancel} size="sm">
      <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      <div className="mt-5 flex gap-3">
        <button onClick={onCancel} className="btn-ghost flex-1">
          Batal
        </button>
        <button onClick={onConfirm} className={`${danger ? 'btn-danger' : 'btn-primary'} flex-1`}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
