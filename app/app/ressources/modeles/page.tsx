// app/app/ressources/modeles/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { ArrowLeft, Download, FileText, FileSpreadsheet, File, CheckCircle } from 'lucide-react'

const MODELES = [
  {
    id: 'cv-fr',
    title: 'CV Étudiant (FR)',
    description: 'Modèle Word éditable optimisé pour les étudiants',
    icon: FileText,
    format: 'Word (.docx)',
    size: '120 Ko',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    file: '/downloads/modeles/CV_Etudiant_FR.docx',
  },
  {
    id: 'cv-en',
    title: 'CV Étudiant (EN)',
    description: 'English student resume template',
    icon: FileText,
    format: 'Word (.docx)',
    size: '115 Ko',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    file: '/downloads/modeles/CV_Student_EN.docx',
  },
  {
    id: 'lettre-motivation',
    title: 'Lettre de Motivation',
    description: '3 exemples commentés (admission, bourse, stage)',
    icon: FileText,
    format: 'PDF + Word',
    size: '450 Ko',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    file: '/downloads/modeles/Lettres_Motivation_Pack.zip',
  },
  {
    id: 'email-relances',
    title: 'Pack Emails de Relance',
    description: 'École, consulat, TLS, escalade polie',
    icon: File,
    format: 'Word (.docx)',
    size: '85 Ko',
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-50',
    file: '/downloads/modeles/Emails_Relances.docx',
  },
  {
    id: 'tableur-suivi',
    title: 'Tableur de Suivi Complet',
    description: 'Deadlines, RDV, pièces, budget, timeline',
    icon: FileSpreadsheet,
    format: 'Excel (.xlsx)',
    size: '240 Ko',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    file: '/downloads/modeles/Tableur_Suivi_Campus_France.xlsx',
  },
  {
    id: 'prise-en-charge',
    title: 'Prise en Charge Financière',
    description: 'Modèle officiel prérempli',
    icon: FileText,
    format: 'Word (.docx)',
    size: '95 Ko',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    file: '/downloads/modeles/Prise_Charge_Financiere.docx',
  },
  {
    id: 'attestation-hebergement',
    title: 'Attestation d\'Hébergement',
    description: 'Modèle + liste pièces justificatives',
    icon: FileText,
    format: 'Word + PDF',
    size: '180 Ko',
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    file: '/downloads/modeles/Attestation_Hebergement.zip',
  },
  {
    id: 'plan-coherence',
    title: 'Plan de Cohérence Projet',
    description: 'Trame structurée pour argumentaire solide',
    icon: File,
    format: 'Word (.docx)',
    size: '105 Ko',
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    file: '/downloads/modeles/Plan_Coherence_Projet.docx',
  },
]

export default async function ModelesPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login?next=/app/ressources/modeles')

  const { data: payments } = await sb
    .from('payments')
    .select('status')
    .eq('user_id', user.id)

  const paid = !!payments?.some(p => p.status === 'succeeded')
  if (!paid) redirect('/app/paiements?locked=modeles')

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
                Pack Modèles Téléchargeables
              </h1>
              <p className="text-slate-600 text-sm md:text-lg">
                CV, lettres, emails, tableurs prêts à utiliser — formats éditables
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 md:px-4 py-2 rounded-xl self-start md:self-auto">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-green-700">
                {MODELES.length} modèles disponibles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {MODELES.map((modele) => {
              const IconComponent = modele.icon
              return (
                <article
                  key={modele.id}
                  className={`rounded-2xl border border-slate-200 ${modele.bgColor} p-5 md:p-6 hover:shadow-lg transition-all duration-300 group`}
                >
                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${modele.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                        {modele.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 mt-1 line-clamp-2">
                        {modele.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                    <span className="font-medium">{modele.format}</span>
                    <span>{modele.size}</span>
                  </div>

                  {/* Download Button */}
                  <a
                    href={modele.file}
                    download
                    className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r ${modele.color} text-white font-semibold py-2.5 md:py-3 rounded-xl transition-all hover:shadow-md text-sm md:text-base`}
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

      {/* Footer CTA */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 md:p-8 text-center">
            <FileText className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              Besoin d'aide pour remplir ces modèles ?
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-6 max-w-md mx-auto">
              Consulte nos guides détaillés ou contacte notre équipe via la messagerie
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/app/conseils"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-xl transition-colors text-sm md:text-base"
              >
                Voir les guides
              </Link>
              <Link
                href="/app/messages"
                className="inline-flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-xl transition-colors text-sm md:text-base"
              >
                Contacter l'équipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}