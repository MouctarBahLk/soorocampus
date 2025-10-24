// components/AnimatedCard.tsx
'use client'

import { ReactNode, useState } from 'react'

type AnimatedCardProps = {
  children: ReactNode
  className?: string
  hoverEffect?: 'lift' | 'glow' | '3d' | 'scale'
  gradient?: boolean
}

export default function AnimatedCard({
  children,
  className = '',
  hoverEffect = 'lift',
  gradient = false,
}: AnimatedCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverEffect !== '3d') return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20

    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  const effectClass = {
    lift: 'hover-lift',
    glow: 'hover-glow',
    '3d': '',
    scale: 'hover:scale-105',
  }[hoverEffect]

  const gradientBg = gradient
    ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    : ''

  return (
    <div
      className={`
        ${effectClass}
        ${gradientBg}
        ${className}
        transition-smooth
        rounded-2xl
        overflow-hidden
      `}
      style={
        hoverEffect === '3d'
          ? {
              transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }
          : undefined
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}