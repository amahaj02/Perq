import { CardsExplorer } from '@/components/cards/cards-explorer'

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Explorer</h2>
        <p className="text-sm text-muted-foreground">The same shared card explorer is embedded here as part of the project lab flow.</p>
      </div>
      <CardsExplorer />
    </div>
  )
}
