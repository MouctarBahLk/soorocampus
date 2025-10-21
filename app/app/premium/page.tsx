import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { ArrowLeft, Download, BookOpen, MessageSquare, FileText, Home, DollarSign, Shield, Mail, Zap, CheckCircle2 } from 'lucide-react'

const RESOURCES = [
  {
    id: 'checklists',
    title: 'Checklists par étape',
    description: 'Calendrier, pièces exactes, mails de relance',
    icon: CheckCircle2,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    items: [
      'Calendrier personnalisé (rétroplanning)',
      'Pièces exactes par étape (EEF, visa, arrivée)',
      'Modèles de mails pour relances',
      'Plan de cohérence prêt à adapter',
    ],
    buttons: [
      { label: 'Ouvrir', href: '/app/ressources/checklists', variant: 'primary' },
      { label: 'Voir le guide', href: '/app/conseils/calendrier-deadlines', variant: 'secondary' },
    ],
  },
  {
    id: 'modeles',
    title: 'Pack modèles',
    description: 'CV, lettres de motivation, tableurs',
    icon: FileText,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    items: [
      'CV FR/EN (modèles éditables)',
      'Lettre de motivation (exemples commentés)',
      'Relances école/consulat/TLS',
      'Tableur de suivi (deadlines, RDV, pièces)',
    ],
    buttons: [
      { label: 'Télécharger', href: '/app/ressources/modeles/', variant: 'primary' },
      { label: 'Guide CV/LM', href: '/app/conseils/cv-etudiant-modele', variant: 'secondary' },
    ],
  },
  {
    id: 'entretien',
    title: 'Simulation d\'entretien (x5)',
    description: 'Campus France, questions types, feedback personnalisé',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    items: [
      '5 simulations Campus France (visio ou écrites)',
      'Questions types réelles & grille d\'évaluation',
      'Scripts d\'intro/conclusion + plan de réponse',
      'Feedback personnalisé par nos coachs',
    ],
    buttons: [
      { label: 'Planifier une simulation', href: '/app/messages?topic=entretien', variant: 'primary' },
      { label: 'Lire le guide', href: '/app/conseils/entretien-campus-france', variant: 'secondary' },
    ],
  },
  {
    id: 'finances',
    title: 'Finances & preuve de ressources',
    description: 'Budget, convertisseur devises, exemples validés',
    icon: DollarSign,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    items: [
      'Modèle de prise en charge financière',
      'Tableau budget mensuel (convertisseur devises)',
      'Exemples validés + motifs de refus fréquents',
    ],
    buttons: [
      { label: 'Guide budget', href: '/app/conseils/preuve-de-ressources', variant: 'primary' },
      { label: 'Téléchargements', href: '/app/ressources/finances/', variant: 'secondary' },
    ],
  },
  {
    id: 'logement',
    title: 'Logement & attestations',
    description: 'Hébergement, état des lieux, plateformes sûres',
    icon: Home,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    items: [
      'Attestation d\'hébergement (modèle + pièces)',
      'Checklist état des lieux',
      'Liste plateformes sûres',
    ],
    buttons: [
      { label: 'Guide logement', href: '/app/conseils/logement-etudiant', variant: 'primary' },
      { label: 'Modèles & checklist', href: '/app/conseils/attestation-logement', variant: 'secondary' },
    ],
  },
  {
    id: 'visa',
    title: 'Visa long séjour (VLS-TS)',
    description: 'Checklist par pays, pré-remplissages, escalades',
    icon: Zap,
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    items: [
      'Checklist par pays',
      'Pré-remplissages types',
      'Relances & escalades',
      'Plan B si créneaux rares',
    ],
    buttons: [
      { label: 'Guide visa', href: '/app/conseils/visa-long-sejour', variant: 'primary' },
      { label: 'Téléchargements', href: '/app/ressources/visa', variant: 'secondary' },
    ],
  },
  {
    id: 'assurances',
    title: 'Assurances, santé & installation',
    description: 'Comparatif, checklist, priorités administratives',
    icon: Shield,
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    items: [
      'Assurance logement & RC : comparatif',
      'Checklist d\'installation + liens utiles',
      'ANEF / OFII / banque / mobile : priorités',
    ],
    buttons: [
      { label: 'Guide assurances', href: '/app/conseils/assurances-sante', variant: 'primary' },
      { label: 'Les 30 premiers jours', href: '/app/conseils/arriver-en-france-30-jours', variant: 'secondary' },
    ],
  },
  {
    id: 'emails',
    title: 'Emails & relances',
    description: 'Modèles prêts à adapter, escalade polie',
    icon: Mail,
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    items: [
      'Relance école',
      'Relance consulat / TLS',
      'Réponse à demande d\'infos',
      'Escalade polie',
    ],
    buttons: [
      { label: 'Guide', href: '/app/conseils/emails-relance', variant: 'primary' },
      { label: 'Téléchargements', href: '/app/ressources/emails', variant: 'secondary' },
    ],
  },
  {
    id: 'coherence',
    title: 'Cohérence du projet d\'études',
    description: 'Trames, storyline, alignement programme',
    icon: BookOpen,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    items: [
      'Trames (reprise d\'études, changement filière)',
      'Storyline & alignement programme/objectif',
      'Exemples argumentés',
    ],
    buttons: [
      { label: 'Lire', href: '/app/conseils/coherence-projet', variant: 'primary' },
    ],
  },
]

export default async function PremiumPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login?next=/app/premium')

  const { data: payments } = await sb
    .from('payments')
    .select('status')
    .eq('user_id', user.id)

  const paid = !!payments?.some(p => p.status === 'succeeded')
  if (!paid) redirect('/app/paiements?locked=premium')

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link href="/app/conseils" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour aux articles</span>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Bibliothèque premium</h1>
            <p className="text-slate-600 text-lg">
              Modèles, checklists, guides avancés et accompagnement personnalisé
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {RESOURCES.map((resource) => {
              const IconComponent = resource.icon
              return (
                <article
                  key={resource.id}
                  className={`rounded-2xl border ${resource.borderColor} ${resource.bgColor} p-7 hover:shadow-lg transition-shadow duration-300`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-3 shadow-md`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {resource.description}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <ul className="space-y-2 mb-6">
                    {resource.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-700">
                        <span className="text-slate-400 flex-shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {resource.buttons.map((btn, i) => (
                      <Link
                        key={i}
                        href={btn.href}
                        className={`text-sm font-semibold px-4 py-2.5 rounded-lg transition-all flex-1 min-w-max text-center ${
                          btn.variant === 'primary'
                            ? `bg-gradient-to-r ${resource.color} text-white hover:shadow-md`
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {btn.label}
                      </Link>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Prêt à explorer toutes les ressources ?
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Retourne aux articles pour lire les guides associés et approfondir tes connaissances
            </p>
            <Link
              href="/app/conseils"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Voir tous les articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}