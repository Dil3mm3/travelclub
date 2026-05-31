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
          <span style={{ fontSize: 40, lineHeight: 1 }}>{dest.flag_emoji}</span>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8C468', marginBottom: 6 }}>
              {dest.name}
            </p>
            <h1 className="font-display font-semibold" style={{ fontSize: 24, color: '#1A2010', lineHeight: 1.1 }}>
              Proponi un gruppo WhatsApp
            </h1>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#7A8F6A', lineHeight: 1.6 }}>
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
