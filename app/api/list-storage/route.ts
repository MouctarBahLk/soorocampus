// app/api/list-storage/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  const sb = await supabaseServer()
  
  try {
    const BUCKET = 'documents'
    
    // Lister tous les dossiers utilisateurs
    const { data: folders, error: folderError } = await sb.storage
      .from(BUCKET)
      .list('', {
        limit: 1000,
        offset: 0,
      })
    
    if (folderError) {
      return NextResponse.json({ error: folderError.message }, { status: 500 })
    }

    const allFiles: any[] = []

    // Pour chaque dossier utilisateur, lister les fichiers
    for (const folder of folders || []) {
      if (folder.name) {
        const { data: files, error: filesError } = await sb.storage
          .from(BUCKET)
          .list(folder.name, {
            limit: 1000,
            offset: 0,
          })
        
        if (!filesError && files) {
          for (const file of files) {
            allFiles.push({
              user_folder: folder.name,
              file_name: file.name,
              full_path: `${folder.name}/${file.name}`,
              created_at: file.created_at,
              size: file.metadata?.size
            })
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Liste complète des fichiers dans Storage',
      total_folders: folders?.length || 0,
      total_files: allFiles.length,
      files: allFiles
    })

  } catch (error: any) {
    console.error('❌ Erreur listing storage:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}