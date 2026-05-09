import Link from 'next/link'
import { ArrowRight, Blocks, ChartNoAxesCombined, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { benefitMoments, cards, issuers, projectSignals } from '@/lib/perq-data'

function HeroPreview() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,27,0.95),rgba(12,14,18,0.98))] p-5 shadow-2xl shadow-black/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,108,59,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(74,128,255,0.14),transparent_40%)]" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Perq Signal Board</div>
            <div className="mt-1 text-lg font-semibold text-foreground">Canada-first card optimization surface</div>
          </div>
          <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
            perq.live
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Best current match</div>
                <div className="text-xs text-muted-foreground">High grocery + dining profile</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold text-foreground">94</div>
                <div className="text-xs text-muted-foreground">Perq fit score</div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(135deg,rgba(242,127,72,0.22),rgba(73,122,255,0.16))] p-4">
              <div className="text-xs text-white/70">American Express</div>
              <div className="mt-1 text-lg font-semibold text-white">Cobalt</div>
              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {['5x groceries', '5x dining', '2x transit'].map((line) => (
                  <div key={line} className="rounded-2xl bg-black/20 px-3 py-2 text-xs text-white/80">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {projectSignals.map((signal) => (
              <div key={signal.label} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{signal.label}</div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{signal.value}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{signal.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  return (
    <main className="bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(237,108,59,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(66,113,255,0.1),transparent_24%)]" />
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Independent reward tooling for Canada
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl">
                Perq helps make Canadian credit cards legible.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Explore cards, decode reward structures, compare benefit stacks, and inspect which products actually fit different spending situations. Clean interface first, monetization theatre removed.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/cards">
                <Button size="lg" className="h-12 gap-2 bg-accent px-6 text-accent-foreground hover:bg-accent/90">
                  Browse the catalog
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="h-12 border-border/60 bg-card px-6">
                  Open project lab
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Issuer coverage', value: `${issuers.length} issuers` },
                { label: 'Current working set', value: `${cards.length} modeled cards` },
                { label: 'Positioning', value: 'Project, not productized SaaS' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-border/50 bg-card/60 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <HeroPreview />
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 py-18">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="text-sm uppercase tracking-[0.2em] text-accent">Core workflow</div>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Built to explore the details that usually stay hidden.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Blocks,
                title: 'Discover cards',
                body: 'Filter by issuer, annual fee profile, and use case without burying the catalog behind growth copy.',
              },
              {
                icon: ChartNoAxesCombined,
                title: 'Compare reward logic',
                body: 'Surface earn rates, category fit, and fee tradeoffs in a data-centric layout.',
              },
              {
                icon: ShieldCheck,
                title: 'Track benefit value',
                body: 'Keep practical perks like insurance, credits, and travel extras visible instead of treating them as footnotes.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-[1.75rem] border border-border/50 bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-accent">Issuer set</div>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Canada-first coverage, presented like a tool instead of a funnel.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {issuers.map((issuer) => (
              <div key={issuer} className="rounded-3xl border border-border/50 bg-card px-5 py-4 text-sm text-foreground">
                {issuer}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="text-sm uppercase tracking-[0.2em] text-accent">Signals</div>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Small operational moments matter as much as headline earn rates.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {benefitMoments.map((moment) => (
              <article key={moment.title} className="rounded-[1.75rem] border border-border/50 bg-card p-6">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{moment.card}</div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{moment.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{moment.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
