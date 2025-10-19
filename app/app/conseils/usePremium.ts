'use client'
import { useEffect, useState } from 'react'

export function usePremium() {
  const [premium, setPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetch('/api/entitlements')
      .then(r => r.json())
      .then(d => { if (alive) setPremium(!!d?.premium) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  return { premium, loading }
}
