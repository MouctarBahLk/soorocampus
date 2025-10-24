// components/AnimatedButton.tsx
'use client'

import { ReactNode, useState } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonProps = {
  children: ReactNode
  onClick?: () => void | Promise<void>
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
  fullWidth?: boolean
  icon?: ReactNode
  ripple?: boolean
}

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  icon,
  ripple = true,
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || isLoading || disabled) return

    // Effet ripple
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      
      setRipples(prev => [...prev, { x, y, id }])
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id))
      }, 600)
    }

    // Gérer le onClick
    if (onClick) {
      setIsLoading(true)
      try {
        await onClick()
      } finally {
        setIsLoading(false)
      }
    }
  }

  const variantClasses = {
    primary: 'bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-blue-700 text-blue-700 hover:bg-blue-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
  }[variant]

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }[size]

  const isButtonLoading = loading || isLoading

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isButtonLoading}
      className={`
        relative overflow-hidden
        ${variantClasses}
        ${sizeClasses}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        transform active:scale-95
        btn-magnetic
        ${className}
      `}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Contenu */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isButtonLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </span>

      {/* Effet de brillance au hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  )
}

// Variantes pré-configurées
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <AnimatedButton {...props} variant="primary" />
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <AnimatedButton {...props} variant="secondary" />
}

export function OutlineButton(props: Omit<ButtonProps, 'variant'>) {
  return <AnimatedButton {...props} variant="outline" />
}

export function DangerButton(props: Omit<ButtonProps, 'variant'>) {
  return <AnimatedButton {...props} variant="danger" />
}