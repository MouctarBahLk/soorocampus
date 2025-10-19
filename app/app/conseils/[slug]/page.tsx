import Link from 'next/link'
import { ArrowLeft, Lock, CheckCircle2, BookOpen } from 'lucide-react'
import { ARTICLES } from '@/data/ressources'
import { PREMIUM_BY_SLUG } from '@/data/premium'
import { isUserPaid } from '@/lib/is-paid'

export default async function AppArticle({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Article
  const art = ARTICLES.find(a => a.slug === slug)
  if (!art) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-10 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/app/conseils" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Retour aux conseils
          </Link>
          <div className="rounded-2xl border border-slate-200 p-8 text-center bg-white">
            <h1 className="text-2xl font-bold text-slate-900">Article introuvable</h1>
            <p className="mt-2 text-slate-600">Cet article n'existe pas ou a été supprimé.</p>
          </div>
        </div>
      </main>
    )
  }

  // Paiement
  const { paid } = await isUserPaid()

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header avec retour */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/app/conseils" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          {paid && (
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Premium</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg mb-8 h-96 bg-slate-100">
            <img src={art.cover} alt={art.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Meta & Titre */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-blue-700 bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-200 inline-block">
              {art.tag}
            </span>

            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-3 leading-tight">
                {art.title}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                {art.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <article className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Sections gratuites */}
          {art.freeSections.map(s => (
            <section key={`free-${s.title}`} className="rounded-2xl border border-slate-200 p-8 bg-white hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {s.title}
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                {s.content}
              </p>
            </section>
          ))}

          {/* Section Premium */}
          {paid ? (
            <>
              {/* Contenu riche si disponible */}
              {PREMIUM_BY_SLUG[slug]?.sections?.length ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-900">Contenu Premium</h2>
                  </div>
                  {PREMIUM_BY_SLUG[slug].sections.map((sec, i) => (
                    <section key={`rich-${i}`} className="rounded-2xl border border-green-200 p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/30 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold text-green-900 mb-4">
                        {sec.title}
                      </h3>
                      <div
                        className="prose prose-lg max-w-none text-green-900/90 [&>*]:mb-3 [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>h1]:font-bold [&>h2]:font-bold [&>h3]:font-bold"
                        dangerouslySetInnerHTML={{ __html: sec.html }}
                      />
                    </section>
                  ))}
                </div>
              ) : (
                // Fallback avec puces
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-900">Contenu Premium</h2>
                  </div>
                  {art.premiumSections.map(sec => (
                    <section key={`pro-${sec.title}`} className="rounded-2xl border border-green-200 p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/30 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold text-green-900 mb-4">
                        {sec.title}
                      </h3>
                      <ul className="space-y-2">
                        {sec.bullets.map((b, i) => (
                          <li key={i} className="flex gap-3 text-green-900/90">
                            <span className="text-green-600 font-bold flex-shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}

              {/* CTA Bibliothèque */}
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-12">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Tous les modèles & checklists
                  </h3>
                  <p className="text-sm text-slate-600">
                    Retrouve tous tes documents téléchargeables centralisés
                  </p>
                </div>
                <Link
                  href="/app/premium"
                  className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Ouvrir la bibliothèque
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Aperçu du contenu premium (blurred) */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-slate-900">Contenu Premium</h2>
                </div>
                {art.premiumSections?.slice(0, 2).map(sec => (
                  <section key={`preview-${sec.title}`} className="rounded-2xl border border-slate-200 p-8 bg-slate-50 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-900">Contenu réservé aux membres premium</p>
                      </div>
                    </div>
                    <div className="blur-sm opacity-50 pointer-events-none">
                      <h3 className="text-xl font-bold text-slate-900 mb-4">
                        {sec.title}
                      </h3>
                      <ul className="space-y-2">
                        {sec.bullets.map((b, i) => (
                          <li key={i} className="flex gap-3 text-slate-700">
                            <span className="font-bold flex-shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ))}
              </div>

              {/* CTA Débloquer */}
              <div className="rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 text-center mt-12">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-full">
                    <Lock className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Accès complet : modèles + checklists
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Débloque les sections premium, modèles éditables, simulations d'entretien et accompagnement personnalisé
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/app/paiements"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                  >
                    Payer & débloquer maintenant
                  </Link>
                  <Link
                    href="/app/conseils"
                    className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors"
                  >
                    Continuer la lecture
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </article>

      {/* Footer */}
      <section className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/app/conseils" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Tous les articles
          </Link>
        </div>
      </section>
    </main>
  )
}