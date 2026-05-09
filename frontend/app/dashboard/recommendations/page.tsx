import { CardsExplorer } from '@/components/cards/cards-explorer'
import { getCardExplorerData } from '@/lib/backend-api'

export default async function RecommendationsPage() {
  const { cards } = await getCardExplorerData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Explorer</h2>
        <p className="text-sm text-muted-foreground">A full-screen exploration view for filtering issuers, fee profiles, and likely fit.</p>
      </div>
      <CardsExplorer cards={cards} />
    </div>
  )
}
