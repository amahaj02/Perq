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
          <h2 className="mt-3 text-3xl font-semibold text-foreground">Perq is now organized as a frontend-first card exploration project.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The dashboard is no longer pretending to be a SaaS account area. It acts as a project lab: a space for comparing the catalog, inspecting reward logic, and validating the information architecture around Canadian cards.
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
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Catalog shape</div>
          <div className="mt-3 text-2xl font-semibold text-foreground">${averageFee}</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Average modeled annual fee across the current working set. This is useful for testing how fee-aware comparisons should be presented.
          </p>
        </div>
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Positioning</div>
          <div className="mt-3 text-lg font-semibold text-foreground">Technical project, not a monetized funnel</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pricing tables, enterprise messaging, plan language, and fake growth copy have been removed from the primary frontend surface.
          </p>
        </div>
        <div className="rounded-[2rem] border border-border/50 bg-card p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Backend stance</div>
          <div className="mt-3 text-lg font-semibold text-foreground">Mock-first</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The UI now runs cleanly against local typed data so the frontend can evolve before committing to backend architecture.
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
