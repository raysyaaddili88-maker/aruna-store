import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [valid, setValid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      setValid(!error && Boolean(data.session))
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) setValid(true)
    })
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    if (password.length < 8) { setMessage('Password harus minimal 8 karakter.'); return }
    if (password !== confirmPassword) { setMessage('Konfirmasi password tidak cocok.'); return }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setMessage('Gagal mengubah password: ' + error.message); setSaving(false); return }
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Buat Password Baru</h1>
        <p className="mb-6 text-sm text-slate-600">Masukkan password baru untuk akun admin Aruna Store.</p>
        {checking ? <p>Memeriksa tautan pemulihan...</p> : !valid ? (
          <p className="text-red-600">Tautan pemulihan tidak valid atau sudah kedaluwarsa. Minta email reset password yang baru.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium">Password baru
              <input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3" placeholder="Minimal 8 karakter" />
            </label>
            <label className="block text-sm font-medium">Ulangi password baru
              <input type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3" placeholder="Masukkan password yang sama" />
            </label>
            {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
            <button type="submit" disabled={saving} className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Password Baru'}</button>
          </form>
        )}
      </section>
    </main>
  )
}
