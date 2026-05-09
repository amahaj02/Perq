'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Blocks, CreditCard, FileText, LayoutDashboard, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/cards', label: 'Catalog', icon: CreditCard },
  { href: '/dashboard/rewards', label: 'Reward Maps', icon: TrendingUp },
  { href: '/dashboard/benefits', label: 'Benefits', icon: Shield },
  { href: '/dashboard/insights', label: 'Signals', icon: BarChart3 },
  { href: '/dashboard/recommendations', label: 'Explorer', icon: Sparkles },
  { href: '/dashboard/settings', label: 'Project Notes', icon: FileText },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border/50 bg-sidebar md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,oklch(0.63_0.18_38),oklch(0.45_0.1_220))] text-sm font-semibold text-white">
          P
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Perq Lab</div>
          <div className="text-[11px] text-muted-foreground">Frontend-first workspace</div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors',
                    isActive
                      ? 'bg-accent/12 text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-4 w-4', isActive && 'text-accent')} />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-border/50 p-4">
        <div className="rounded-[1.5rem] border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Blocks className="h-4 w-4 text-accent" />
            Project posture
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Independent interface exploration for Canadian card discovery, rewards logic, and benefit visibility.
          </p>
        </div>
      </div>
    </aside>
  )
}
