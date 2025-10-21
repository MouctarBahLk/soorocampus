// app/app/ressources/visa/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { ArrowLeft, Download, CheckCircle, FileText, Zap, Globe } from 'lucide-react'

const VISA_DOCS = [
  {
    id: 'checklist-generale',
    title: 'Checklist Visa Long Séjour (VLS-TS)',
    description: 'Documents requis universels + spécificités par pays',
    icon: CheckCircle,
    format: 'PDF',
    size: '340 Ko',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    file: '/downloads/visa/Checklist_Visa_Long_Sejour.pdf',
  },
  {
    id: 'formulaire-prerempli',
    title: 'Formulaire Visa Prérempli (Exemple)',
    description: 'Modèle complété pour t\'aider à remplir le tien',
    icon: FileText,
    format: 'PDF',
    size: '420 Ko',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    file: '/downloads/visa/Formulaire_Visa_Exemple.pdf',
  },
  {
    id: 'guide-tls-contact',
    title: 'Guide TLS Contact / VFS Global',
    description: 'Prise de RDV, pièces, dépôt et suivi',
    icon: Zap,
    format: 'PDF',
    size: '385 Ko',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    file: '/downloads/visa/Guide_TLS_VFS.pdf',
  },
  {
    id: 'relances-consulat',
    title: 'Modèles Relances Consulat',
    description: 'Emails types pour accélérer le traitement',
    icon: FileText,
    format: 'Word (.docx)',
    size: '95 Ko',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    file: '/downloads/visa/Relances_Consulat.docx',
  },
  {
    id: 'plan-b-creneaux',
    title: 'Plan B : Créneaux Rares',
    description: 'Stratégies si pas de disponibilités RDV',
    icon: Zap,
    format: 'PDF',
    size: '280 Ko',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    file: '/downloads/visa/Plan_B_Creneaux_Rares.pdf',
  },
  {
    id: 'specificites-pays',
    title: 'Spécificités par Pays (Top 20)',
    description: 'Algérie, Maroc, Cameroun, Sénégal, etc.',
    icon: Globe,
    format: 'PDF',
    size: '520 Ko',
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    file: '/downloads/visa/Specificites_Pays.pdf',
  },
]

export default async function VisaPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login?next=/app/ressources/visa')

  const { data: payments } = await sb
    .from('payments')
    .select('status')
    .eq('user_id', user.id)

  const paid = !!payments?.some(p => p.status === 'succeeded')
  if (!paid) redirect('/app/paiements?locked=visa')

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
                Ressources Visa Long Séjour
              </h1>
              <p className="text-slate-600 text-sm md:text-lg">
                VLS-TS, TLS Contact, relances et spécificités par pays
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 md:px-4 py-2 rounded-xl self-start md:self-auto">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-green-700">
                {VISA_DOCS.length} ressources
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {VISA_DOCS.map((doc) => {
              const IconComponent = doc.icon
              return (
                <article
                  key={doc.id}
                  className={`rounded-2xl border border-slate-200 ${doc.bgColor} p-5 md:p-6 hover:shadow-lg transition-all duration-300 group`}
                >
                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${doc.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                        {doc.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 mt-1 line-clamp-2">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                    <span className="font-medium">{doc.format}</span>
                    <span>{doc.size}</span>
                  </div>

                  {/* Download Button */}
                  <a
                    href={doc.file}
                    download
                    className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r ${doc.color} text-white font-semibold py-2.5 md:py-3 rounded-xl transition-all hover:shadow-md text-sm md:text-base`}
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

      {/* Warning Box */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-orange-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                  ⚠️ Important : Délais de traitement
                </h2>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  Le visa peut prendre <strong>2 à 8 semaines</strong> selon ton pays. 
                  Anticipe au maximum et prends ton RDV dès que possible. 
                  Si tu rencontres des difficultés, notre équipe peut t'aider.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/app/conseils/visa-long-sejour"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm md:text-base"
              >
                Lire le guide visa
              </Link>
              <Link
                href="/app/messages?topic=visa"
                className="inline-flex items-center justify-center gap-2 border-2 border-orange-300 text-orange-700 hover:bg-orange-100 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm md:text-base"
              >
                Poser une question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}