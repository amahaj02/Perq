import { getCard as getFallbackCard, type BenefitHighlight, type CardCategory, type CardRecord, type RewardRate } from '@/lib/perq-data'

export type ApiIssuer = {
  id: number
  name: string
  slug: string
  website_url: string | null
  country_code: string
}

export type ApiRewardCategory = {
  id: number
  name: string
  slug: string
  description: string | null
}

export type ApiSignupOffer = {
  id: number
  title: string
  summary: string | null
  bonus_value: number | null
  bonus_currency: string | null
  spend_requirement_cents: number | null
  spend_requirement_days: number | null
  annual_fee_waived: boolean
  start_date: string | null
  end_date: string | null
  is_active: boolean
}

export type ApiBenefit = {
  id: number
  name: string
  slug: string
  benefit_type: string
  description: string | null
}

export type ApiCardBenefit = {
  id: number
  title: string
  official_text: string
  simple_text: string | null
  sort_order: number
  is_highlight: boolean
  benefit: ApiBenefit
}

export type ApiRewardRate = {
  id: number
  earn_rate: number
  earn_type: string
  reward_currency: string | null
  monthly_cap_cents: number | null
  annual_cap_cents: number | null
  cap_reset_frequency: string | null
  notes: string | null
  source_url?: string | null
  last_verified_at?: string | null
  confidence_level?: string
  reward_category: ApiRewardCategory
}

export type ApiCardListItem = {
  id: number
  name: string
  slug: string
  network: string
  annual_fee_cents: number
  fee_type: 'FEE' | 'NO_FEE'
  image_url: string | null
  is_active: boolean
  issuer: ApiIssuer
  reward_categories: ApiRewardCategory[]
  active_signup_offer: ApiSignupOffer | null
}

export type ApiCardDetail = ApiCardListItem & {
  foreign_transaction_fee_bps: number | null
  apply_url: string | null
  rewards_currency: string | null
  benefits: ApiCardBenefit[]
  signup_offers: ApiSignupOffer[]
  reward_rates: ApiRewardRate[]
}

const CARD_CATEGORY_MAP: Record<string, CardCategory> = {
  'cash back': 'Cash Back',
  everyday: 'Everyday',
  'no fee': 'No Fee',
  premium: 'Premium',
  student: 'Student',
  travel: 'Travel',
}

function centsToDollars(amount: number) {
  return amount / 100
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ')
}

function normalizeCategory(name: string): CardCategory | null {
  return CARD_CATEGORY_MAP[name.trim().toLowerCase()] ?? null
}

function mapBenefitType(value: string): BenefitHighlight['type'] {
  const normalized = value.trim().toLowerCase()
  if (normalized.includes('travel')) return 'travel'
  if (normalized.includes('insurance')) return 'insurance'
  if (normalized.includes('cash')) return 'cashback'
  if (normalized.includes('welcome') || normalized.includes('offer')) return 'welcome'
  return 'perk'
}

function formatEarnRate(rate: ApiRewardRate) {
  const value = Number.isInteger(rate.earn_rate) ? String(rate.earn_rate) : rate.earn_rate.toFixed(2).replace(/\.?0+$/, '')

  switch (rate.earn_type) {
    case 'cashback_percent':
      return `${value}% cash back`
    case 'points_per_cad':
      return `${value}x ${rate.reward_currency ?? 'points'}`
    default:
      return `${value} ${rate.reward_currency ?? rate.earn_type}`
  }
}

function buildWelcomeOffer(card: ApiCardListItem | ApiCardDetail) {
  const activeOffer = card.active_signup_offer
  if (activeOffer?.summary) return activeOffer.summary
  if (activeOffer?.title) return activeOffer.title
  return 'No active signup offer is currently tracked.'
}

function buildBestFor(card: ApiCardListItem | ApiCardDetail, categories: CardCategory[]) {
  if (categories.length > 0) {
    return `${categories.join(', ')} spending patterns`
  }
  return `${card.issuer.name} cardholders comparing ${card.network} options`
}

function buildRewardRates(card: ApiCardListItem | ApiCardDetail): RewardRate[] {
  if ('reward_rates' in card && card.reward_rates.length > 0) {
    return card.reward_rates.map((rate) => ({
      label: rate.reward_category.name,
      value: formatEarnRate(rate),
    }))
  }

  return []
}

function buildBenefitHighlights(card: ApiCardDetail | ApiCardListItem, fallback?: CardRecord): BenefitHighlight[] {
  if ('benefits' in card && card.benefits.length > 0) {
    return card.benefits.slice(0, 3).map((benefit) => ({
      type: mapBenefitType(benefit.benefit.benefit_type),
      title: benefit.title,
      detail: benefit.simple_text ?? benefit.benefit.description ?? benefit.official_text,
    }))
  }
  return fallback?.benefitHighlights ?? []
}

function buildStrengths(card: ApiCardDetail | ApiCardListItem, categories: CardCategory[]) {
  const strengths = [
    card.active_signup_offer ? 'Active signup offer currently tracked in Perq.' : null,
    categories.length > 0 ? `Relevant for ${categories.join(', ').toLowerCase()} use cases.` : null,
    card.fee_type === 'NO_FEE' ? 'No annual fee keeps the long-term hold cost low.' : 'Premium fee profile suggests benefits matter in the value equation.',
  ]

  return strengths.filter((value): value is string => Boolean(value))
}

function buildWatchouts(card: ApiCardDetail | ApiCardListItem) {
  const watchouts = [
    card.fee_type === 'FEE' ? 'Annual fee should be justified against actual spending and benefit usage.' : null,
    'Always verify live issuer terms before applying.',
  ]

  return watchouts.filter((value): value is string => Boolean(value))
}

function buildCategories(card: ApiCardListItem | ApiCardDetail, fallback?: CardRecord): CardCategory[] {
  const categories = card.reward_categories
    .map((category) => normalizeCategory(category.name))
    .filter((value): value is CardCategory => value !== null)

  if (categories.length > 0) return categories
  if (fallback?.categories.length) return fallback.categories
  return ['Everyday']
}

function buildSummary(card: ApiCardListItem | ApiCardDetail, categories: CardCategory[]) {
  const categorySummary = categories.length > 0 ? `${categories.join(', ')} card` : 'Canadian credit card'
  return `${card.issuer.name} ${categorySummary.toLowerCase()} tracked in the Perq catalog.`
}

export function transformApiCard(card: ApiCardListItem | ApiCardDetail): CardRecord {
  const fallback = getFallbackCard(card.slug)
  const categories = buildCategories(card, fallback)

  return {
    slug: card.slug,
    name: card.name,
    issuer: card.issuer.name,
    network: toTitleCase(card.network),
    annualFee: centsToDollars(card.annual_fee_cents),
    feeType: card.fee_type,
    score: fallback?.score ?? (card.fee_type === 'NO_FEE' ? 78 : 82),
    imageUrl: card.image_url ?? fallback?.imageUrl,
    summary: buildSummary(card, categories),
    bestFor: buildBestFor(card, categories),
    welcomeOffer: buildWelcomeOffer(card),
    rewardRates: buildRewardRates(card),
    categories,
    benefitHighlights: buildBenefitHighlights(card, fallback),
    strengths: buildStrengths(card, categories),
    watchouts: buildWatchouts(card),
  }
}
