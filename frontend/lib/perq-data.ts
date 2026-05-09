export type RewardRate = {
  label: string
  value: string
}

export type BenefitHighlight = {
  type: 'travel' | 'insurance' | 'cashback' | 'perk' | 'welcome'
  title: string
  detail: string
}

export type CardCategory =
  | 'Travel'
  | 'Cash Back'
  | 'Everyday'
  | 'No Fee'
  | 'Premium'
  | 'Student'

export type CardRecord = {
  slug: string
  name: string
  issuer: string
  network: string
  annualFee: number
  feeType: 'FEE' | 'NO_FEE'
  score: number
  imageUrl?: string
  summary: string
  bestFor: string
  welcomeOffer: string
  rewardRates: RewardRate[]
  categories: CardCategory[]
  benefitHighlights: BenefitHighlight[]
  strengths: string[]
  watchouts: string[]
}

export const issuers = [
  'RBC',
  'TD',
  'CIBC',
  'Scotiabank',
  'BMO',
  'American Express',
  'Tangerine',
] as const

export const cards: CardRecord[] = [
  {
    slug: 'amex-cobalt',
    name: 'American Express Cobalt',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 155.88,
    feeType: 'FEE',
    score: 94,
    summary: 'High-value everyday points card with standout dining and grocery earn rates.',
    bestFor: 'Food, dining, streaming, and flexible travel redemptions',
    welcomeOffer: 'Monthly points bonus structure with strong first-year upside',
    rewardRates: [
      { label: 'Groceries & dining', value: '5x MR points' },
      { label: 'Streaming', value: '3x MR points' },
      { label: 'Transit & gas', value: '2x MR points' },
    ],
    categories: ['Everyday', 'Travel', 'Premium'],
    benefitHighlights: [
      { type: 'travel', title: 'Flexible transfers', detail: 'Useful for Aeroplan and travel redemptions.' },
      { type: 'insurance', title: 'Travel coverage', detail: 'Solid emergency medical and trip protection.' },
      { type: 'perk', title: 'Amex Offers', detail: 'Frequent merchant offers can materially improve value.' },
    ],
    strengths: ['Best-in-class everyday earn on food categories', 'Useful transfer partners', 'Strong long-term value for high spenders'],
    watchouts: ['Acceptance is weaker than Visa or Mastercard', 'Monthly fee structure', 'Requires active reward management'],
  },
  {
    slug: 'rbc-avion-visa-infinite',
    name: 'RBC Avion Visa Infinite',
    issuer: 'RBC',
    network: 'Visa',
    annualFee: 120,
    feeType: 'FEE',
    score: 89,
    imageUrl: 'https://www.rbcroyalbank.com/credit-cards/canada/travel/images/rbc-avion-visa-infinite.webp',
    summary: 'Flexible travel card with broad insurance coverage and strong airline redemption flexibility.',
    bestFor: 'Travel-oriented RBC users who want flexible points',
    welcomeOffer: 'Often strongest when paired with elevated Avion welcome offers',
    rewardRates: [
      { label: 'General purchases', value: '1x Avion point' },
      { label: 'Travel portal promotions', value: 'Varies by campaign' },
      { label: 'Redemption style', value: 'Fixed or flexible travel' },
    ],
    categories: ['Travel', 'Premium'],
    benefitHighlights: [
      { type: 'travel', title: 'Flexible redemptions', detail: 'Book across airlines without bank lock-in.' },
      { type: 'insurance', title: 'Comprehensive insurance', detail: 'Good baseline travel coverage stack.' },
      { type: 'perk', title: 'Companion-style travel perks', detail: 'Useful when RBC runs travel promotions.' },
    ],
    strengths: ['Flexible travel rewards', 'Good insurance package', 'Strong brand familiarity for Canadian users'],
    watchouts: ['Everyday earn rate is less compelling', 'Value depends on redemption strategy', 'Annual fee needs to be justified'],
  },
  {
    slug: 'td-aeroplan-visa-infinite',
    name: 'TD Aeroplan Visa Infinite',
    issuer: 'TD',
    network: 'Visa',
    annualFee: 139,
    feeType: 'FEE',
    score: 87,
    summary: 'A focused Air Canada card with practical travel perks and Aeroplan integration.',
    bestFor: 'Frequent Air Canada travellers and Aeroplan collectors',
    welcomeOffer: 'Most compelling during elevated Aeroplan campaigns',
    rewardRates: [
      { label: 'Air Canada purchases', value: '1.5x Aeroplan points' },
      { label: 'Gas, groceries, dining', value: '1.5x points' },
      { label: 'Other purchases', value: '1x point' },
    ],
    categories: ['Travel', 'Premium'],
    benefitHighlights: [
      { type: 'travel', title: 'Free checked bag', detail: 'One of the most practical ongoing perks.' },
      { type: 'perk', title: 'NEXUS rebate', detail: 'Useful recurring value for frequent border crossers.' },
      { type: 'insurance', title: 'Travel protection', detail: 'Competitive insurance package for a co-brand card.' },
    ],
    strengths: ['Good fit for Aeroplan loyalists', 'Useful airline-specific benefits', 'Clear value model for travellers'],
    watchouts: ['Weaker outside Aeroplan use cases', 'Annual fee', 'Less flexible than bank-agnostic rewards'],
  },
  {
    slug: 'scotiabank-momentum-visa-infinite',
    name: 'Scotiabank Momentum Visa Infinite',
    issuer: 'Scotiabank',
    network: 'Visa',
    annualFee: 120,
    feeType: 'FEE',
    score: 85,
    summary: 'Strong cash back card for recurring bills, groceries, and household spending.',
    bestFor: 'Families optimizing recurring bills and grocery spend',
    welcomeOffer: 'Usually strongest when paired with first-year fee waivers or intro cashback',
    rewardRates: [
      { label: 'Groceries & recurring bills', value: '4% cash back' },
      { label: 'Transit & gas', value: '2% cash back' },
      { label: 'Other purchases', value: '1% cash back' },
    ],
    categories: ['Cash Back', 'Everyday', 'Premium'],
    benefitHighlights: [
      { type: 'cashback', title: 'Predictable value', detail: 'Easy-to-understand returns without redemption complexity.' },
      { type: 'insurance', title: 'Purchase protection', detail: 'Useful on higher-ticket household purchases.' },
      { type: 'perk', title: 'Household optimizer', detail: 'Works well for recurring household expense concentration.' },
    ],
    strengths: ['Excellent category cash back', 'Simple to evaluate', 'Good for predictable household budgets'],
    watchouts: ['Reward caps matter', 'Annual fee reduces value at lower spend', 'Less upside than premium travel cards'],
  },
  {
    slug: 'bmo-cashback-world-elite-mastercard',
    name: 'BMO CashBack World Elite Mastercard',
    issuer: 'BMO',
    network: 'Mastercard',
    annualFee: 120,
    feeType: 'FEE',
    score: 82,
    summary: 'Competitive premium cash back card with strong grocery positioning and everyday utility.',
    bestFor: 'Users who want premium cash back without travel complexity',
    welcomeOffer: 'Intro cashback periods often define first-year value',
    rewardRates: [
      { label: 'Groceries', value: 'Up to 5% cash back' },
      { label: 'Transit', value: '4% cash back' },
      { label: 'Recurring bills', value: '3% cash back' },
    ],
    categories: ['Cash Back', 'Premium'],
    benefitHighlights: [
      { type: 'cashback', title: 'High grocery earn', detail: 'One of the better headline rates in Canada.' },
      { type: 'perk', title: 'World Elite extras', detail: 'Useful ancillary travel and concierge benefits.' },
      { type: 'insurance', title: 'Standard coverage', detail: 'Reasonable purchase and travel protections.' },
    ],
    strengths: ['Strong grocery category economics', 'Mastercard acceptance', 'Premium cash back positioning'],
    watchouts: ['Spend caps reduce ceiling', 'Annual fee', 'Value softens after intro periods'],
  },
  {
    slug: 'cibc-dividend-visa-infinite',
    name: 'CIBC Dividend Visa Infinite',
    issuer: 'CIBC',
    network: 'Visa',
    annualFee: 120,
    feeType: 'FEE',
    score: 80,
    summary: 'Solid mainstream cash back card with a straightforward reward structure.',
    bestFor: 'Everyday spenders who want a simple premium cash back setup',
    welcomeOffer: 'Works best when the first-year fee is offset by intro cash back',
    rewardRates: [
      { label: 'Groceries', value: '4% cash back' },
      { label: 'Gas & transit', value: '2% cash back' },
      { label: 'Everything else', value: '1% cash back' },
    ],
    categories: ['Cash Back', 'Everyday', 'Premium'],
    benefitHighlights: [
      { type: 'cashback', title: 'Simple redemption profile', detail: 'Easy card to understand and compare.' },
      { type: 'insurance', title: 'Useful baseline protections', detail: 'Reasonable value for mainstream spenders.' },
      { type: 'perk', title: 'Stable fit', detail: 'Good choice for users who prefer low-maintenance rewards.' },
    ],
    strengths: ['Straightforward reward math', 'Mainstream issuer familiarity', 'Good grocery and gas profile'],
    watchouts: ['Less upside than category specialists', 'Annual fee', 'Not ideal for travel-heavy users'],
  },
  {
    slug: 'tangerine-money-back',
    name: 'Tangerine Money-Back',
    issuer: 'Tangerine',
    network: 'Mastercard',
    annualFee: 0,
    feeType: 'NO_FEE',
    score: 84,
    summary: 'Flexible no-fee cash back card with user-selected spend categories.',
    bestFor: 'No-fee users who want customizable everyday rewards',
    welcomeOffer: 'Most value comes from ongoing category selection, not bonuses',
    rewardRates: [
      { label: 'Chosen categories', value: '2% cash back' },
      { label: 'Everything else', value: '0.5% cash back' },
      { label: 'Extra category', value: 'Available with Tangerine savings setup' },
    ],
    categories: ['Cash Back', 'No Fee', 'Everyday'],
    benefitHighlights: [
      { type: 'cashback', title: 'Category flexibility', detail: 'Useful for aligning rewards with your budget mix.' },
      { type: 'perk', title: 'No annual fee', detail: 'Easy keeper card with low downside.' },
      { type: 'welcome', title: 'Beginner friendly', detail: 'Simple entry point into reward optimization.' },
    ],
    strengths: ['No fee', 'Customizable categories', 'Easy long-term keeper card'],
    watchouts: ['Weak base earn rate', 'Limited premium perks', 'Less upside for high spenders'],
  },
  {
    slug: 'bmo-spc-cashback-mastercard',
    name: 'BMO SPC CashBack Mastercard',
    issuer: 'BMO',
    network: 'Mastercard',
    annualFee: 0,
    feeType: 'NO_FEE',
    score: 76,
    summary: 'Student-friendly no-fee option with simple cash back and campus-relevant positioning.',
    bestFor: 'Students and first-card users',
    welcomeOffer: 'Lightweight starter option rather than a bonus-driven product',
    rewardRates: [
      { label: 'Groceries', value: '3% cash back' },
      { label: 'Recurring bills', value: '1% cash back' },
      { label: 'Everything else', value: '0.5% cash back' },
    ],
    categories: ['Student', 'No Fee', 'Cash Back'],
    benefitHighlights: [
      { type: 'welcome', title: 'Accessible entry point', detail: 'Useful first card for students building habits.' },
      { type: 'cashback', title: 'Simple categories', detail: 'Enough structure to learn rewards without complexity.' },
      { type: 'perk', title: 'No annual fee', detail: 'Low-risk card to keep open for credit history.' },
    ],
    strengths: ['No fee', 'Friendly for first-time cardholders', 'Simple rewards structure'],
    watchouts: ['Lower ceiling on value', 'Few premium benefits', 'Best replaced or paired later'],
  },
]

