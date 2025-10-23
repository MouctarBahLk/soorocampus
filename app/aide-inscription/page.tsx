// app/aide-inscription/page.tsx
import Link from "next/link"
import { Metadata } from "next"
import { CheckCircle2, Mail, LogIn, FileDown, HelpCircle, ArrowRight } from "lucide-react"
import NavPublic from '@/components/NavPublic'
import FooterPublic from '@/components/FooterPublic'

export const metadata: Metadata = {
  title: "Aide à l’inscription | Sooro Campus",
  description:
    "Pas à pas pour créer un compte, confirmer l’email et se connecter à Sooro Campus. Guide + PDF téléchargeable.",
}

const steps = [
  {
    id: 1,
    title: "Créer ton compte",
    desc: "Renseigne ton nom, email et mot de passe puis clique sur « Créer mon compte gratuitement ».",
    img: "/aide/inscription.png",
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  },
  {
    id: 2,
    title: "Confirmer ton email",
    desc: "Ouvre l’e-mail reçu et clique sur « Confirmer mon email ». Vérifie les onglets Spam/Promotions si besoin.",
    img: "/aide/mail_confirmation.png",
    icon: <Mail className="h-5 w-5 text-blue-600" />,
  },
  {
    id: 3,
    title: "Te connecter",
    desc: "Retourne sur la page de connexion, saisis ton email et ton mot de passe, puis clique sur « Se connecter ».",
    img: "/aide/connexion_premiere.png",
    icon: <LogIn className="h-5 w-5 text-indigo-600" />,
  },
]

export default function AideInscriptionPage() {
  return (
    <>
      <NavPublic />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <section className="border-b bg-white">
          <div className="mx-auto max-w-4xl px-5 py-10">
            <p className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Nouveaux utilisateurs
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Besoin d’aide pour t’inscrire ? 🤔
            </h1>
            <p className="mt-3 text-slate-600">
              C’est normal d’être un peu perdu au début, on est là pour t’aider 💙
              Suis les étapes ci-dessous pour créer ton compte, confirmer ton email et accéder à ton espace.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
              >
                Créer un compte
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Se connecter
              </Link>

              <a
                href="/supports/Guide_Inscription_SooroCampus.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100"
              >
                <FileDown className="h-4 w-4" />
                Télécharger le guide (PDF)
              </a>
            </div>
          </div>
        </section>

        {/* Étapes */}
        <section className="mx-auto max-w-4xl px-5 py-10">
          <ol className="space-y-8">
            {steps.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{s.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Étape {s.id} — {s.title}
                    </h2>
                    <p className="mt-1 text-slate-600">{s.desc}</p>
                  </div>
                </div>

                {/* Image spécifique à chaque étape */}
                <div className="mt-4 overflow-hidden rounded-xl border">
                  <img
                    src={s.img}
                    alt={`Illustration - ${s.title}`}
                    className="h-auto w-full rounded-lg"
                  />
                </div>
              </li>
            ))}
          </ol>

          {/* FAQ courte */}
          <div className="mt-10 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Questions fréquentes</h3>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-slate-800">
                <HelpCircle className="h-4 w-4 text-slate-500" />
                Je ne reçois pas l’e-mail de confirmation
              </summary>
              <div className="mt-2 text-sm text-slate-600">
                Vérifie le dossier <strong>Spam/Indésirables</strong> et l’onglet{" "}
                <strong>Promotions</strong>. Si rien après 2–3 minutes, retourne sur la page de
                connexion et utilise « Renvoyer l’e-mail ».  
                Tu peux aussi nous écrire à{" "}
                <a href="mailto:contact@soorocampus.com" className="text-blue-700 underline">
                  contact@soorocampus.com
                </a>.
              </div>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-slate-800">
                <HelpCircle className="h-4 w-4 text-slate-500" />
                Mot de passe oublié
              </summary>
              <div className="mt-2 text-sm text-slate-600">
                Va sur la page de connexion et clique sur{" "}
                <strong>« Mot de passe oublié ? »</strong>.  
                Saisis ton adresse email pour recevoir un lien de réinitialisation.
              </div>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-slate-800">
                <HelpCircle className="h-4 w-4 text-slate-500" />
                Toujours bloqué ?
              </summary>
              <div className="mt-2 text-sm text-slate-600">
                Pas de stress — envoie-nous un message à{" "}
                <a href="mailto:contact@soorocampus.com" className="text-blue-700 underline">
                  contact@soorocampus.com
                </a>{" "}
                (décris ce que tu vois + une capture d’écran si possible). On te répond vite 💬
              </div>
            </details>
          </div>
        </section>
      </main>

      <FooterPublic />
    </>
  )
}
