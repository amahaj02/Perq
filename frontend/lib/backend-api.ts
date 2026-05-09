import 'server-only'

import { cache } from 'react'
import { cards as fallbackCards, getCard as getFallbackCard, type BenefitHighlight, type CardCategory, type CardRecord, type RewardRate } from '@/lib/perq-data'

type ApiIssuer = {
  id: number
  name: string
  slug: string
  website_url: string | null
  country_code: string
}

type ApiRewardCategory = {
  id: number
  name: string
  slug: string
  description: string | null
}

type ApiSignupOffer = {
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

type ApiBenefit = {
  id: number
  name: string
  slug: string
  benefit_type: string
  description: string | null
}

type ApiCardBenefit = {
  id: number
  title: string
  official_text: string
  simple_text: string | null
  sort_order: number
  is_highlight: boolean
  benefit: ApiBenefit
}

type ApiCardListItem = {
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

type ApiCardDetail = ApiCardListItem & {
  foreign_transaction_fee_bps: number | null
  apply_url: string | null
  rewards_currency: string | null
  benefits: ApiCardBenefit[]
  signup_offers: ApiSignupOffer[]
}

type ApiCardListResponse = {
  total: number
  items: ApiCardListItem[]
}

const API_BASE_URL =
  process.env.PERQ_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://127.0.0.1:8000/api/v1'

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

function buildWelcomeOffer(card: ApiCardListItem | ApiCardDetail, fallback?: CardRecord) {
  const activeOffer = card.active_signup_offer
  if (activeOffer?.summary) return activeOffer.summary
  if (activeOffer?.title) return activeOffer.title
  return fallback?.welcomeOffer ?? 'No active signup offer is currently tracked.'
}

function buildBestFor(card: ApiCardListItem | ApiCardDetail, categories: CardCategory[], fallback?: CardRecord) {
  if (fallback?.bestFor) return fallback.bestFor
  if (categories.length > 0) {
    return `${categories.join(', ')} spending patterns`
  }
  return `${card.issuer.name} cardholders comparing ${card.network} options`
}

function buildRewardRates(card: ApiCardListItem | ApiCardDetail, categories: CardCategory[], fallback?: CardRecord): RewardRate[] {
  if (fallback?.rewardRates.length) return fallback.rewardRates
  if (categories.length > 0) {
    return categories.slice(0, 3).map((category) => ({
      label: `${category} category`,
      value: 'Tracked in the Perq catalog',
    }))
  }
  return [{ label: 'Reward profile', value: 'Structured earn details coming from the API next' }]
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

function buildStrengths(card: ApiCardDetail | ApiCardListItem, categories: CardCategory[], fallback?: CardRecord) {
  if (fallback?.strengths.length) return fallback.strengths

  const strengths = [
    card.active_signup_offer ? 'Active signup offer currently tracked in Perq.' : null,
    categories.length > 0 ? `Relevant for ${categories.join(', ').toLowerCase()} use cases.` : null,
    card.fee_type === 'NO_FEE' ? 'No annual fee keeps the long-term hold cost low.' : 'Premium fee profile suggests benefits matter in the value equation.',
  ]

  return strengths.filter((value): value is string => Boolean(value))
}

function buildWatchouts(card: ApiCardDetail | ApiCardListItem, fallback?: CardRecord) {
  if (fallback?.watchouts.length) return fallback.watchouts

  const watchouts = [
    card.fee_type === 'FEE' ? 'Annual fee should be justified against actual spending and benefit usage.' : null,
    'Editorial reward-rate detail is still partly sourced from local UI metadata.',
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

function buildSummary(card: ApiCardListItem | ApiCardDetail, categories: CardCategory[], fallback?: CardRecord) {
  if (fallback?.summary) return fallback.summary
  const categorySummary = categories.length > 0 ? `${categories.join(', ')} card` : 'Canadian credit card'
  return `${card.issuer.name} ${categorySummary.toLowerCase()} tracked in the Perq catalog.`
}

function transformCard(card: ApiCardListItem | ApiCardDetail): CardRecord {
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
    summary: buildSummary(card, categories, fallback),
    bestFor: buildBestFor(card, categories, fallback),
    welcomeOffer: buildWelcomeOffer(card, fallback),
    rewardRates: buildRewardRates(card, categories, fallback),
    categories,
    benefitHighlights: buildBenefitHighlights(card, fallback),
    strengths: buildStrengths(card, categories, fallback),
    watchouts: buildWatchouts(card, fallback),
  }
}

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

export const getCatalogCards = cache(async (): Promise<CardRecord[]> => {
  const payload = await apiFetch<ApiCardListResponse>('/cards')
  if (!payload?.items.length) return fallbackCards
  return payload.items.map(transformCard)
})

export const getCatalogCard = cache(async (slug: string): Promise<CardRecord | null> => {
  const payload = await apiFetch<ApiCardDetail>(`/cards/${slug}`)
  if (!payload) return getFallbackCard(slug) ?? null
  return transformCard(payload)
})

export async function getCardExplorerData() {
  const cards = await getCatalogCards()
  const issuers = Array.from(new Set(cards.map((card) => card.issuer))).sort((left, right) => left.localeCompare(right))
  const categories = Array.from(new Set(cards.flatMap((card) => card.categories)))

  return { cards, issuers, categories }
}

export async function getCardDetailData(slug: string) {
  const [card, cards] = await Promise.all([getCatalogCard(slug), getCatalogCards()])
  if (!card) return null

  const relatedCards = cards
    .filter((candidate) => candidate.slug !== card.slug)
    .filter((candidate) => candidate.categories.some((category) => card.categories.includes(category)))
    .slice(0, 3)

  return { card, relatedCards }
}

export function getSupabaseClientConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    dataApiEnabled: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  }
}
