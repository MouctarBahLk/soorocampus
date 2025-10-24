// app/api/admin/pricing/route.ts
// GET/PUT des prix globaux (settings.key='pricing') — ADMIN ONLY
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

function requireAdminOrThrow(profile: any) {
  if (!profile || profile.role !== 'admin') {
    throw NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}

export async function GET() {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).single()
    requireAdminOrThrow(me)

    const { data } = await sb.from('settings').select('value').eq('key', 'pricing').single()
    return NextResponse.json({
      settings: data?.value ?? {
        price_eur: 15000,
        price_xof: 100000,
        price_gnf: 1500000,
        allow_split_payment: false,
      },
    })
  } catch (e: any) {
    if (e?.status) return e
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const payload = await req.json()
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).single()
    requireAdminOrThrow(me)

    const value = {
      price_eur: Number(payload.price_eur ?? 15000),
      price_xof: Number(payload.price_xof ?? 100000),
      price_gnf: Number(payload.price_gnf ?? 1500000),
      allow_split_payment: !!payload.allow_split_payment,
    }

    const { error } = await sb
      .from('settings')
      .upsert({ key: 'pricing', value }, { onConflict: 'key' })
    if (error) throw error

    return NextResponse.json({ ok: true, settings: value })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}
