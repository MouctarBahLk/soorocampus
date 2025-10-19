'use client'
import { useEffect, useRef } from 'react'

export default function PremiumInitializer({ enabled }: { enabled: boolean }) {
  const once = useRef(false)
  useEffect(() => {
    if (enabled && !once.current) {
      once.current = true
      fetch('/api/entitlements', { method: 'POST' }).catch(() => {})
    }
  }, [enabled])
  return null
}
