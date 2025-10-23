// lib/payments/config.ts
export type Currency = 'EUR' | 'GNF' | 'XOF'

export type CountryCode =
  | 'GN'  // Guinée
  | 'SN'  // Sénégal
  | 'CI'  // Côte d’Ivoire
  | 'BJ'  // Bénin
  | 'TG'  // Togo
  | 'ML'  // Mali
  | 'NE'  // Niger
  | 'BF'  // Burkina Faso
  | 'FR'  // France
  | 'BE'  // Belgique
  | 'DE'  // Allemagne
  | 'ES'  // Espagne
  | 'IT'  // Italie
  | 'MA'  // Maroc
  | 'OTHER'

export type PaymentMethod = 'mobile_money' | 'card'
export type Provider = 'cinetpay'

// 3 familles de devise
export const COUNTRY_TO_CURRENCY: Record<CountryCode, Currency> = {
  GN: 'GNF',
  SN: 'XOF',
  CI: 'XOF',
  BJ: 'XOF',
  TG: 'XOF',
  ML: 'XOF',
  NE: 'XOF',
  BF: 'XOF',
  FR: 'EUR',
  BE: 'EUR',
  DE: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  MA: 'EUR',
  OTHER: 'EUR',
}

// Où proposer la carte (→ Europe/Maroc/Autre)
export const COUNTRY_PAYMENT_OPTIONS: Record<
  CountryCode,
  { methods: PaymentMethod[]; provider: Provider }
> = {
  GN: { methods: ['mobile_money'], provider: 'cinetpay' },
  SN: { methods: ['mobile_money'], provider: 'cinetpay' },
  CI: { methods: ['mobile_money'], provider: 'cinetpay' },
  BJ: { methods: ['mobile_money'], provider: 'cinetpay' },
  TG: { methods: ['mobile_money'], provider: 'cinetpay' },
  ML: { methods: ['mobile_money'], provider: 'cinetpay' },
  NE: { methods: ['mobile_money'], provider: 'cinetpay' },
  BF: { methods: ['mobile_money'], provider: 'cinetpay' },
  FR: { methods: ['card', 'mobile_money'], provider: 'cinetpay' },
  BE: { methods: ['card'], provider: 'cinetpay' },
  DE: { methods: ['card'], provider: 'cinetpay' },
  ES: { methods: ['card'], provider: 'cinetpay' },
  IT: { methods: ['card'], provider: 'cinetpay' },
  MA: { methods: ['card'], provider: 'cinetpay' },
  OTHER: { methods: ['card'], provider: 'cinetpay' },
}

export const CURRENCY_META: Record<Currency, { symbol: string; decimals: number }> = {
  EUR: { symbol: '€', decimals: 2 },
  XOF: { symbol: 'CFA', decimals: 0 },
  GNF: { symbol: 'GNF', decimals: 0 },
}

export const BASE_PRICE_EUR = 150

// Taux fallback (cron possible pour maj)
export const FX_FALLBACK_EUR: Record<Currency, number> = {
  EUR: 1,
  XOF: 655.957,
  GNF: 9500, // pas utilisé pour GN (prix fixe)
}
