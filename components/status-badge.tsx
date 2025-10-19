// components/status-badge.tsx
type BadgeStatus =
  | 'non créé'
  | 'en cours'
  | 'en attente'
  | 'validé'
  | 'refusé'
  | 'payé'
  | 'non payé'

function colorClasses(status: BadgeStatus) {
  switch (status) {
    case 'validé':
    case 'payé':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'en attente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'refusé':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'en cours':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'non créé':
    case 'non payé':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-sm ${colorClasses(status)}`}>
      <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
      {status}
    </span>
  )
}

// 👉 On exporte aussi par défaut, ainsi tu peux importer
// soit `import StatusBadge from ...`, soit `import { StatusBadge } from ...`
export default StatusBadge
