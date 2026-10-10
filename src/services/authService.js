import { supabase } from './supabase'

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return {
      ok: false,
      message: 'Email atau password salah.',
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('user_id', data.user.id)
    .maybeSingle()

  if (profileError || profile?.role !== 'admin') {
    await supabase.auth.signOut()

    return {
      ok: false,
      message: 'Akun ini tidak memiliki akses admin.',
    }
  }

  return {
    ok: true,
    user: data.user,
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return !error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) return null

  return data.session
}

export async function isAuthenticated() {
  const session = await getSession()

  if (!session?.user) return false

  const { data: profile, error } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .maybeSingle()

  return !error && profile?.role === 'admin'
}

export async function isAdmin() {
  return isAuthenticated()
}
