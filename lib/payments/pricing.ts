// lib/payments/pricing.ts
import { BASE_PRICE_EUR, Currency, CURRENCY_META, FX_FALLBACK_EUR } from './config'

// Arrondis “commerçants” par devise
function roundPerCurrency(amount: number, currency: Currency): number {
  if (currency === 'GNF') {
    const step = 10_000
    return Math.round(amount / step) * step
  }
  if (currency === 'XOF') {
    const step = 500
    return Math.round(amount / step) * step
  }
  // EUR
  return Math.round(amount * 100) / 100
}

/**
 * Prix local :
 * - Guinée : FORCÉ à 1 500 000 GNF
 * - XOF/EUR : 150 EUR * fx * (1+3%) arrondi
 */
export function priceForCurrency(
  currency: Currency,
  opts?: { basePriceEUR?: number; fx?: number; marginPct?: number }
) {
  if (currency === 'GNF') return 1_500_000

  const base = opts?.basePriceEUR ?? BASE_PRICE_EUR
  const fx = opts?.fx ?? FX_FALLBACK_EUR[currency] // 1 EUR → currency
  const margin = 1 + (opts?.marginPct ?? 0.03)     // 3% par défaut
  const raw = base * fx * margin
  return roundPerCurrency(raw, currency)
}

export function formatAmount(amount: number, currency: Currency) {
  const meta = CURRENCY_META[currency]
  const value = meta.decimals === 0 ? String(amount) : amount.toFixed(meta.decimals)
  return `${value} ${meta.symbol}`
}
