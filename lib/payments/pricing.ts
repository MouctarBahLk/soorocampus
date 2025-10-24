// lib/payments/pricing.ts
import { Currency } from './config'

// Fonction pour récupérer les prix depuis l'API
export async function getPricing() {
  try {
    const res = await fetch('/api/admin/pricing', { credentials: 'include' })
    const data = await res.json()
    return data.settings
  } catch {
    // Fallback sur les prix par défaut
    return {
      price_eur: 15000,
      price_xof: 100000,
      price_gnf: 1500000,
    }
  }
}

export function priceForCurrency(currency: Currency, settings?: any): number {
  if (!settings) {
    // Prix par défaut si settings pas encore chargés
    const defaults: Record<Currency, number> = {
      EUR: 15000,
      XOF: 100000,
      GNF: 1500000,
    }
    return defaults[currency] || defaults.EUR
  }
  
  switch (currency) {
    case 'EUR': return settings.price_eur || 15000
    case 'XOF': return settings.price_xof || 100000
    case 'GNF': return settings.price_gnf || 1500000
    default: return settings.price_eur || 15000
  }
}

export function formatAmount(amount: number, currency: Currency): string {
  switch (currency) {
    case 'EUR':
      return `${(amount / 100).toFixed(2)} €`
    case 'XOF':
      return `${amount.toLocaleString()} XOF`
    case 'GNF':
      return `${amount.toLocaleString()} GNF`
    default:
      return `${amount}`
  }
}