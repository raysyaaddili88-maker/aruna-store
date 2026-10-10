
import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { login } from '../services/authService'
import { useSeo } from '../utils/seo'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
const [resetLoading, setResetLoading] = useState(false)
const [resetMessage, setResetMessage] = useState('')

const resetPassword = async () => {
  setResetMessage('')

  const cleanEmail = email.trim()

  if (!cleanEmail) {
    setResetMessage('Masukkan email admin terlebih dahulu.')
    return
  }

  setResetLoading(true)

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
        redirectTo: 'https://aruna-store.netlify.app/reset-password',
      },
    )

    if (error) {
      setResetMessage('Gagal mengirim email: ' + error.message)
    } else {
      setResetMessage(
        'Jika email terdaftar, tautan pemulihan akan dikirim. Periksa kotak masuk dan folder Spam.',
      )
    }
  } catch {
    setResetMessage('Terjadi kesalahan koneksi. Coba lagi nanti.')
  } finally {
    setResetLoading(false)
  }
}

  const navigate = useNavigate()
  const toast = useToast()

  useSeo({ title: 'Login Admin' })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login(email.trim(), password)

      if (res.ok) {
        toast.success('Berhasil login. Selamat datang!')
        navigate('/admin')
      } else {
        setError(res.message || 'Login gagal. Periksa email dan password.')
      }
    } catch {
      setError('Tidak dapat terhubung. Periksa koneksi internet dan konfigurasi Supabase.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="card p-6 sm:p-8">
        <span className="inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <LockKeyhole className="h-6 w-6" />
        </span>

        <h1 className="mt-4 text-xl font-extrabold text-slate-900">
          Login Admin
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Masuk menggunakan email admin yang terdaftar di Supabase.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              className="input"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email admin"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                className="input pr-11"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
              />

              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                aria-label={
                  show ? 'Sembunyikan password' : 'Tampilkan password'
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-600"
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={resetPassword}
              disabled={resetLoading}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-60"
            >
              {resetLoading ? 'Mengirim email...' : 'Lupa Password?'}
            </button>
          </div>

          {resetMessage && (
            <p role="status" className="rounded-xl bg-indigo-50 px-3 py-2.5 text-sm text-indigo-700">
              {resetMessage}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary h-12 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sedang masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}

