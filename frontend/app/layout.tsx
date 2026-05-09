import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Perq',
  description:
    'Perq is a Canada-first credit card discovery and optimization platform focused on comparing cards, rewards, and benefits in a clean modern interface.',
  keywords: ['Perq', 'perq.live', 'Canada credit cards', 'rewards', 'cash back', 'card explorer'],
  openGraph: {
    title: 'Perq',
    description: 'Canada-first credit card discovery and optimization.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-background">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
