import Link from 'next/link'
import { cards, formatFee } from '@/lib/perq-data'

export default function CardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Catalog</h2>
        <p className="text-sm text-muted-foreground">A structured snapshot of the local card dataset driving the current frontend.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.slug} href={`/cards/${card.slug}`} className="rounded-[2rem] border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.issuer}</div>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{card.name}</h3>
              </div>
              <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                Score {card.score}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-background p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Best for</div>
                <div className="mt-2 text-sm font-medium text-foreground">{card.bestFor}</div>
              </div>
              <div className="rounded-2xl bg-background p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Fee</div>
                <div className="mt-2 text-sm font-medium text-foreground">{formatFee(card.annualFee)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
