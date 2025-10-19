'use client'
import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import NavPublic from '@/components/NavPublic'
import FooterPublic from '@/components/FooterPublic'
import { ArrowLeft, Lock, CheckCircle2, Zap } from 'lucide-react'
import { ARTICLES } from '@/data/ressources'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const art = ARTICLES.find(a => a.slug === slug)

  return (
    <>
      <NavPublic />

      {!art ? (
        <main className="min-h-screen pt-32 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/ressources" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Retour aux ressources
            </Link>
            <div className="rounded-2xl border border-slate-200 p-8 text-center bg-white">
              <h1 className="text-2xl font-bold text-slate-900">Article introuvable</h1>
              <p className="mt-2 text-slate-600">Cet article n'existe pas ou a été supprimé.</p>
            </div>
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          {/* Header sticky */}
          <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <Link href="/ressources" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Ressources</span>
              </Link>
            </div>
          </div>

          {/* Hero */}
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg mb-8 h-96 bg-slate-100">
                <img src={art.cover} alt={art.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-100/80 px-3 py-1.5 rounded-full border border-blue-300 inline-block">
                    {art.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Accès gratuit</span>
                </div>

                <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                  {art.title}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                  {art.intro}
                </p>
              </div>
            </div>
          </section>

          {/* Contenu gratuit */}
          <article className="px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {art.freeSections.map(sec => (
                <section key={sec.title} className="rounded-2xl border border-slate-200 p-8 bg-white hover:shadow-md transition-shadow">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    {sec.title}
                  </h2>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                    {sec.content}
                  </p>
                </section>
              ))}

              {/* Paywall doux avec contenu premium aperçu */}
              <div className="mt-12 space-y-6">
                {/* Aperçu brouillé */}
                <section className="rounded-2xl border border-slate-200 p-8 bg-slate-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 flex items-center justify-center rounded-2xl">
                    <div className="text-center relative z-10">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-semibold text-slate-900 mb-1">Contenu premium</p>
                      <p className="text-sm text-slate-600">Débloque l'accès pour continuer</p>
                    </div>
                  </div>
                  <div className="blur-sm opacity-40 pointer-events-none">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      {art.premiumSections?.[0]?.title || 'Ressources avancées'}
                    </h3>
                    <ul className="space-y-2">
                      {art.premiumSections?.[0]?.bullets?.map((b, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <span className="font-bold flex-shrink-0">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* CTA principal */}
                <div className="rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 p-10 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-full">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-slate-900 mb-3">
                    Accès complet : modèles + checklists
                  </h3>
                  <p className="text-slate-600 mb-2 max-w-xl mx-auto text-lg">
                    Débloque les sections premium, modèles éditables, simulations d'entretien et un coaching personnalisé
                  </p>
                  <p className="text-sm text-slate-500 mb-6 max-w-xl mx-auto">
                    On gère tout avec toi — de la création du compte jusqu'à la validation de ton dossier
                  </p>

                  <ul className="space-y-2 mb-8 max-w-2xl mx-auto text-left text-slate-700">
                    {[
                      '✓ Modèles CV/LM et tous les documents',
                      '✓ Checklists étape par étape',
                      '✓ 5 simulations d\'entretien Campus France',
                      '✓ Coaching personnalisé',
                      '✓ Satisfaction garantie',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/auth/register"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Créer un compte gratuit
                    </Link>
                    <Link
                      href="/auth/login"
                      className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-colors"
                    >
                      J'ai déjà un compte
                    </Link>
                  </div>
                </div>

                {/* CTA secondaire */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Besoin d'aide pour ton dossier ?</p>
                    <p className="text-sm text-slate-600">
                      On s'occupe de tout ensemble — de la création du compte jusqu'à l'acceptation finale
                    </p>
                  </div>
                  <Link
                    href="/auth/register"
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    Commencer
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Footer CTA */}
          <section className="py-12 px-6 border-t border-slate-200">
            <div className="max-w-4xl mx-auto text-center">
              <Link href="/ressources" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeft className="w-4 h-4" />
                Voir tous les articles
              </Link>
            </div>
          </section>
        </main>
      )}

      <FooterPublic />
    </>
  )
}