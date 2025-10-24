// lib/supabase-server.ts
import { cookies as nextCookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

/** Petite aide: lève une erreur nette si une env manque */
function must(name: string, v?: string) {
  if (!v) {
    // Log serveur clair (apparaitra dans tes logs d’hébergeur)
    console.error(`❌ Missing env: ${name}`)
    throw new Error(`Missing env: ${name}`)
  }
  return v
}

/** Compat: ancien nom */
export async function supabaseServer() {
  return supabaseServerReadOnly()
}

/**
 * À utiliser dans des Server Components (RSC) : lecture cookies OK,
 * écriture NOOP pour éviter "Cookies can only be modified..." en RSC.
 */
export async function supabaseServerReadOnly() {
  const cookieStore = await nextCookies()

  const url  = must("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anon = must("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      // NO-OP en RSC
      set(_name: string, _value: string, _options?: CookieOptions) {},
      remove(_name: string, _options?: CookieOptions) {},
    },
  })
}

/**
 * À utiliser UNIQUEMENT dans:
 * - une Server Action ("use server")
 * - un Route Handler (app/api/.../route.ts)
 * Ici on a le droit d'écrire des cookies.
 */
export async function supabaseServerAction() {
  const cookieStore = await nextCookies()

  const url  = must("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anon = must("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options?: CookieOptions) {
        cookieStore.set(name, value, options)
      },
      remove(name: string, options?: CookieOptions) {
        cookieStore.set(name, "", { ...options, maxAge: 0 })
      },
    },
  })
}
