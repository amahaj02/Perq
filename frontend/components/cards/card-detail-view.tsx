import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatFee, getRelatedCards, type CardRecord } from '@/lib/perq-data'

export function CardDetailView({ card }: { card: CardRecord }) {
  const relatedCards = getRelatedCards(card)

  return (
    <div className="space-y-8">
      <Link href="/cards" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(242,127,72,0.2),rgba(71,118,255,0.16))] p-8">
          <div className="text-sm text-white/70">{card.issuer}</div>
          <h1 className="mt-3 text-4xl font-semibold text-white">{card.name}</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">{card.summary}</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/55">Network</div>
              <div className="mt-2 text-base font-medium text-white">{card.network}</div>
            </div>
            <div className="rounded-[1.5rem] bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/55">Perq score</div>
              <div className="mt-2 text-base font-medium text-white">{card.score}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-border/50 bg-card p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Fit</div>
            <div className="mt-3 text-lg font-semibold text-foreground">{card.bestFor}</div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-background p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Annual fee</div>
                <div className="mt-2 text-sm font-medium text-foreground">{formatFee(card.annualFee)}</div>
              </div>
              <div className="rounded-2xl bg-background p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome profile</div>
                <div className="mt-2 text-sm font-medium text-foreground">{card.welcomeOffer}</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/50 bg-card p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Categories</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {card.categories.map((category) => (
                <span key={category} className="rounded-full border border-border/60 px-3 py-1.5 text-sm text-foreground">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reward structure</div>
          <div className="mt-5 space-y-3">
            {card.rewardRates.map((rate) => (
              <div key={rate.label} className="rounded-2xl bg-background p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{rate.label}</div>
                <div className="mt-2 text-sm font-medium text-foreground">{rate.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Benefit highlights</div>
          <div className="mt-5 space-y-3">
            {card.benefitHighlights.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-background p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{benefit.type}</div>
                <div className="mt-2 text-sm font-medium text-foreground">{benefit.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{benefit.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Strengths</div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {card.strengths.map((item) => (
              <li key={item} className="rounded-2xl bg-background px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Watchouts</div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {card.watchouts.map((item) => (
              <li key={item} className="rounded-2xl bg-background px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/50 bg-card p-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Related cards</div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {relatedCards.map((relatedCard) => (
            <Link key={relatedCard.slug} href={`/cards/${relatedCard.slug}`} className="rounded-[1.5rem] border border-border/50 bg-background p-5">
              <div className="text-xs text-muted-foreground">{relatedCard.issuer}</div>
              <div className="mt-2 text-base font-semibold text-foreground">{relatedCard.name}</div>
              <div className="mt-3 text-sm text-muted-foreground">{relatedCard.bestFor}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
