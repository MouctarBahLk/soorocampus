import { notFound, redirect } from 'next/navigation'
import { supabaseServer } from './supabase-server'

export async function requireUser() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login')
  return { sb, user }
}

export async function requireAdmin() {
  const { sb, user } = await requireUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') notFound() // renvoie un 404 (plus discret qu'un 403)
  return { sb, user }
}
