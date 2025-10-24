'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { supabase } from '@/lib/supabase-browser'
import HelpInline from '@/components/help-inline'

function LoginForm() {
  const router = useRouter()
  const sp = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // 1) Garde sécurité (captcha + blocklist + log IP)
    try {
      const guardRes = await fetch('/api/security/guard-login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, captchaToken }),
      })
      const guardJson = await guardRes.json()
      if (!guardRes.ok) {
        setLoading(false)
        // Affiche l'erreur + (temp) debug si dispo
        return setError(guardJson.error || 'Erreur de sécurité.')
      }
    } catch (err: any) {
      setLoading(false)
      return setError('Impossible de vérifier la sécurité. Réessaie.')
    }

    // 2) Connexion Supabase
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)

    // 3) Redirection (inchangé)
    const res = await fetch('/api/me')
    const me = await res.json()
    const redirectFromQuery = sp.get('redirectTo')

    if (me.role === 'admin') router.replace('/app/admin')
    else if (redirectFromQuery) router.replace(redirectFromQuery)
    else router.replace('/app/tableau-de-bord/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Titre */}
        <div className="text-center mb-8">
          <img src="/logo_sooro.png" alt="Sooro Campus" className="h-20 w-16 rounded-full mx-auto mb-4 object-cover" />
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Bienvenue sur Sooro Campus
            </span>
          </h1>
          <p className="text-gray-600">Connecte-toi pour accéder à ton espace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ton.email@exemple.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* hCaptcha */}
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
              onVerify={(t) => setCaptchaToken(t)}
              onExpire={() => setCaptchaToken(undefined)}
            />

            <div className="flex items-center justify-end">
              <Link href="/auth/forgot" className="text-sm text-blue-700 hover:text-blue-800 font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || !captchaToken}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <HelpInline />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Pas encore de compte ?</span></div>
          </div>

          <Link href="/auth/register" className="block w-full text-center border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
            Créer un compte gratuitement
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  useEffect(() => {
    // Petit log pour confirmer que la sitekey est bien injectée côté client
    console.log('HC_SITEKEY client:', process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY)
  }, [])

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
