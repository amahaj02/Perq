import { CardsExplorer } from '@/components/cards/cards-explorer'
import { getCardExplorerData } from '@/lib/backend-api'

export default async function CardsPage() {
  const { cards } = await getCardExplorerData()

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CardsExplorer cards={cards} />
    </main>
  )
}
