// components/help-inline.tsx
import Link from "next/link"

export default function HelpInline() {
  return (
    <div className="mt-4 text-center text-sm text-gray-600">
      😕 Tu rencontres des difficultés ?
      <Link href="/aide-inscription" className="ml-1 font-semibold text-blue-700 hover:underline">
        Clique ici pour voir comment ça marche
      </Link>
      <div className="mt-1 text-xs text-gray-500">
        C’est normal au début — on t’accompagne pas à pas 💙
      </div>
    </div>
  )
}
