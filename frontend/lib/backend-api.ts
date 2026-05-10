import 'server-only'

import { cache } from 'react'
import { cards as fallbackCards, getCard as getFallbackCard, type CardRecord } from '@/lib/perq-data'
import { transformApiCard, type ApiCardDetail, type ApiCardListItem } from '@/lib/catalog-transform'

type ApiCardListResponse = {
  total: number
  items: ApiCardListItem[]
}

const API_BASE_URL =
  process.env.PERQ_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === 'production'
    ? 'https://perq-backend-vy2h.onrender.com/api/v1'
    : 'http://127.0.0.1:8080/api/v1')

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
  return payload.items.map(transformApiCard)
})

export const getCatalogCard = cache(async (slug: string): Promise<CardRecord | null> => {
  const payload = await apiFetch<ApiCardDetail>(`/cards/${slug}`)
  if (!payload) return getFallbackCard(slug) ?? null
  return transformApiCard(payload)
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
