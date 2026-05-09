import { cards } from '@/lib/perq-data'

export default function BenefitsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Benefits</h2>
        <p className="text-sm text-muted-foreground">Benefit tracking is framed here as a visibility problem, not a loyalty-program gimmick.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {cards.map((card) => (
          <div key={card.slug} className="rounded-[2rem] border border-border/50 bg-card p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.name}</div>
            <div className="mt-4 space-y-3">
              {card.benefitHighlights.map((benefit) => (
                <div key={benefit.title} className="rounded-2xl bg-background p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{benefit.type}</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{benefit.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{benefit.detail}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
