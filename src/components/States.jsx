/** Empty / loading / error state yang konsisten. */
export function EmptyState({ icon: Icon, title = 'Belum ada data', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
      {Icon && (
        <span className="mb-3 rounded-2xl bg-white p-3.5 text-slate-400 shadow-sm">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Loading({ label = 'Memuat...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-slate-500">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
      {label}
    </div>
  )
}

export function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
