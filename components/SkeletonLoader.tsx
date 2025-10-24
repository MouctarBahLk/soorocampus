// components/SkeletonLoader.tsx
'use client'

type SkeletonProps = {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
  count?: number
}

export default function SkeletonLoader({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  count = 1,
}: SkeletonProps) {
  const baseClass = 'skeleton animate-shimmer'
  
  const variantClass = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }[variant]

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ width, height }}
    />
  ))

  return <div className="space-y-3">{skeletons}</div>
}

// Composants pré-configurés pour différents cas d'usage
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 bg-white">
      <div className="flex items-center gap-4 mb-4">
        <SkeletonLoader variant="circular" width="50px" height="50px" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader width="60%" height="16px" />
          <SkeletonLoader width="40%" height="14px" />
        </div>
      </div>
      <SkeletonLoader height="100px" />
      <div className="mt-4 space-y-2">
        <SkeletonLoader height="12px" />
        <SkeletonLoader width="80%" height="12px" />
      </div>
    </div>
  )
}

export function SkeletonArticle() {
  return (
    <div className="space-y-4">
      <SkeletonLoader height="200px" className="rounded-2xl" />
      <SkeletonLoader width="30%" height="20px" />
      <SkeletonLoader width="100%" height="16px" count={3} />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonLoader variant="circular" width="40px" height="40px" />
          <SkeletonLoader width="30%" height="16px" />
          <SkeletonLoader width="20%" height="16px" />
          <SkeletonLoader width="15%" height="16px" />
        </div>
      ))}
    </div>
  )
}