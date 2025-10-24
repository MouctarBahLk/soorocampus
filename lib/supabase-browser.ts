// lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anon) {
  // ❌ Ici c'est côté navigateur : si ça log en prod, c'est que Netlify
  // n'a pas injecté les variables dans le bundle au moment du build.
  console.error('❌ Supabase env missing in client bundle', {
    hasUrl: !!url,
    hasAnon: !!anon,
    url,
    anonPreview: anon?.slice(0, 8) // pour debug sans tout exposer
  })
  throw new Error('Config Supabase manquante (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)')
}

export const supabase = createBrowserClient(url, anon)
