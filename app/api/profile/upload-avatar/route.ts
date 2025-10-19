import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const sb = await supabaseServer()
  const { data: { user }, error: authError } = await sb.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('avatar') as File | null
  if (!file || file.size === 0) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Image trop volumineuse (max 5MB)' }, { status: 400 })

  // Récupère l’ancien chemin pour pouvoir le supprimer si on remplace
  const { data: profile, error: profErr } = await sb
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .maybeSingle()
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 })

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${user.id}/${Date.now()}.${ext}`

  const up = await sb.storage.from('avatars').upload(path, file, { cacheControl: '0', upsert: true })
  if (up.error) return NextResponse.json({ error: up.error.message }, { status: 500 })

  const upd = await sb.from('profiles').update({ avatar_url: path }).eq('id', user.id).select('avatar_url').single()
  if (upd.error) {
    // rollback upload si update profil échoue
    await sb.storage.from('avatars').remove([path]).catch(() => {})
    return NextResponse.json({ error: upd.error.message }, { status: 500 })
  }

  // supprime l’ancien fichier si différent
  if (profile?.avatar_url && profile.avatar_url !== path) {
    await sb.storage.from('avatars').remove([profile.avatar_url]).catch(() => {})
  }

  return NextResponse.json({ success: true, path: upd.data.avatar_url })
}
