// app/api/upload-message-image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const BUCKET = 'message-images' // Bucket privé

export async function POST(req: NextRequest) {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Type non autorisé (JPG, PNG, GIF, WEBP)' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 5MB)' }, { status: 400 })
    }

    // nom unique: <user_id>/<timestamp-rand>.<ext>
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const fileName = `${user.id}/${Date.now().toString()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: upErr } = await sb.storage.from(BUCKET).upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })
    if (upErr) {
      console.error('Erreur upload Supabase:', upErr)
      return NextResponse.json({ error: "Erreur lors de l'upload de l'image" }, { status: 500 })
    }

    // URL signée (1 an) – juste pour un aperçu direct si besoin
    const { data: signed } = await sb.storage.from(BUCKET).createSignedUrl(fileName, 60 * 60 * 24 * 365)

    return NextResponse.json({
      success: true,
      path: fileName,                 // <<< à stocker dans messages.image_path
      url: signed?.signedUrl ?? null, // optionnel (aperçu immédiat)
    })
  } catch (e) {
    console.error('Erreur upload image message:', e)
    return NextResponse.json({ error: "Erreur serveur lors de l'upload" }, { status: 500 })
  }
}

export const config = { api: { bodyParser: false } }
