// components/AnimatedToast.tsx
'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastProps = {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export default function AnimatedToast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-600',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
    },
  }[type]

  const Icon = config.icon

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        ${isExiting ? 'animate-fadeInRight' : 'animate-fadeInLeft'}
        ${isExiting ? 'opacity-0' : 'opacity-100'}
        transition-all duration-300
      `}
      style={{ animationDirection: isExiting ? 'reverse' : 'normal' }}
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          min-w-[300px] max-w-md
          hover-lift
        `}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 hover:bg-white/50 rounded-lg p-1 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Hook pour utiliser les toasts facilement
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: number
    message: string
    type: ToastType
  }>>([])

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <AnimatedToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )

  return {
    success: (msg: string) => showToast(msg, 'success'),
    error: (msg: string) => showToast(msg, 'error'),
    warning: (msg: string) => showToast(msg, 'warning'),
    info: (msg: string) => showToast(msg, 'info'),
    ToastContainer,
  }
}