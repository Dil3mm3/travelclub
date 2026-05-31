'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Destination, Region } from '@/lib/types'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { formatMemberCount } from '@/lib/utils'

const continents: { value: Region | 'tutti'; label: string; emoji: string; image: string; tagline: string }[] = [
  { value: 'tutti',   label: 'Tutti i paesi',  emoji: '🌍', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80', tagline: 'Esplora il mondo con la community italiana' },
  { value: 'europa',  label: 'Europa',          emoji: '🇪🇺', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&q=80', tagline: 'Weekend, city break e fughe nel vecchio continente' },
  { value: 'asia',    label: 'Asia',            emoji: '🌏', image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1400&q=80', tagline: 'Templi, street food e avventure senza confini' },
  { value: 'america', label: 'Americhe',        emoji: '🌎', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=80', tagline: 'Dal Messico alla Patagonia, tutto il continente' },
  { value: 'africa',  label: 'Africa & ME',     emoji: '🌍', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1400&q=80', tagline: 'Safari, deserti e mare cristallino' },
  { value: 'oceania', label: 'Oceania',         emoji: '🌊', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1400&q=80', tagline: 'Agli antipodi del mondo, insieme' },
]

export default function DestinazioniClient({ destinations }: { destinations: Destination[] }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<Region | 'tutti'>('tutti')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    europa: true, asia: true, africa: true, america: true, oceania: true
  })

  const currentContinent = continents.find(c => c.value === region) ?? continents[0]

  const filtered = destinations.filter(d => {
    const matchRegion = region === 'tutti' || d.region === region
    const matchQuery = !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.cities.some(c => c.toLowerCase().includes(query.toLowerCase()))
    return matchRegion && matchQuery
  })

  const grouped = continents
    .filter(c => c.value !== 'tutti')
    .map(c => ({
      ...c,
      destinations: filtered.filter(d => d.region === c.value),
    }))
    .filter(c => c.destinations.length > 0)

  const toggleContinent = (value: string) => {
    setCollapsed(prev => ({ ...prev, [value]: !prev[value] }))
  }

  const isSearching = query.length > 0
  const isFiltered = region !== 'tutti'

  return (
    <div>
      {/* HERO HEADER dinamico */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            backgroundImage: `url('${currentContinent.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(20,32,10,0.95) 0%, rgba(20,32,10,0.6) 60%, rgba(20,32,10,0.2) 100%)',
        }} />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6 max-w-5xl mx-auto w-full" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8C468', marginBottom: 6 }}>
            {currentContinent.emoji} {currentContinent.label}
          </p>
          <h1 className="font-display font-bold" style={{ fontSize: 32, color: 'white', lineHeight: 1.1, marginBottom: 4 }}>
            Destinazioni
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', transition: 'all 0.3s ease' }}>
            {currentContinent.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Filtri */}
        <div className="flex gap-3 mb-8 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7A8F6A' }} />
            <input
              type="text"
              placeholder="Cerca paese o città..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full outline-none transition-colors"
              style={{
                paddingLeft: 36, paddingRight: 16, paddingTop: 9, paddingBottom: 9,
                fontSize: 13, border: '1px solid #DDE4D0', borderRadius: 10,
                background: 'white', color: '#1A2010',
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {continents.map(r => (
              <button
                key={r.value}
                onClick={() => setRegion(r.value)}
                className="transition-all font-medium"
                style={{
                  padding: '8px 14px', borderRadius: 20, fontSize: 12,
                  border: region === r.value ? 'none' : '1px solid #DDE4D0',
                  background: region === r.value ? '#5A7A35' : 'white',
                  color: region === r.value ? 'white' : '#5A6B4A',
                }}
              >
                {r.emoji} {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Risultati */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#7A8F6A' }}>
            <p className="mb-4">Nessuna destinazione trovata.</p>
            <button
              onClick={() => { setQuery(''); setRegion('tutti') }}
              className="text-sm font-medium"
              style={{ border: '1px solid #DDE4D0', padding: '8px 16px', borderRadius: 10, background: 'white', color: '#5A6B4A' }}
            >
              Azzera i filtri
            </button>
          </div>
        ) : isSearching || isFiltered ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(dest => (
              <DestCard key={dest.id} dest={dest} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(continent => (
              <div key={continent.value} className="overflow-hidden" style={{ border: '1px solid #DDE4D0', borderRadius: 16 }}>
                <button
                  onClick={() => toggleContinent(continent.value)}
                  className="w-full flex items-center justify-between px-6 py-4 transition-colors"
                  style={{ background: collapsed[continent.value] ? 'white' : '#F0F4E8' }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 22 }}>{continent.emoji}</span>
                    <div className="text-left">
                      <div className="font-display font-semibold" style={{ fontSize: 17, color: '#1A2010' }}>{continent.label}</div>
                      <div style={{ fontSize: 11, color: '#7A8F6A', marginTop: 1 }}>
                        {continent.destinations.length} destinazioni ·{' '}
                        {continent.destinations.reduce((s, d) => s + d.groups.filter(g => g.is_active).length, 0)} gruppi attivi
                      </div>
                    </div>
                  </div>
                  {collapsed[continent.value]
                    ? <ChevronDown size={18} style={{ color: '#7A8F6A' }} />
                    : <ChevronUp size={18} style={{ color: '#5A7A35' }} />
                  }
                </button>

                {!collapsed[continent.value] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4" style={{ borderTop: '1px solid #DDE4D0' }}>
                    {continent.destinations.map(dest => (
                      <DestCard key={dest.id} dest={dest} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DestCard({ dest }: { dest: Destination }) {
  const activeGroups = dest.groups.filter(g => g.is_active)
  const totalMembers = dest.groups.reduce((s, g) => s + g.member_count, 0)

  return (
    <div
      style={{
        background: 'white', border: '1px solid #DDE4D0', borderRadius: 14,
        overflow: 'hidden',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 8px 24px rgba(90,122,53,0.15)'
        const bar = el.querySelector('.dest-top-bar') as HTMLElement
        if (bar) bar.style.height = '5px'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        const bar = el.querySelector('.dest-top-bar') as HTMLElement
        if (bar) bar.style.height = '3px'
      }}
    >
      <div className="dest-top-bar" style={{ height: 3, background: '#5A7A35', transition: 'height 0.25s ease' }} />
      <div style={{ padding: '12px 14px' }}>
        <div className="flex justify-between items-start mb-2">
          <span style={{ fontSize: 26 }}>{dest.flag_emoji}</span>
          <div className="flex flex-col items-end gap-1">
            {dest.is_trending && (
              <span style={{ background: '#FEF9C3', color: '#854D0E', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>🔥 Trending</span>
            )}
            {dest.is_emerging && (
              <span style={{ background: '#EEF2E6', color: '#4A5E2F', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>✦ Emergente</span>
            )}
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1A2010', marginBottom: 2 }}>{dest.name}</div>
        <div style={{ fontSize: 10, color: '#7A8F6A', marginBottom: 8 }}>{dest.cities.slice(0, 3).join(' · ')}</div>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {dest.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ background: '#EEF2E6', color: '#4A5E2F', fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 20 }}>{tag}</span>
          ))}
        </div>

        {activeGroups.length > 0 ? (
          <div className="space-y-2 mb-3">
            {activeGroups.slice(0, 2).map(group => (
              <div key={group.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: '#5A6B4A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.name}</span>
                </div>
                <a href={group.whatsapp_url} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1.5 font-semibold"
                  style={{ fontSize: 11, padding: '4px 10px', background: '#25D366', color: 'white', borderRadius: 20 }}>
                  <WhatsAppIcon size={12} />
                  Entra
                </a>
              </div>
            ))}
            {activeGroups.length > 2 && (
              <Link href={`/destinazioni/${dest.slug}`} style={{ fontSize: 11, color: '#5A7A35', fontWeight: 600 }}>
                +{activeGroups.length - 2} altri gruppi →
              </Link>
            )}
          </div>
        ) : (
          <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12 }}>Nessun gruppo ancora</p>
        )}

        <div className="flex justify-between items-center" style={{ paddingTop: 8, borderTop: '1px solid #EEF2E6' }}>
          <span style={{ fontSize: 11, color: '#7A8F6A' }}>
            {totalMembers > 0 ? formatMemberCount(totalMembers) : 'Nessun membro'}
          </span>
          <Link href={`/destinazioni/${dest.slug}`} style={{ fontSize: 11, color: '#5A7A35', fontWeight: 600 }}>
            Vedi tutto →
          </Link>
        </div>
      </div>
    </div>
  )
}
