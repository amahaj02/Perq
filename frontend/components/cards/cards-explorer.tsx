'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatFee, type CardRecord } from '@/lib/perq-data'
import { cn } from '@/lib/utils'

function matchesCategory(card: CardRecord, category: string) {
  if (category === 'all') return true
  if (category === 'no-fee') return card.feeType === 'NO_FEE'
  return card.categories.some((value) => value.toLowerCase() === category)
}

export function CardsExplorer({ cards }: { cards: CardRecord[] }) {
  const [query, setQuery] = useState('')
  const [issuer, setIssuer] = useState('all')
  const [category, setCategory] = useState('all')

  const issuerOptions = useMemo(() => {
    return Array.from(new Set(cards.map((card) => card.issuer))).sort((left, right) => left.localeCompare(right))
  }, [cards])

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(cards.flatMap((card) => card.categories)))
    return [
      { label: 'All cards', value: 'all' },
      ...categories.map((item) => ({
        label: item,
        value: item === 'No Fee' ? 'no-fee' : item.toLowerCase(),
      })),
    ]
  }, [cards])

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesQuery =
        query.length === 0 ||
        card.name.toLowerCase().includes(query.toLowerCase()) ||
        card.issuer.toLowerCase().includes(query.toLowerCase()) ||
        card.bestFor.toLowerCase().includes(query.toLowerCase())

      const matchesIssuer = issuer === 'all' || card.issuer === issuer

      return matchesQuery && matchesIssuer && matchesCategory(card, category)
    })
  }, [cards, category, issuer, query])

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explorer controls</div>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">Canadian card discovery without the sales layer.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Search by issuer or use case, then inspect the fee profile, strongest categories, and benefit stack for each card.
          </p>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search cards, issuers, or use cases"
                className="h-11 border-border/50 bg-background pl-10"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Issuer</span>
                <select
                  value={issuer}
                  onChange={(event) => setIssuer(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm text-foreground outline-none"
                >
                  <option value="all">All issuers</option>
                  {issuerOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm text-foreground outline-none"
                >
                  {categoryOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Visible cards', value: String(filteredCards.length), detail: 'Current result set after filters.' },
            { label: 'No-fee options', value: String(cards.filter((card) => card.feeType === 'NO_FEE').length), detail: 'Useful keeper cards and starter picks.' },
            { label: 'Premium cards', value: String(cards.filter((card) => card.categories.includes('Premium')).length), detail: 'Cards where benefits matter as much as headline rewards.' },
          ].map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-border/50 bg-card p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
              <div className="mt-3 text-3xl font-semibold text-foreground">{item.value}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredCards.map((card) => (
          <Link
            key={card.slug}
            href={`/cards/${card.slug}`}
            className="group rounded-[2rem] border border-border/50 bg-card p-6 transition-colors hover:border-accent/30"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="w-full max-w-[280px] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(242,127,72,0.2),rgba(71,118,255,0.14))] p-5">
                <div className="text-xs text-white/70">{card.issuer}</div>
                <div className="mt-2 text-lg font-semibold text-white">{card.name}</div>
                <div className="mt-8 flex items-center justify-between text-xs text-white/70">
                  <span>{card.network}</span>
                  <span>Score {card.score}</span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {card.categories.map((tag) => (
                    <span key={tag} className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-background p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Best for</div>
                    <div className="mt-2 text-sm font-medium text-foreground">{card.bestFor}</div>
                  </div>
                  <div className="rounded-2xl bg-background p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Fee profile</div>
                    <div className="mt-2 text-sm font-medium text-foreground">{formatFee(card.annualFee)}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.rewardRates.slice(0, 3).map((rate) => (
                    <div key={rate.label} className="rounded-2xl border border-border/50 px-3 py-2 text-xs text-muted-foreground">
                      <span className="text-foreground">{rate.value}</span> {rate.label}
                    </div>
                  ))}
                </div>
                <div className={cn('mt-5 text-sm font-medium transition-colors', 'text-muted-foreground group-hover:text-foreground')}>
                  Open card detail
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
