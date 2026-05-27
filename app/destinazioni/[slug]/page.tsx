import { notFound } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getDestinations, getDestinationBySlug, getTips } from '@/lib/data'
import { MAP_CONFIG, DEFAULT_MAP_CONFIG } from '@/lib/mapconfig'
import ConsigliSection from '@/components/ConsigliSection'
import GroupRow from '@/components/GroupRow'

export const revalidate = 0

const DestinationMap = dynamic(() => import('@/components/DestinationMap'), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-xl bg-gray-50 animate-pulse" />,
})

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
    title: `${dest.name} — travelclub`,
    description: `Gruppi WhatsApp e consigli di viaggio per ${dest.name}. Community italiana di viaggiatori.`,
  }
}

export default async function DestinazioneDetailPage({ params }: Props) {
  const dest = await getDestinationBySlug(params.slug)
  if (!dest) notFound()

  const destTips = await getTips(dest.slug)
  const activeGroups = dest.groups.filter(g => g.is_active)
  const fullGroups = dest.groups.filter(g => !g.is_active)
  const totalMembers = dest.groups.reduce((s, g) => s + g.member_count, 0)
  const mapConfig = MAP_CONFIG[dest.slug] ?? DEFAULT_MAP_CONFIG

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/destinazioni" className="hover:text-gray-700 transition-colors">Destinazioni</Link>
        <span>/</span>
        <span className="text-gray-700">{dest.name}</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-5 mb-4">
          <span className="text-6xl">{dest.flag_emoji}</span>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display font-semibold text-4xl">{dest.name}</h1>
              {dest.is_trending && (
                <span className="text-xs font-medium px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full">Trending</span>
              )}
              {dest.is_emerging && (
                <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">Emergente</span>
              )}
            </div>
            <p className="text-gray-400 text-sm">{dest.cities.join(' · ')}</p>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {dest.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="font-display font-semibold text-2xl">{dest.member_count}</div>
            <div className="text-xs text-gray-400">italiani qui</div>
          </div>
          <div className="text-center">
            <div className="font-display font-semibold text-2xl">{activeGroups.length}</div>
            <div className="text-xs text-gray-400">gruppi attivi</div>
          </div>
          <div className="text-center">
            <div className="font-display font-semibold text-2xl">{totalMembers}</div>
            <div className="text-xs text-gray-400">nei gruppi</div>
          </div>
        </div>
      </div>

      {/* Mappa */}
      <div className="mb-8">
        <h2 className="font-display font-semibold text-lg mb-3">Mappa e gruppi per città</h2>
        <DestinationMap
          cities={dest.cities}
          groups={dest.groups}
          countryName={dest.name}
          center={mapConfig.center}
          zoom={mapConfig.zoom}
        />
        <p className="text-xs text-gray-400 mt-2">Clicca sui marker per vedere i gruppi disponibili in ogni città.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ConsigliSection
            tips={destTips}
            destinationSlug={dest.slug}
            destinationName={dest.name}
            flagEmoji={dest.flag_emoji}
          />
        </div>

        <div className="space-y-6">
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-medium text-base">Gruppi WhatsApp</h3>
              <p className="text-xs text-gray-400 mt-0.5">Entra senza account</p>
            </div>
            <div className="divide-y divide-gray-100">
              {activeGroups.map(group => (
                <GroupRow key={group.id} group={group} destinationName={dest.name} />
              ))}
            </div>
            {fullGroups.length > 0 && (
              <div className="divide-y divide-gray-100 bg-gray-50">
                {fullGroups.map(group => (
                  <GroupRow key={group.id} group={group} destinationName={dest.name} />
                ))}
              </div>
            )}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <Link
                href={`/destinazioni/${dest.slug}/proponi-gruppo`}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                + Proponi un nuovo gruppo
              </Link>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-5">
            <h3 className="font-medium text-base mb-4">Info utili</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Regione</span>
                <span className="font-medium capitalize">{dest.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Città principali</span>
                <span className="font-medium text-right">{dest.cities.slice(0, 2).join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Community</span>
                <span className="font-medium">{dest.member_count} italiani</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
