// Liste les étudiants pour activer/désactiver le 2×
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const j = (s: number, p: any) => NextResponse.json(p, { status: s })
const unauthorized = () => j(401, { error: 'Unauthorized' })
const forbidden    = () => j(403, { error: 'Forbidden' })

export async function GET() {
  try {
    const sb = await supabaseServer()

    // Auth
    const { data: { user }, error: userErr } = await sb.auth.getUser()
    if (userErr) return j(500, { error: userErr.message })
    if (!user)   return unauthorized()

    // Vérif admin (role='admin' dans profiles)
    const { data: me, error: meErr } = await sb
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()
    if (meErr)   return j(500, { error: meErr.message })
    if (me?.role !== 'admin') return forbidden()

    // Récupération (colonnes existantes uniquement)
    const { data, error } = await sb
      .from('profiles')
      .select('id, email, full_name, split_payment_enabled, role, created_at')
      .order('created_at', { ascending: false })
    if (error) return j(500, { error: error.message })

    // Filtre côté serveur : on exclut les admins
    const students = (data ?? [])
      .filter((p: any) => p?.role !== 'admin')
      .map((p: any) => ({
        id: p.id,
        email: p.email ?? '',
        name: p.full_name || p.email || '',
        split_payment_enabled: !!p.split_payment_enabled,
      }))

    return j(200, { students })
  } catch (e: any) {
    console.error('GET /api/admin/students fatal:', e)
    return j(500, { error: e?.message ?? 'Server error' })
  }
}
