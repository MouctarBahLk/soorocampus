// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

type MessageRow = {
  id: string
  contenu: string | null
  image_path: string | null
  created_at: string
  is_from_admin: boolean | null
}

export async function GET(_req: NextRequest) {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { data, error } = await sb
      .from('messages')
      .select('id, contenu, image_path, created_at, is_from_admin')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erreur récupération messages:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des messages' }, { status: 500 })
    }

    const rows = (data ?? []) as MessageRow[]

    const messages = await Promise.all(rows.map(async (m) => {
      let image_url: string | null = null
      if (m.image_path) {
        const { data: signed, error: signErr } = await sb
          .storage.from('message-images')
          .createSignedUrl(m.image_path, 60 * 10) // 10 min
        if (!signErr) image_url = signed?.signedUrl ?? null
      }
      return {
        id: m.id,
        body: m.contenu ?? '',
        image_url,
        created_at: m.created_at,
        is_from_admin: !!m.is_from_admin,
      }
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Erreur GET messages:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await req.json()
    const contenu: string | undefined = body?.contenu ?? body?.body
    const image_path: string | null = body?.image_path ?? body?.image_url ?? null

    if (!contenu && !image_path) {
      return NextResponse.json({ error: 'Le message ne peut pas être vide' }, { status: 400 })
    }
    if (contenu && contenu.length > 5000) {
      return NextResponse.json({ error: 'Message trop long (max 5000 caractères)' }, { status: 400 })
    }

    const { data: inserted, error } = await sb
      .from('messages')
      .insert({
        user_id: user.id,
        contenu: contenu ?? '',
        image_path,
        is_from_admin: false,
        created_at: new Date().toISOString(),
      })
      .select('id, contenu, image_path, created_at, is_from_admin')
      .single()

    if (error) {
      console.error('Erreur insertion message:', error)
      return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 })
    }

    let image_url: string | null = null
    if (inserted?.image_path) {
      const { data: signed } = await sb
        .storage.from('message-images')
        .createSignedUrl(inserted.image_path, 60 * 10)
      image_url = signed?.signedUrl ?? null
    }

    return NextResponse.json({
      success: true,
      message: {
        id: inserted.id,
        body: inserted.contenu ?? '',
        image_url,
        created_at: inserted.created_at,
        is_from_admin: !!inserted.is_from_admin,
      },
    })
  } catch (error) {
    console.error('Erreur POST message:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
