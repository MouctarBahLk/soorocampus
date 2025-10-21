// app/app/ressources/checklists/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { ArrowLeft, Download, CheckCircle2, FileText, Calendar, ListChecks } from 'lucide-react'

const CHECKLISTS = [
  {
    id: 'calendrier-retroplanning',
    title: 'Calendrier & Rétroplanning Complet',
    description: 'Timeline personnalisable selon ta date de rentrée',
    icon: Calendar,
    format: 'Excel (.xlsx)',
    size: '195 Ko',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    file: '/downloads/checklists/Retroplanning_Campus_France.xlsx',
  },
  {
    id: 'pieces-eef',
    title: 'Checklist Pièces EEF (Étude en France)',
    description: 'Liste exacte des documents par étape',
    icon: ListChecks,
    format: 'PDF',
    size: '280 Ko',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    file: '/downloads/checklists/Checklist_Pieces_EEF.pdf',
  },
  {
    id: 'pieces-visa',
    title: 'Checklist Pièces Visa Long Séjour',
    description: 'Documents requis selon ton pays',
    icon: FileText,
    format: 'PDF',
    size: '310 Ko',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    file: '/downloads/checklists/Checklist_Visa_Long_Sejour.pdf',
  },
  {
    id: 'arrivee-france',
    title: 'Checklist Arrivée en France',
    description: 'Les 30 premiers jours : priorités administratives',
    icon: CheckCircle2,
    format: 'PDF',
    size: '245 Ko',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    file: '/downloads/checklists/Checklist_Arrivee_France.pdf',
  },
  {
    id: 'deadlines-mensuelles',
    title: 'Deadlines par Mois',
    description: 'Octobre à Septembre : ce qu\'il faut faire',
    icon: Calendar,
    format: 'Excel (.xlsx)',
    size: '165 Ko',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    file: '/downloads/checklists/Deadlines_Mensuelles.xlsx',
  },
  {
    id: 'verification-dossier',
    title: 'Grille de Vérification Finale',
    description: 'Avant de soumettre ton dossier Campus France',
    icon: CheckCircle2,
    format: 'PDF',
    size: '190 Ko',
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    file: '/downloads/checklists/Grille_Verification_Finale.pdf',
  },
  {
    id: 'coherence-projet',
    title: 'Checklist Cohérence Projet',
    description: 'Points à valider pour un projet solide',
    icon: ListChecks,
    format: 'PDF',
    size: '220 Ko',
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    file: '/downloads/checklists/Checklist_Coherence_Projet.pdf',
  },
]

export default async function ChecklistsPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login?next=/app/ressources/checklists')

  const { data: payments } = await sb
    .from('payments')
    .select('status')
    .eq('user_id', user.id)

  const paid = !!payments?.some(p => p.status === 'succeeded')
  if (!paid) redirect('/app/paiements?locked=checklists')

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <Link 
            href="/app/premium" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 md:mb-6 transition text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Retour à la bibliothèque</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
                Checklists & Calendriers
              </h1>
              <p className="text-slate-600 text-sm md:text-lg">
                Rétroplanning, deadlines et vérifications par étape
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 md:px-4 py-2 rounded-xl self-start md:self-auto">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-green-700">
                {CHECKLISTS.length} checklists
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {CHECKLISTS.map((checklist) => {
              const IconComponent = checklist.icon
              return (
                <article
                  key={checklist.id}
                  className={`rounded-2xl border border-slate-200 ${checklist.bgColor} p-5 md:p-6 hover:shadow-lg transition-all duration-300 group`}
                >
                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${checklist.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                        {checklist.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 mt-1 line-clamp-2">
                        {checklist.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                    <span className="font-medium">{checklist.format}</span>
                    <span>{checklist.size}</span>
                  </div>

                  {/* Download Button */}
                  <a
                    href={checklist.file}
                    download
                    className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r ${checklist.color} text-white font-semibold py-2.5 md:py-3 rounded-xl transition-all hover:shadow-md text-sm md:text-base`}
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
            <Calendar className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              Besoin d'aide pour organiser ton calendrier ?
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-6 max-w-md mx-auto">
              Notre équipe peut t'aider à personnaliser ton rétroplanning selon ta situation
            </p>
            <Link
              href="/app/messages"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-xl transition-colors text-sm md:text-base"
            >
              Contacter l'équipe
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}