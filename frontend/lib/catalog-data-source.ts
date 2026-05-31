import type { CardRecord } from '@/lib/perq-data'
import { transformApiCard, type ApiCardDetail, type ApiCardListItem } from '@/lib/catalog-transform'

export type ApiCardListResponse = {
  total: number
  items: ApiCardListItem[]
}

export function shouldUseMockCatalog(env: NodeJS.ProcessEnv = process.env) {
  return env.NODE_ENV !== 'production' && env.NEXT_PUBLIC_USE_MOCK_CATALOG === 'true'
}

export function resolveApiBaseUrl(env: NodeJS.ProcessEnv = process.env) {
  if (env.PERQ_API_BASE_URL) return env.PERQ_API_BASE_URL
  if (env.NEXT_PUBLIC_API_BASE_URL) return env.NEXT_PUBLIC_API_BASE_URL
  if (env.NODE_ENV !== 'production') return 'http://127.0.0.1:8080/api/v1'
  return null
}

export async function resolveCatalogCardsFromApi(
  apiFetch: (path: string) => Promise<ApiCardListResponse | null>,
  useMockCatalog: boolean,
  fallbackCards: CardRecord[],
) {
  const payload = await apiFetch('/cards')

  if (payload?.items?.length) {
    return payload.items.map(transformApiCard)
  }

  return useMockCatalog ? fallbackCards : []
}

export async function resolveCatalogCardFromApi(
  slug: string,
  apiFetch: (path: string) => Promise<ApiCardDetail | null>,
  useMockCatalog: boolean,
  getFallbackCard: (slug: string) => CardRecord | undefined,
) {
  const payload = await apiFetch(`/cards/${slug}`)

  if (payload) {
    return transformApiCard(payload)
  }

  return useMockCatalog ? getFallbackCard(slug) ?? null : null
}
