// app/app/ressources/finances/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { ArrowLeft, Download, DollarSign, FileSpreadsheet, FileText, CheckCircle, Calculator } from 'lucide-react'

const FINANCES_DOCS = [
  {
    id: 'prise-charge',
    title: 'Modèle Prise en Charge Financière',
    description: 'Document officiel prérempli avec instructions',
    icon: FileText,
    format: 'Word (.docx)',
    size: '95 Ko',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    file: '/downloads/finances/Prise_Charge_Financiere.docx',
  },
  {
    id: 'budget-mensuel',
    title: 'Tableau Budget Mensuel',
    description: 'Calculateur automatique avec convertisseur devises',
    icon: FileSpreadsheet,
    format: 'Excel (.xlsx)',
    size: '180 Ko',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    file: '/downloads/finances/Budget_Mensuel_Etudiant.xlsx',
  },
  {
    id: 'preuve-ressources',
    title: 'Guide Preuve de Ressources',
    description: 'Documents acceptés + exemples validés par consulat',
    icon: FileText,
    format: 'PDF',
    size: '520 Ko',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    file: '/downloads/finances/Guide_Preuve_Ressources.pdf',
  },
  {
    id: 'simulateur-budget',
    title: 'Simulateur Budget Étudiant',
    description: 'Estimez vos dépenses réelles selon votre ville',
    icon: Calculator,
    format: 'Excel (.xlsx)',
    size: '220 Ko',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    file: '/downloads/finances/Simulateur_Budget_France.xlsx',
  },
  {
    id: 'bourse-exemples',
    title: 'Exemples Demandes de Bourse',
    description: '5 lettres de motivation ayant obtenu une bourse',
    icon: FileText,
    format: 'PDF',
    size: '380 Ko',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    file: '/downloads/finances/Exemples_Demandes_Bourse.pdf',
  },
  {
    id: 'compte-bancaire',
    title: 'Checklist Ouverture Compte',
    description: 'Comparatif banques + documents nécessaires',
    icon: FileText,
    format: 'PDF',
    size: '290 Ko',
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    file: '/downloads/finances/Checklist_Compte_Bancaire.pdf',
  },
]

export default async function FinancesPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login?next=/app/ressources/finances')

  const { data: payments } = await sb
    .from('payments')
    .select('status')
    .eq('user_id', user.id)

  const paid = !!payments?.some(p => p.status === 'succeeded')
  if (!paid) redirect('/app/paiements?locked=finances')

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
                Ressources Finances & Budget
              </h1>
              <p className="text-slate-600 text-sm md:text-lg">
                Preuves de ressources, budget, bourses et compte bancaire
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 md:px-4 py-2 rounded-xl self-start md:self-auto">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold text-green-700">
                {FINANCES_DOCS.length} ressources
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {FINANCES_DOCS.map((doc) => {
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

      {/* Info Box */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-amber-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                  💡 Conseil important
                </h2>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  La preuve de ressources est <strong>un des points les plus importants</strong> de ton dossier. 
                  Assure-toi que tes documents sont <strong>cohérents, datés et lisibles</strong>. 
                  En cas de doute, contacte notre équipe avant de soumettre.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/app/conseils/preuve-de-ressources"
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm md:text-base"
              >
                Lire le guide complet
              </Link>
              <Link
                href="/app/messages?topic=finances"
                className="inline-flex items-center justify-center gap-2 border-2 border-amber-300 text-amber-700 hover:bg-amber-100 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm md:text-base"
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