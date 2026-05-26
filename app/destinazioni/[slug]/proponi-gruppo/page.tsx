import { getDestinations, getDestinationBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import ProponiGruppoForm from '@/components/ProponiGruppoForm'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const destinations = await getDestinations()
  return destinations.map(d => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props) {
  const dest = await getDestinationBySlug(params.slug)
  if (!dest) return {}
  return {
    title: `Proponi un gruppo WhatsApp — ${dest.name} · travelclub`,
  }
}

export default async function ProponiGruppoPage({ params }: Props) {
  const dest = await getDestinationBySlug(params.slug)
  if (!dest) notFound()

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{dest.flag_emoji}</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              {dest.name}
            </p>
            <h1 className="font-display font-semibold text-2xl">
              Proponi un gruppo WhatsApp
            </h1>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Conosci un gruppo WhatsApp attivo per {dest.name}? Aggiungilo alla directory —
          dopo una verifica manuale lo pubblicheremo sulla pagina.
        </p>
      </div>

      <ProponiGruppoForm
        destinationSlug={dest.slug}
        destinationName={dest.name}
      />
    </div>
  )
}
