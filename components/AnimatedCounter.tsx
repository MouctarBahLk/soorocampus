// components/AnimatedCounter.tsx
'use client'

import { useEffect, useState, useRef } from 'react'

type AnimatedCounterProps = {
  end: number
  start?: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export default function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const endTime = startTime + duration
    const range = end - start

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      const currentCount = start + range * easeProgress
      setCount(currentCount)

      if (now < endTime) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isVisible, start, end, duration])

  const formattedCount = count.toFixed(decimals)

  return (
    <span ref={counterRef} className={`font-bold ${className}`}>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  )
}

// Composant de stats avec icône et animation
type StatCardProps = {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  prefix?: string
  decimals?: number
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export function AnimatedStatCard({
  icon,
  value,
  label,
  suffix = '',
  prefix = '',
  decimals = 0,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-amber-600',
  }[color]

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" 
           style={{ background: `linear-gradient(135deg, ${colorClasses})` }} />
      
      <div className="relative bg-white rounded-2xl p-6 shadow-lg hover-lift border border-gray-100">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center mb-4 animate-gentleBounce`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <AnimatedCounter
          end={value}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          className="text-3xl text-gray-900 block mb-1"
        />
        
        <p className="text-sm text-gray-600 font-medium">{label}</p>
      </div>
    </div>
  )
}