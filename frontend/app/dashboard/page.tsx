import Link from 'next/link'
import { ArrowRight, CreditCard, Shield, TrendingUp } from 'lucide-react'
import { benefitMoments, cards, issuers } from '@/lib/perq-data'

export default function DashboardPage() {
  const premiumCount = cards.filter((card) => card.categories.includes('Premium')).length
  const averageFee = Math.round(cards.reduce((sum, card) => sum + card.annualFee, 0) / cards.length)

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Overview</div>
          <h2 className="mt-3 text-3xl font-semibold text-foreground">A dedicated view for comparing cards, rewards, and benefits.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This section brings together the card catalog, reward maps, benefit visibility, and card-selection signals in one focused workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/cards" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
              Open card catalog
            </Link>
            <Link href="/dashboard/recommendations" className="rounded-xl border border-border/60 px-4 py-2 text-sm text-foreground">
              Open explorer view
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {[
            { label: 'Modeled cards', value: String(cards.length), icon: CreditCard },
            { label: 'Issuers', value: String(issuers.length), icon: TrendingUp },
            { label: 'Premium cards', value: String(premiumCount), icon: Shield },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-[2rem] border border-border/50 bg-card p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
              <div className="mt-3 text-3xl font-semibold text-foreground">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Fee benchmark</div>
          <div className="mt-3 text-2xl font-semibold text-foreground">${averageFee}</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Average annual fee across the current tracked catalog.
          </p>
        </div>
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Coverage</div>
          <div className="mt-3 text-lg font-semibold text-foreground">Cards, rewards, and benefits</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Perq is structured around practical card comparison rather than issuer marketing copy.
          </p>
        </div>
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Data path</div>
          <div className="mt-3 text-lg font-semibold text-foreground">Live API-backed catalog</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Card surfaces can pull live catalog data from the backend while preserving editorial fallbacks where needed.
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Active signals</div>
            <h3 className="mt-2 text-xl font-semibold text-foreground">Benefit and fee moments worth visualizing well</h3>
          </div>
          <Link href="/dashboard/benefits" className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:flex">
            Review benefit tracker
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {benefitMoments.map((moment) => (
            <div key={moment.title} className="rounded-[1.5rem] bg-background p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{moment.card}</div>
              <div className="mt-2 text-base font-semibold text-foreground">{moment.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{moment.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
