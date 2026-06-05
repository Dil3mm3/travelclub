import { notFound } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getDestinations, getDestinationBySlug, getTips } from '@/lib/data'
import { MAP_CONFIG, DEFAULT_MAP_CONFIG } from '@/lib/mapconfig'
import ConsigliSection from '@/components/ConsigliSection'
import GroupRow from '@/components/GroupRow'
import { formatMemberCount } from '@/lib/utils'
import { getGuidesForDestination } from '@/lib/guides'
import GuideCard from '@/components/GuideCard'

export const revalidate = 0

const DestinationMap = dynamic(() => import('@/components/DestinationMap'), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-xl animate-pulse" style={{ background: '#EEF2E6' }} />,
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
    description: `Gruppi WhatsApp e consigli di viaggio per ${dest.name}. Il club degli italiani in viaggio.`,
  }
}

export default async function DestinazioneDetailPage({ params }: Props) {
  const dest = await getDestinationBySlug(params.slug)
  if (!dest) notFound()

  const destTips = await getTips(dest.slug)
  const guides = getGuidesForDestination(dest.slug)
  const activeGroups = dest.groups.filter(g => g.is_active)
  const fullGroups = dest.groups.filter(g => !g.is_active)
  const totalMembers = dest.groups.reduce((s, g) => s + g.member_count, 0)
  const mapConfig = MAP_CONFIG[dest.slug] ?? DEFAULT_MAP_CONFIG

  return (
    <div>
      {/* HERO destinazione */}
      <div style={{ background: '#1A2010', padding: '32px 24px 28px' }}>
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6" style={{ fontSize: 12 }}>
            <Link href="/destinazioni" style={{ color: '#A8C468' }} className="hover:opacity-80 transition-opacity">
              Destinazioni
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{dest.name}</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5">
              <span style={{ fontSize: 64, lineHeight: 1 }}>{dest.flag_emoji}</span>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="font-display font-bold" style={{ fontSize: 40, color: 'white', lineHeight: 1 }}>{dest.name}</h1>
                  {dest.is_trending && (
                    <span style={{ background: '#FEF9C3', color: '#854D0E', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>🔥 Trending</span>
                  )}
                  {dest.is_emerging && (
                    <span style={{ background: '#EEF2E6', color: '#4A5E2F', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>✦ Emergente</span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>{dest.cities.join(' · ')}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {dest.tags.map(tag => (
                    <span key={tag} style={{ background: 'rgba(168,196,104,0.15)', color: '#A8C468', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats pill — visibili solo su desktop */}
            <div className="hidden md:flex gap-6">
              {[
                { num: activeGroups.length.toString(), label: 'gruppi attivi' },
                { num: formatMemberCount(totalMembers), label: 'membri nei gruppi' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <div className="font-display font-bold" style={{ fontSize: 22, color: '#A8C468' }}>{num}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats mobile */}
          <div className="flex gap-6 mt-5 md:hidden">
            {[
              { num: activeGroups.length.toString(), label: 'gruppi attivi' },
              { num: formatMemberCount(totalMembers), label: 'membri nei gruppi' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold" style={{ fontSize: 20, color: '#A8C468' }}>{num}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INDICE ANCORATO */}
      <div className="sticky top-14 z-30 lg:hidden" style={{ background: '#F8F9F4', borderBottom: '1px solid #DDE4D0' }}>
        <div className="flex overflow-x-auto px-6 gap-1 py-2" style={{ scrollbarWidth: 'none' }}>
          {[
            { href: '#gruppi', label: 'Gruppi WhatsApp' },
            { href: '#mappa',  label: 'Mappa' },
            { href: '#consigli', label: 'Consigli' },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="flex-shrink-0 font-medium transition-colors"
              style={{ fontSize: 12, padding: '5px 14px', borderRadius: 20, border: '1px solid #DDE4D0', color: '#5A6B4A', background: 'white', whiteSpace: 'nowrap' }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* CONTENUTO */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 3 blocchi indipendenti — DOM order = mobile order: Mappa → Gruppi → Consigli
            Desktop: Mappa col1-2 row1 | Gruppi col3 row1-2 | Consigli col1-2 row2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_auto] gap-8">

          {/* 1. Mappa */}
          <div id="mappa" className="lg:col-start-1 lg:col-span-2 lg:row-start-1">
            <h2 className="font-display font-semibold mb-3" style={{ fontSize: 18, color: '#1A2010' }}>
              Mappa e gruppi per città
            </h2>
            <DestinationMap
              cities={dest.cities}
              groups={dest.groups}
              countryName={dest.name}
              center={mapConfig.center}
              zoom={mapConfig.zoom}
              destinationSlug={dest.slug}
            />
            <p style={{ fontSize: 11, color: '#7A8F6A', marginTop: 6 }}>
              Clicca sui marker per vedere i gruppi disponibili in ogni città.
            </p>
          </div>

          {/* 2. Sidebar gruppi — col3, copre entrambe le righe su desktop */}
          <div id="gruppi" className="space-y-5 lg:col-start-3 lg:row-start-1 lg:row-span-2">

            <div className="overflow-hidden" style={{ border: '1px solid #DDE4D0', borderRadius: 14 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #DDE4D0', background: '#F0F4E8' }}>
                <h3 className="font-semibold" style={{ fontSize: 14, color: '#1A2010' }}>Gruppi WhatsApp</h3>
                <p style={{ fontSize: 11, color: '#7A8F6A', marginTop: 2 }}>Entra senza account</p>
              </div>
              <div style={{ background: 'white' }}>
                {activeGroups.length > 0 ? (
                  <div className="divide-y" style={{ borderColor: '#EEF2E6' }}>
                    {activeGroups.map(group => (
                      <GroupRow key={group.id} group={group} destinationName={dest.name} />
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#7A8F6A', fontSize: 12 }}>
                    Nessun gruppo ancora.
                  </div>
                )}
              </div>
              {fullGroups.length > 0 && (
                <div style={{ borderTop: '1px solid #EEF2E6', background: '#F8F9F4' }}>
                  {fullGroups.map(group => (
                    <GroupRow key={group.id} group={group} destinationName={dest.name} />
                  ))}
                </div>
              )}
              <div style={{ padding: '10px 20px', background: '#F8F9F4', borderTop: '1px solid #EEF2E6' }}>
                <Link
                  href={`/destinazioni/${dest.slug}/proponi-gruppo`}
                  style={{ fontSize: 12, color: '#5A7A35', fontWeight: 600 }}
                  className="hover:opacity-80 transition-opacity"
                >
                  + Proponi un nuovo gruppo
                </Link>
              </div>
            </div>

            <div style={{ border: '1px solid #DDE4D0', borderRadius: 14, padding: '16px 20px', background: 'white' }}>
              <h3 className="font-semibold mb-4" style={{ fontSize: 14, color: '#1A2010' }}>Info utili</h3>
              <div className="space-y-3">
                {[
                  { label: 'Regione', value: dest.region.charAt(0).toUpperCase() + dest.region.slice(1) },
                  { label: 'Città principali', value: dest.cities.slice(0, 2).join(', ') },
                  { label: 'Community', value: `${formatMemberCount(totalMembers)} italiani` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span style={{ fontSize: 12, color: '#7A8F6A' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2010', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid #DDE4D0', borderRadius: 14, padding: '16px 20px', background: '#F0F4E8' }}>
              <p style={{ fontSize: 12, color: '#5A6B4A', lineHeight: 1.6, marginBottom: 10 }}>
                Rispetta le regole della community per mantenere i gruppi attivi e utili per tutti.
              </p>
              <Link href="/regole" style={{ fontSize: 12, color: '#5A7A35', fontWeight: 600 }}>
                Leggi le regole →
              </Link>
            </div>
          </div>

          {/* 3. Consigli */}
          <div id="consigli" className="lg:col-start-1 lg:col-span-2 lg:row-start-2">
            <ConsigliSection
              tips={destTips}
              destinationSlug={dest.slug}
              destinationName={dest.name}
              flagEmoji={dest.flag_emoji}
            />
          </div>

        </div>
      </div>

      {/* GUIDE CITTÀ */}
      {guides.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-14">
          <div style={{ height: 1, background: '#DDE4D0', marginBottom: 32 }} />
          <div className="flex justify-between items-end mb-6">
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8C468', marginBottom: 6 }}>
                Guide pratiche
              </p>
              <h2 className="font-display font-semibold" style={{ fontSize: 22, color: '#1A2010' }}>
                Guide per città
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map(guide => (
              <GuideCard key={guide.slug} guide={guide} destinationSlug={dest.slug} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
