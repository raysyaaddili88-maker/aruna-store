import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, ShieldAlert } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { login } from '../services/authService'
import { useSeo } from '../utils/seo'

/**
 * Login demo. ⚠️ Produksi harus memvalidasi kredensial di backend/API.
 * Kredensial demo: admin / admin123
 */
export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  useSeo({ title: 'Login Admin' })

  const submit = (e) => {
    e.preventDefault()
    const res = login(username.trim(), password)
    if (res.ok) {
      toast.success('Berhasil login. Selamat datang!')
      navigate('/admin')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="card p-6 sm:p-8">
        <span className="inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <LockKeyhole className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold text-slate-900">Login Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Masuk untuk mengelola produk, banner, dan pengaturan toko.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="username">Username</label>
            <input
              id="username"
              className="input"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                className="input pr-11"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-600"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-600">{error}</p>}

          <button type="submit" className="btn-primary h-12 w-full">
            Masuk
          </button>
        </form>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <b>Demo:</b> username <code className="font-bold">admin</code>, password <code className="font-bold">admin123</code>.
            Autentikasi produksi wajib memakai backend/API — jangan simpan kredensial di frontend.
          </span>
        </div>
      </div>
    </div>
  )
}