export const categoryOptions: Array<{ label: string; value: 'all' | Lowercase<CardCategory> | 'no-fee' }> = [
  { label: 'All cards', value: 'all' },
  { label: 'Travel', value: 'travel' },
  { label: 'Cash back', value: 'cash back' },
  { label: 'Everyday', value: 'everyday' },
  { label: 'No fee', value: 'no-fee' },
  { label: 'Premium', value: 'premium' },
  { label: 'Student', value: 'student' },
]

export const projectSignals = [
  {
    label: 'Cards modeled',
    value: String(cards.length),
    detail: 'Local frontend catalog aligned to the current backend schema.',
  },
  {
    label: 'Issuers tracked',
    value: String(issuers.length),
    detail: 'Canada-first issuer set spanning major banks and common alternatives.',
  },
  {
    label: 'Core surfaces',
    value: '4',
    detail: 'Landing, explorer, card detail, and a project-lab dashboard.',
  },
]

export const benefitMoments = [
  {
    title: 'Fee renewal watch',
    card: 'RBC Avion Visa Infinite',
    detail: 'Annual fee lands soon. Re-check travel value before the next renewal cycle.',
  },
  {
    title: 'Unused travel credit',
    card: 'American Express Cobalt',
    detail: 'Strong cards lose value quickly when credits and transfer opportunities sit idle.',
  },
  {
    title: 'Category drift',
    card: 'Tangerine Money-Back',
    detail: 'Custom category cards only work if the category setup still matches actual spending.',
  },
]

export function getCard(slug: string) {
  return cards.find((card) => card.slug === slug)
}

export function getRelatedCards(card: CardRecord) {
  return cards
    .filter((candidate) => candidate.slug !== card.slug)
    .filter((candidate) => candidate.categories.some((category) => card.categories.includes(category)))
    .slice(0, 3)
}

export function formatFee(amount: number) {
  return amount === 0 ? 'No annual fee' : `$${amount.toFixed(0)} annual fee`
}
