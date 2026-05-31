import { describe, expect, it, vi } from 'vitest'
import { getCard as getFallbackCard, cards as fallbackCards } from '@/lib/perq-data'
import {
  resolveApiBaseUrl,
  resolveCatalogCardFromApi,
  resolveCatalogCardsFromApi,
  shouldUseMockCatalog,
} from '@/lib/catalog-data-source'
import type { ApiCardDetail, ApiCardListItem } from '@/lib/catalog-transform'

function buildApiCard(overrides: Partial<ApiCardListItem> = {}): ApiCardListItem {
  return {
    id: 1,
    name: 'RBC ION+ Visa',
    slug: 'rbc-ion-plus-visa',
    network: 'visa',
    annual_fee_cents: 4800,
    fee_type: 'FEE',
    image_url: null,
    is_active: true,
    issuer: {
      id: 1,
      name: 'RBC',
      slug: 'rbc',
      website_url: null,
      country_code: 'CA',
    },
    reward_categories: [{ id: 1, name: 'Groceries', slug: 'groceries', description: null }],
    active_signup_offer: null,
    ...overrides,
  }
}

function buildApiDetailCard(): ApiCardDetail {
  return {
    ...buildApiCard(),
    foreign_transaction_fee_bps: null,
    apply_url: null,
    rewards_currency: 'RBC Rewards',
    benefits: [],
    signup_offers: [],
    reward_rates: [
      {
        id: 1,
        earn_rate: 3,
        earn_type: 'points_per_cad',
        reward_currency: 'RBC Rewards',
        monthly_cap_cents: null,
        annual_cap_cents: null,
        cap_reset_frequency: null,
        notes: null,
        reward_category: {
          id: 1,
          name: 'Groceries',
          slug: 'groceries',
          description: null,
        },
      },
    ],
  }
}

describe('catalog data source', () => {
  it('does not allow mock catalog fallback in production', async () => {
    const cards = await resolveCatalogCardsFromApi(async () => null, false, fallbackCards)
    const card = await resolveCatalogCardFromApi('amex-cobalt', async () => null, false, getFallbackCard)

    expect(cards).toEqual([])
    expect(card).toBeNull()
  })

  it('allows mock fallback only in explicit local mock mode', async () => {
    const cards = await resolveCatalogCardsFromApi(async () => null, true, fallbackCards)
    const card = await resolveCatalogCardFromApi('amex-cobalt', async () => null, true, getFallbackCard)

    expect(cards).toEqual(fallbackCards)
    expect(card?.slug).toBe('amex-cobalt')
  })

  it('transforms backend cards when the API succeeds', async () => {
    const apiFetch = vi.fn(async () => ({ total: 1, items: [buildApiCard()] }))
    const detailFetch = vi.fn(async () => buildApiDetailCard())

    const cards = await resolveCatalogCardsFromApi(apiFetch, false, fallbackCards)
    const card = await resolveCatalogCardFromApi('rbc-ion-plus-visa', detailFetch, false, getFallbackCard)

    expect(cards).toHaveLength(1)
    expect(cards[0]?.slug).toBe('rbc-ion-plus-visa')
    expect(cards[0]?.rewardRates).toEqual([])
    expect(card?.rewardRates).toEqual([{ label: 'Groceries', value: '3x RBC Rewards' }])
  })

  it('requires an explicit production API base URL', () => {
    expect(resolveApiBaseUrl({ NODE_ENV: 'production' })).toBeNull()
    expect(resolveApiBaseUrl({ NODE_ENV: 'development' })).toBe('http://127.0.0.1:8080/api/v1')
    expect(resolveApiBaseUrl({ NODE_ENV: 'production', PERQ_API_BASE_URL: 'https://api.perq.live/api/v1' })).toBe(
      'https://api.perq.live/api/v1',
    )
  })

  it('only enables mock mode in non-production when explicitly requested', () => {
    expect(shouldUseMockCatalog({ NODE_ENV: 'production', NEXT_PUBLIC_USE_MOCK_CATALOG: 'true' })).toBe(false)
    expect(shouldUseMockCatalog({ NODE_ENV: 'development', NEXT_PUBLIC_USE_MOCK_CATALOG: 'true' })).toBe(true)
    expect(shouldUseMockCatalog({ NODE_ENV: 'development' })).toBe(false)
  })
})
