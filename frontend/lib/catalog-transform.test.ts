import { describe, expect, it } from 'vitest'
import { transformApiCard, type ApiCardDetail, type ApiCardListItem } from '@/lib/catalog-transform'

function buildListCard(overrides: Partial<ApiCardListItem> = {}): ApiCardListItem {
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
    reward_categories: [
      { id: 1, name: 'Groceries', slug: 'groceries', description: null },
      { id: 2, name: 'Dining', slug: 'dining', description: null },
    ],
    active_signup_offer: {
      id: 1,
      title: '30,000 RBC Rewards points',
      summary: 'Earn 30,000 points after meeting the minimum spend requirement.',
      bonus_value: 30000,
      bonus_currency: 'RBC Rewards',
      spend_requirement_cents: 100000,
      spend_requirement_days: 90,
      annual_fee_waived: false,
      start_date: null,
      end_date: null,
      is_active: true,
    },
    ...overrides,
  }
}

function buildDetailCard(): ApiCardDetail {
  return {
    ...buildListCard(),
    foreign_transaction_fee_bps: null,
    apply_url: null,
    rewards_currency: 'RBC Rewards',
    benefits: [
      {
        id: 1,
        title: 'Mobile device insurance',
        official_text: 'Coverage for eligible mobile devices.',
        simple_text: 'Phone coverage on eligible purchases.',
        sort_order: 0,
        is_highlight: true,
        benefit: {
          id: 1,
          name: 'Mobile device insurance',
          slug: 'mobile-device-insurance',
          benefit_type: 'insurance',
          description: 'Phone coverage on eligible purchases.',
        },
      },
    ],
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
        source_url: 'https://example.com/rbc-ion-plus',
        last_verified_at: '2026-05-09',
        confidence_level: 'verified',
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

describe('transformApiCard', () => {
  it('prefers API-derived card messaging over legacy fallback copy', () => {
    const card = transformApiCard(buildListCard())

    expect(card.summary).toBe('RBC groceries, dining card tracked in the Perq catalog.')
    expect(card.bestFor).toBe('Groceries, Dining spending patterns')
    expect(card.welcomeOffer).toContain('30,000 points')
  })

  it('uses real reward rates from the API on card detail responses', () => {
    const card = transformApiCard(buildDetailCard())

    expect(card.rewardRates).toEqual([{ label: 'Groceries', value: '3x RBC Rewards' }])
    expect(card.benefitHighlights[0]?.type).toBe('insurance')
  })

  it('does not invent placeholder reward-rate chips for list responses', () => {
    const card = transformApiCard(buildListCard())

    expect(card.rewardRates).toEqual([])
  })
})
