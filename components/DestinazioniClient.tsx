'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Destination, Region } from '@/lib/types'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import WhatsAppIcon from './WhatsAppIcon'

const continents: { value: Region | 'tutti'; label: string; emoji: string }[] = [
  { value: 'tutti',   label: 'Tutti',    emoji: '🌍' },
  { value: 'europa',  label: 'Europa',   emoji: '🇪🇺' },
  { value: 'asia',    label: 'Asia',     emoji: '🌏' },
  { value: 'africa',  label: 'Africa',   emoji: '🌍' },
  { value: 'america', label: 'Americhe', emoji: '🌎' },
  { value: 'oceania', label: 'Oceania',  emoji: '🌊' },
]

export default function DestinazioniClient({ destinations }: { destinations: Destination[] }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<Region | 'tutti'>('tutti')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ europa: true, asia: true, africa: true, america: true, oceania: true })

  const filtered = destinations.filter(d => {
    const matchRegion = region === 'tutti' || d.region === region
    const matchQuery =
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.cities.some(c => c.toLowerCase().includes(query.toLowerCase()))
    return matchRegion && matchQuery
  })

  // Raggruppa per continente
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
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-3xl mb-2">
          Destinazioni
        </h1>
        <p className="text-gray-500 text-sm">
          {destinations.length} paesi coperti — trova il gruppo WhatsApp giusto per il tuo viaggio.
        </p>
      </div>

      {/* Filtri */}
      <div className="flex gap-3 mb-8 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca paese o città..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {continents.map(c => (
            <button
              key={c.value}
              onClick={() => setRegion(c.value)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                region === c.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              )}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risultati */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="mb-4">Nessuna destinazione trovata.</p>
          <button
            onClick={() => { setQuery(''); setRegion('tutti') }}
            className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            Azzera i filtri
          </button>
        </div>
      ) : isSearching || isFiltered ? (
        // Vista flat quando si cerca o filtra
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(dest => (
            <DestCard key={dest.id} dest={dest} />
          ))}
        </div>
      ) : (
        // Vista per continente
        <div className="space-y-6">
          {grouped.map(continent => (
            <div key={continent.value} className="border border-gray-100 rounded-2xl overflow-hidden">
              {/* Header continente */}
              <button
                onClick={() => toggleContinent(continent.value)}
                className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{continent.emoji}</span>
                  <div className="text-left">
                    <div className="font-display font-semibold text-lg">{continent.label}</div>
                    <div className="text-xs text-gray-400">
                      {continent.destinations.length} destinazioni ·{' '}
                      {continent.destinations.reduce((s, d) =>
                        s + d.groups.filter(g => g.is_active).length, 0
                      )} gruppi attivi
                    </div>
                  </div>
                </div>
                {collapsed[continent.value]
                  ? <ChevronDown size={18} className="text-gray-400" />
                  : <ChevronUp size={18} className="text-gray-400" />
                }
              </button>

              {/* Destinazioni del continente */}
              {!collapsed[continent.value] && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
  )
}

function DestCard({ dest }: { dest: Destination }) {
  const activeGroups = dest.groups.filter(g => g.is_active)
  const totalMembers = dest.groups.reduce((s, g) => s + g.member_count, 0)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors">
      {/* Card header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{dest.flag_emoji}</span>
            <div>
              <div className="font-medium text-sm">{dest.name}</div>
              <div className="text-xs text-gray-400 truncate max-w-[160px]">
                {dest.cities.slice(0, 3).join(' · ')}
              </div>
            </div>
          </div>
          <div className="flex gap-1 flex-col items-end">
            {dest.is_trending && (
              <span className="text-xs font-medium px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full whitespace-nowrap">
                Trending
              </span>
            )}
            {dest.is_emerging && (
              <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full whitespace-nowrap">
                Emergente
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {dest.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Gruppi */}
      <div className="p-4">
        {activeGroups.length > 0 ? (
          <div className="space-y-2">
            {activeGroups.slice(0, 2).map(group => (
              <div key={group.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600 truncate">{group.name}</span>
                </div>
                <a
                  href={group.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-[#25D366] text-white rounded-lg hover:bg-[#1ebe5d] transition-colors shadow-sm"
                >
                  <WhatsAppIcon size={12} />
                  Entra
                </a>
              </div>
            ))}
            {activeGroups.length > 2 && (
              <Link
                href={`/destinazioni/${dest.slug}`}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                +{activeGroups.length - 2} altri gruppi →
              </Link>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400">Nessun gruppo attivo</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-gray-50 flex justify-between items-center border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {totalMembers > 0 ? `${totalMembers.toLocaleString()} nei gruppi` : 'Nessun membro'}
        </span>
        <Link
          href={`/destinazioni/${dest.slug}`}
          className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          Vedi tutto →
        </Link>
      </div>
    </div>
  )
}
