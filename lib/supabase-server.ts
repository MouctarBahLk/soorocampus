// lib/supabase-server.ts
import { cookies as nextCookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
// Compatibilité avec l'ancien nom
export async function supabaseServer() {
  return supabaseServerReadOnly()
}

/**
 * À utiliser dans les Server Components (pages/layouts).
 * -> lecture des cookies OK
 * -> écriture NO-OP pour éviter l'erreur "Cookies can only be modified..."
 */
export async function supabaseServerReadOnly() {
  const cookieStore = await nextCookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // NO-OP en lecture seule
        set(_name: string, _value: string, _options?: CookieOptions) {
          /* intentionally noop in RSC */
        },
        remove(_name: string, _options?: CookieOptions) {
          /* intentionally noop in RSC */
        },
      },
    }
  )
}

/**
 * À utiliser UNIQUEMENT dans:
 * - une Server Action ("use server")
 * - un Route Handler (app/api/.../route.ts)
 * Ici, on a le droit d'écrire des cookies.
 */
export async function supabaseServerAction() {
  const cookieStore = await nextCookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: CookieOptions) {
          // en Next 15: signature (name, value, options)
          cookieStore.set(name, value, options)
        },
        remove(name: string, options?: CookieOptions) {
          // supprime proprement
          cookieStore.set(name, "", { ...options, maxAge: 0 })
        },
      },
    }
  )
}
