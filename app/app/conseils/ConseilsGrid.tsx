'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Lock, CheckCircle2, ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import { ARTICLES_LITE } from '../../../data/ressources'

const TAGS = [
  'Tous',
  'Guide',
  'Checklist',
  'Conseils',
  'Outils',
  'Finances',
  'Entretien',
  'Visa',
  'Vie étudiante',
] as const

export default function ConseilsGrid({ initialPaid }: { initialPaid: boolean }) {
  const [tag, setTag] = useState<typeof TAGS[number]>('Tous')
  const [q, setQ] = useState('')
  const paid = initialPaid

  const results = useMemo(() => {
    let items = ARTICLES_LITE
    if (tag !== 'Tous') items = items.filter(a => a.tag === tag)
    if (q.trim()) {
      const s = q.toLowerCase()
      items = items.filter(
        a => a.title.toLowerCase().includes(s) || a.excerpt.toLowerCase().includes(s),
      )
    }
    return items
  }, [tag, q])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="px-6 py-12 border-b-2 border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Conseils & Ressources 
              </h1>
              <p className="text-xl text-gray-600">
                {paid
                  ? 'Accès complet activé — tous les guides et modèles déverrouillés'
                  : 'Guides gratuits + accès premium à 500+ ressources & accompagnement'}
              </p>
            </div>
            {paid && (
              <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 px-5 py-3 rounded-xl shadow-md">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <span className="text-sm font-bold text-green-700">Premium actif</span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              {TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    tag === t
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                      : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Rechercher un article…"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium text-lg">Aucun article trouvé</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map(a => {
                const isAccessible = paid

                return (
                  <article
                    key={a.slug}
                    className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-lg hover:shadow-2xl ${
                      isAccessible
                        ? 'bg-white border-blue-200 hover:border-blue-400 hover:-translate-y-1'
                        : 'bg-white border-slate-200 hover:border-amber-300 hover:-translate-y-1'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img
                        src={a.cover}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Badge tag */}
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-bold text-blue-700 bg-blue-100/95 backdrop-blur px-3 py-1.5 rounded-full border-2 border-blue-200 shadow-md">
                          {a.tag}
                        </span>
                      </div>

                      {/* Lock/Unlock badge */}
                      <div className="absolute top-4 right-4">
                        {isAccessible ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100/95 backdrop-blur px-3 py-1.5 rounded-full border-2 border-green-200 shadow-md">
                            <CheckCircle2 className="w-4 h-4" />
                            Débloqué
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100/95 backdrop-blur px-3 py-1.5 rounded-full border-2 border-amber-200 shadow-md">
                            <Lock className="w-4 h-4" />
                            Premium
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-3">
                        {a.title}
                      </h2>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                        {a.excerpt}
                      </p>

                      {/* CTA Button */}
                      <div className="mt-4">
                        {isAccessible ? (
                          <Link
                            href={`/app/conseils/${a.slug}`}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                          >
                            Ouvrir l'article
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <Link
                            href="/app/paiements"
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 font-bold py-3 rounded-xl border-2 border-amber-200 transition-all"
                          >
                            <Lock className="w-4 h-4" />
                            Débloquer l'accès
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA pour les non-payants */}
      {!paid && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-10 text-white text-center shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Débloquez tous les guides</h2>
              <p className="mb-8 text-blue-100 text-lg max-w-2xl mx-auto">
                Accès complet à 500+ ressources, modèles éditables, simulations d'entretien et accompagnement personnalisé
              </p>
              <Link
                href="/app/paiements"
                className="inline-block bg-white text-blue-600 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                Activer l'accès premium
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}