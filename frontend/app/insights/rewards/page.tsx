import { cards } from '@/lib/perq-data'

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Reward Maps</h2>
        <p className="text-sm text-muted-foreground">A normalized view of the reward structures the frontend needs to explain clearly.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <div key={card.slug} className="rounded-[2rem] border border-border/50 bg-card p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.issuer}</div>
            <h3 className="mt-2 text-lg font-semibold text-foreground">{card.name}</h3>
            <div className="mt-5 space-y-3">
              {card.rewardRates.map((rate) => (
                <div key={rate.label} className="rounded-2xl bg-background p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{rate.label}</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{rate.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
