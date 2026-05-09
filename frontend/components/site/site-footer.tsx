import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <div className="text-base font-semibold text-foreground">Perq</div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            A Canada-first platform for exploring credit cards, reward structures, and practical benefit tradeoffs.
          </p>
          <p className="text-xs text-muted-foreground">perq.live</p>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">Explore</div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/cards">Card explorer</Link>
            <Link href="/dashboard">Insights</Link>
            <Link href="/dashboard/benefits">Benefit tracker</Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">Positioning</div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Perq is not a bank and is not affiliated with card issuers. Information should be verified against current issuer terms before applying.
          </p>
        </div>
      </div>
    </footer>
  )
}
