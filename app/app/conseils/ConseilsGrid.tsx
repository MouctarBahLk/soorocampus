'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Lock, CheckCircle2, ArrowRight } from 'lucide-react'
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
      <section className="pt-12 pb-8 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Conseils & Ressources</h1>
              <p className="text-slate-600">
                {paid
                  ? ' Accès complet activé — tous les guides et modèles déverrouillés'
                  : 'Guides gratuits + accès premium à 500+ ressources & accompagnement'}
              </p>
            </div>
            {paid && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Premium actif</span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tag === t
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Rechercher un article…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Aucun article trouvé</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(a => {
                const isAccessible = paid

                return (
                  <article
                    key={a.slug}
                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                      isAccessible
                        ? 'bg-white border-slate-200 hover:shadow-xl hover:border-blue-300'
                        : 'bg-white border-slate-200 hover:shadow-xl hover:border-amber-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={a.cover}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badge tag */}
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-semibold text-blue-700 bg-blue-100/95 backdrop-blur px-2.5 py-1 rounded-full border border-blue-200">
                          {a.tag}
                        </span>
                      </div>

                      {/* Lock/Unlock badge */}
                      <div className="absolute top-3 right-3">
                        {isAccessible ? (
                          <div className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100/95 backdrop-blur px-2.5 py-1 rounded-full border border-green-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Débloqué
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100/95 backdrop-blur px-2.5 py-1 rounded-full border border-amber-200">
                            <Lock className="w-3.5 h-3.5" />
                            Premium
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                        {a.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {a.excerpt}
                      </p>

                      {/* CTA Button */}
                      <div className="mt-4">
                        {isAccessible ? (
                          <Link
                            href={`/app/conseils/${a.slug}`}
                            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                          >
                            Ouvrir l'article
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <Link
                            href="/app/paiements"
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 font-semibold py-2.5 rounded-lg border border-amber-200 transition-all"
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Débloquez tous les guides</h2>
              <p className="mb-6 text-blue-100">
                Accès complet à 500+ ressources, modèles éditables, simulations d'entretien et accompagnement personnalisé
              </p>
              <Link
                href="/app/paiements"
                className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
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