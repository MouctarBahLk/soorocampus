import Link from 'next/link'

export default function RessourcesPremium() {
  const FILES = [
    { name: 'Checklist complète PDF', href: '/downloads/checklist.pdf' },
    { name: 'CV FR/EN', href: '/downloads/cv-model.docx' },
    { name: 'Lettre de motivation', href: '/downloads/motivation.docx' },
    { name: 'Plan de cohérence', href: '/downloads/plan-coherence.docx' },
    { name: 'Prise en charge financière', href: '/downloads/prise-en-charge.docx' },
    { name: 'Tableur de suivi', href: '/downloads/suivi.xlsx' },
  ]

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Ressources premium débloquées</h1>
        <p className="mt-2 text-gray-600">Télécharge tous les modèles et fichiers utiles à ton dossier Campus France.</p>

        <ul className="mt-6 divide-y divide-gray-100 border rounded-2xl">
          {FILES.map((f,i)=>(
            <li key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
              <span className="text-gray-800 font-medium">{f.name}</span>
              <Link
                href={f.href}
                className="text-blue-700 font-semibold hover:underline"
                download
              >
                Télécharger
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex gap-3">
          <Link href="/app/mon-dossier" className="bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-800">
            Accéder à mon dossier
          </Link>
          <Link href="/app/messages" className="border border-blue-200 text-blue-700 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50">
            Contacter mon coach
          </Link>
        </div>
      </div>
    </main>
  )
}
