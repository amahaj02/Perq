import { HomePage as SiteHomePage } from '@/components/site/home-page'
import { getCardExplorerData } from '@/lib/backend-api'

export default async function HomePage() {
  const { cards, issuers } = await getCardExplorerData()

  return <SiteHomePage cards={cards} issuers={issuers} />
}
