import { cards } from '@/lib/perq-data'

export default function InsightsPage() {
  const noFeeCount = cards.filter((card) => card.feeType === 'NO_FEE').length
  const travelCount = cards.filter((card) => card.categories.includes('Travel')).length
  const cashbackCount = cards.filter((card) => card.categories.includes('Cash Back')).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Signals</h2>
        <p className="text-sm text-muted-foreground">Quick heuristics for pressure-testing the information architecture and comparison surfaces.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Travel-heavy cards', value: String(travelCount), detail: 'Where benefit stacks often matter most.' },
          { label: 'Cash back cards', value: String(cashbackCount), detail: 'Cards that should emphasize clarity over hype.' },
          { label: 'No-fee cards', value: String(noFeeCount), detail: 'Important anchor set for practical comparisons.' },
        ].map((item) => (
          <div key={item.label} className="rounded-[2rem] border border-border/50 bg-card p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
            <div className="mt-3 text-3xl font-semibold text-foreground">{item.value}</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-border/50 bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">What the frontend should keep optimizing for</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            'Make annual fees and fee waivers obvious early in the card decision flow.',
            'Keep issuer and use-case filters lightweight enough to scan on mobile.',
            'Present benefits as operational value, not decorative marketing bullets.',
            'Treat welcome offers as context, not the whole story.',
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
