import { notFound } from 'next/navigation'
import { CardDetailView } from '@/components/cards/card-detail-view'
import { getCardDetailData } from '@/lib/backend-api'

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getCardDetailData(slug)

  if (!data) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CardDetailView card={data.card} relatedCards={data.relatedCards} />
    </main>
  )
}
