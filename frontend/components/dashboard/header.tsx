'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Blocks, Menu } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/cards', label: 'Catalog' },
  { href: '/dashboard/rewards', label: 'Reward Maps' },
  { href: '/dashboard/benefits', label: 'Benefits' },
  { href: '/dashboard/insights', label: 'Signals' },
  { href: '/dashboard/recommendations', label: 'Explorer' },
  { href: '/dashboard/settings', label: 'Project Notes' },
]

export function DashboardHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentPage =
    navItems.find((item) => (item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href))) ??
    navItems[0]

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Perq Lab</div>
          <h1 className="text-lg font-semibold text-foreground">{currentPage.label}</h1>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">perq.live</div>
          <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
            <Blocks className="h-3.5 w-3.5" />
            Local mock mode
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground md:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label="Toggle dashboard navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-20 border-b border-border/50 bg-background/95 p-3 backdrop-blur-xl md:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-xl px-3 py-2 text-sm',
                    active ? 'bg-accent/10 text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
