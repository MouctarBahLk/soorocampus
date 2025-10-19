'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import NavPublic from '@/components/NavPublic'
import FooterPublic from '@/components/FooterPublic'
import { Search, ArrowRight, Lock } from 'lucide-react'
import { ARTICLES_LITE } from '@/data/ressources'

const TAGS = ['Tous','Guide','Checklist','Conseils','Outils','Finances','Entretien','Visa','Vie étudiante'] as const

const tagStyles: Record<string, {chip: string; color: string; icon: string}> = {
  'Guide':          { chip:'text-blue-700 bg-blue-100/80 border-blue-300',      color:'from-blue-600 to-blue-700',      icon:'📚' },
  'Checklist':      { chip:'text-emerald-700 bg-emerald-100/80 border-emerald-300', color:'from-emerald-600 to-emerald-700', icon:'✓' },
  'Conseils':       { chip:'text-purple-700 bg-purple-100/80 border-purple-300',  color:'from-purple-600 to-purple-700',   icon:'💡' },
  'Outils':         { chip:'text-orange-700 bg-orange-100/80 border-orange-300',  color:'from-orange-600 to-orange-700',   icon:'🛠' },
  'Finances':       { chip:'text-amber-700 bg-amber-100/80 border-amber-300',     color:'from-amber-600 to-amber-700',    icon:'💰' },
  'Entretien':      { chip:'text-cyan-700 bg-cyan-100/80 border-cyan-300',        color:'from-cyan-600 to-cyan-700',     icon:'🎤' },
  'Visa':           { chip:'text-rose-700 bg-rose-100/80 border-rose-300',        color:'from-rose-600 to-rose-700',     icon:'🛂' },
  'Vie étudiante':  { chip:'text-teal-700 bg-teal-100/80 border-teal-300',        color:'from-teal-600 to-teal-700',     icon:'🎓' },
}

export default function ResourcesPage() {
  const [activeTag, setActiveTag] = useState<typeof TAGS[number]>('Tous')
  const [q, setQ] = useState('')
  const [noImg, setNoImg] = useState<Record<string, boolean>>({})

  const results = useMemo(() => {
    let items = ARTICLES_LITE
    if (activeTag !== 'Tous') items = items.filter(a => a.tag === activeTag)
    if (q.trim()) {
      const s = q.toLowerCase()
      items = items.filter(a => a.title.toLowerCase().includes(s) || a.excerpt.toLowerCase().includes(s))
    }
    return items
  }, [activeTag, q])

  return (
    <>
      <NavPublic />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero */}
        <section className="pt-32 pb-12 px-6 border-b border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-slate-900 mb-4">Ressources & Conseils</h1>
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                Guides gratuits pour bien préparer ton dossier. Pour débloquer modèles, checklists et coaching, crée un compte et choisis ton accompagnement.
              </p>
            </div>

            {/* Filtres */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTag === tag
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Rechercher un sujet…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grille */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">Aucun article trouvé</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(a => {
                  const s = tagStyles[a.tag] ?? tagStyles['Guide']
                  return (
                    <article
                      key={a.slug}
                      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        {!noImg[a.slug] ? (
                          <>
                            <img
                              src={a.cover}
                              alt={a.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={() => setNoImg(p => ({ ...p, [a.slug]: true }))}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                          </>
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${s.color}`} />
                        )}
                        
                        {/* Badge tag */}
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${s.chip} flex items-center gap-1.5`}>
                            <span>{s.icon}</span>
                            {a.tag}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2">
                          {a.title}
                        </h2>
                        <p className="text-sm text-slate-600 line-clamp-3 flex-1 mb-4">
                          {a.excerpt}
                        </p>

                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                          <Link
                            href={`/ressources/${a.slug}`}
                            className="flex-1 text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
                          >
                            Lire l'article
                          </Link>
                          <Link
                            href="/auth/register"
                            className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-semibold border border-blue-200 transition"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Premium
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-3">Débloquer l'accès complet</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Modèles éditables, checklists détaillées, simulations d'entretien et coaching personnalisé pour réussir ton dossier
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Créer un compte gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterPublic />
    </>
  )
}