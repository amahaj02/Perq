import 'server-only'

import { cache } from 'react'
import { cards as fallbackCards, getCard as getFallbackCard, type CardRecord } from '@/lib/perq-data'
import type { ApiCardDetail } from '@/lib/catalog-transform'
import {
  resolveApiBaseUrl,
  resolveCatalogCardFromApi,
  resolveCatalogCardsFromApi,
  shouldUseMockCatalog,
} from '@/lib/catalog-data-source'

const API_BASE_URL = resolveApiBaseUrl()
const USE_MOCK_CATALOG = shouldUseMockCatalog()

async function apiFetch<T>(path: string): Promise<T | null> {
  if (!API_BASE_URL) {
    return null
  }

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
  return resolveCatalogCardsFromApi(apiFetch, USE_MOCK_CATALOG, fallbackCards)
})

export const getCatalogCard = cache(async (slug: string): Promise<CardRecord | null> => {
  const fetchCardDetail = (path: string) => apiFetch<ApiCardDetail>(path)
  return resolveCatalogCardFromApi(slug, fetchCardDetail, USE_MOCK_CATALOG, getFallbackCard)
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
