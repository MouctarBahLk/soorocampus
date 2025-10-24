// Active/désactive le 2× pour un étudiant
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const j = (s: number, p: any) => NextResponse.json(p, { status: s })
const unauthorized = () => j(401, { error: 'Unauthorized' })
const forbidden    = () => j(403, { error: 'Forbidden' })

export async function PUT(req: Request) {
  try {
    const { student_id, enabled } = await req.json()
    if (!student_id || typeof enabled !== 'boolean')
      return j(400, { error: 'Bad request' })

    const sb = await supabaseServer()

    // Auth
    const { data: { user }, error: userErr } = await sb.auth.getUser()
    if (userErr) return j(500, { error: userErr.message })
    if (!user)   return unauthorized()

    // Vérif admin
    const { data: me, error: meErr } = await sb
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()
    if (meErr)   return j(500, { error: meErr.message })
    if (me?.role !== 'admin') return forbidden()

    const { error } = await sb
      .from('profiles')
      .update({ split_payment_enabled: enabled })
      .eq('id', student_id)
    if (error) return j(500, { error: error.message })

    return j(200, { ok: true })
  } catch (e: any) {
    console.error('PUT /api/admin/students/split-payment fatal:', e)
    return j(500, { error: e?.message ?? 'Server error' })
  }
}
