import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDestinations, getDestinationBySlug, getTips } from '@/lib/data'
import TipCard from '@/components/TipCard'
import GroupRow from '@/components/GroupRow'
export const revalidate = 0

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/destinazioni" className="hover:text-gray-700 transition-colors">
          Destinazioni
        </Link>
        <span>/</span>
        <span className="text-gray-700">{dest.name}</span>
      </div>

      <div className="flex items-start justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <span className="text-6xl">{dest.flag_emoji}</span>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display font-semibold text-4xl">{dest.name}</h1>
              {dest.is_trending && (
                <span className="text-xs font-medium px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full">
                  Trending
                </span>
              )}
              {dest.is_emerging && (
                <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                  Emergente
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">{dest.cities.join(' · ')}</p>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {dest.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-shrink-0">
          <div className="text-center">
            <div className="font-display font-semibold text-2xl">{dest.member_count.toLocaleString()}</div>
            <div className="text-xs text-gray-400">italiani qui</div>
          </div>
          <div className="text-center">
            <div className="font-display font-semibold text-2xl">{activeGroups.length}</div>
            <div className="text-xs text-gray-400">gruppi attivi</div>
          </div>
          <div className="text-center">
            <div className="font-display font-semibold text-2xl">{totalMembers.toLocaleString()}</div>
            <div className="text-xs text-gray-400">nei gruppi</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="font-display font-semibold text-xl mb-1">Consigli della community</h2>
                <p className="text-sm text-gray-400">
                  {destTips.length > 0
                    ? `${destTips.length} tip condivisi da chi c'è stato`
                    : 'Ancora nessun consiglio — sii il primo!'}
                </p>
              </div>
              <Link
                href="/consigli/nuovo"
                className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              >
                + Aggiungi
              </Link>
            </div>

            {destTips.length > 0 ? (
              <div className="space-y-4">
                {destTips.map(tip => (
                  <TipCard key={tip.id} tip={tip} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Sei stato in {dest.name}? Condividi un consiglio utile alla community.
                </p>
                <Link
                  href="/consigli/nuovo"
                  className="inline-block bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Condividi un consiglio →
                </Link>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-medium text-base">Gruppi WhatsApp</h3>
              <p className="text-xs text-gray-400 mt-0.5">Entra senza account</p>
            </div>
            <div className="divide-y divide-gray-100">
              {activeGroups.map(group => (
                <GroupRow key={group.id} group={group} />
              ))}
            </div>
            {fullGroups.length > 0 && (
              <div className="divide-y divide-gray-100 bg-gray-50">
                {fullGroups.map(group => (
                  <GroupRow key={group.id} group={group} />
                ))}
              </div>
            )}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <button className="text-xs text-gray-400 hover:text-gray-700 transition-colors w-full text-left">
                + Proponi un nuovo gruppo
              </button>
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
                <span className="font-medium">{dest.member_count.toLocaleString()} italiani</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
