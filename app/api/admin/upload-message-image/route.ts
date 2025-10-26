// app/api/admin/upload-message-image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const BUCKET = 'message-images'

async function requireAdmin() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return { ok: false, code: 401 as const, sb, user: null }
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin') return { ok: false, code: 403 as const, sb, user: null }
  return { ok: true, code: 200 as const, sb, user }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'forbidden' }, { status: auth.code })
  const { sb, user } = auth

  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Format non autorisé' }, { status: 400 })
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Fichier trop volumineux (max 5MB)' }, { status: 400 })

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const filename = `${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: upErr } = await sb.storage.from(BUCKET).upload(filename, buffer, {
      contentType: file.type, upsert: false
    })
    if (upErr) throw upErr

    const { data: signed } = await sb.storage.from(BUCKET).createSignedUrl(filename, 60 * 10)
    return NextResponse.json({ path: filename, url: signed?.signedUrl ?? null })
  } catch (e) {
    console.error('Erreur upload admin:', e)
    return NextResponse.json({ error: 'Erreur upload' }, { status: 500 })
  }
}

export const config = { api: { bodyParser: false } }
