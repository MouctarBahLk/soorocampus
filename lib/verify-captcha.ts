// /lib/verify-captcha.ts

/**
 * Vérification booléenne (simple) — idéale en prod
 */
export async function verifyHCaptcha(token?: string): Promise<boolean> {
    const secret = process.env.HCAPTCHA_SECRET
    if (!secret) return true            // pas configuré -> on laisse passer en dev
    if (!token) return false            // secret présent -> token OBLIGATOIRE
  
    const body = new URLSearchParams({ secret, response: token })
    const res = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    })
  
    if (!res.ok) return false
    const data = await res.json().catch(() => ({}))
    return !!data?.success
  }
  
  /**
   * Vérification détaillée — utile pour DEBUG (retourne les error-codes hCaptcha)
   */
  export async function verifyHCaptchaDetailed(
    token?: string
  ): Promise<{ success: boolean; raw: any }> {
    const secret = process.env.HCAPTCHA_SECRET
    if (!secret) return { success: true, raw: { reason: "no-secret" } }
    if (!token)  return { success: false, raw: { "error-codes": ["missing-input-response"] } }
  
    const body = new URLSearchParams({ secret, response: token })
    const res = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    })
  
    const data = await res.json().catch(() => ({}))
    // 🔎 TEMP: garde ce log le temps du debug, puis retire-le
    console.log("hcaptcha verify:", data)
    return { success: !!data?.success, raw: data }
  }
  
  // Par commodité, export par défaut
  export default verifyHCaptcha
  