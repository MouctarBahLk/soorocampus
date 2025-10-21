// app/app/ressources/emails/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import {
  ArrowLeft,
  Download,
  CheckCircle,
  Mail,
  FileText,
  Send,
} from 'lucide-react'

const EMAIL_TEMPLATES = [
  {
    id: 'relance-ecole',
    title: 'Relance École / Université',
    description: "Demande d'admission, statut du dossier, préinscription",
    icon: Mail,
    format: 'Word (.docx)',
    size: '75 Ko',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    file: '/downloads/emails/Relance_Ecole.docx',
  },
  {
    id: 'relance-consulat',
    title: 'Relance Consulat / TLS Contact',
    description: 'Suivi demande visa, créneaux RDV',
    icon: Send,
    format: 'Word (.docx)',
    size: '68 Ko',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    file: '/downloads/emails/Relance_Consulat_TLS.docx',
  },
  {
    id: 'demande-info-formation',
    title: "Demande d'Informations Formation",
    description: 'Programme, modalités, dates limites',
    icon: FileText,
    format: 'Word (.docx)',
    size: '72 Ko',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    file: '/downloads/emails/Demande_Info_Formation.docx',
  },
  {
    id: 'reponse-demande-complements',
    title: 'Réponse à Demande de Compléments',
    description: 'Documents additionnels, clarifications',
    icon: Mail,
    format: 'Word (.docx)',
    size: '65 Ko',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    file: '/downloads/emails/Reponse_Demande_Complements.docx',
  },
  {
    id: 'escalade-polie',
    title: 'Escalade Polie (Relance ++)',
    description: 'Après plusieurs relances sans réponse',
    icon: Send,
    format: 'Word (.docx)',
    size: '70 Ko',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    file: '/downloads/emails/Escalade_Polie.docx',
  },
  {
    id: 'demande-reportpostp',
    title: 'Demande Report / Postposition',
    description: 'Report de rentrée, année sabbatique',
    icon: FileText,
    format: 'Word (.docx)',
    size: '68 Ko',
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    file: '/downloads/emails/Demande_Report.docx',
  },
  {
    id: 'candidature-logement',
    title: 'Candidature Logement Étudiant',
    description: 'CROUS, résidences privées',
    icon: Mail,
    format: 'Word (.docx)',
    size: '73 Ko',
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    file: '/downloads/emails/Candidature_Logement.docx',
  },
  {
    id: 'pack-complet',
    title: 'Pack Complet (Tous les Templates)',
    description: "15+ modèles d'emails prêts à adapter",
    icon: FileText,
    format: 'ZIP',
    size: '850 Ko',
    color: 'from-slate-700 to-gray-800',
    bgColor: 'bg-slate-50',
    file: '/downloads/emails/Pack_Complet_Emails.zip',
  },
]

export default async function EmailsPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login?next=/app/ressources/emails')

  const { data: payments } = await sb
    .from('payments')
    .select('status')
    .eq('user_id', user.id)

  const paid = !!payments?.some(p => p.status === 'succeeded')
  if (!paid) redirect('/app/paiements?locked=emails')

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
                Templates Emails & Relances
              </h1>
              <p className="text-slate-600 text-sm md:text-lg">
                Modèles prêts à adapter pour toutes tes communications
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 md:px-4 py-2 rounded-xl self-start md:self-auto">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-green-700">
                {EMAIL_TEMPLATES.length} templates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {EMAIL_TEMPLATES.map((template) => {
              const IconComponent = template.icon
              return (
                <article
                  key={template.id}
                  className={`rounded-2xl border border-slate-200 ${template.bgColor} p-5 md:p-6 hover:shadow-lg transition-all duration-300 group`}
                >
                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                        {template.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                    <span className="font-medium">{template.format}</span>
                    <span>{template.size}</span>
                  </div>

                  {/* Download Button */}
                  <a
                    href={template.file}
                    download
                    className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r ${template.color} text-white font-semibold py-2.5 md:py-3 rounded-xl transition-all hover:shadow-md text-sm md:text-base`}
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
            <Mail className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              Besoin d’aide pour adapter un email ?
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-6 max-w-md mx-auto">
              Envoie-nous le contexte et on t’aide à personnaliser le message parfait.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/app/messages?topic=emails"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-xl transition-colors text-sm md:text-base"
              >
                Contacter un coach
              </Link>
              <Link
                href="/app/conseils/emails-relance"
                className="inline-flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-xl transition-colors text-sm md:text-base"
              >
                Lire le guide complet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
