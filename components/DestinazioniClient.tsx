'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Destination, Region } from '@/lib/types'
import { Search, Plus } from 'lucide-react'
import clsx from 'clsx'

const regions: { value: Region | 'tutti'; label: string }[] = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'asia', label: 'Asia' },
  { value: 'europa', label: 'Europa' },
  { value: 'america', label: 'Americhe' },
  { value: 'africa', label: 'Africa' },
  { value: 'oceania', label: 'Oceania' },
]

export default function DestinazioniClient({ destinations }: { destinations: Destination[] }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<Region | 'tutti'>('tutti')

  const filtered = destinations.filter(d => {
    const matchRegion = region === 'tutti' || d.region === region
    const matchQuery =
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.cities.some(c => c.toLowerCase().includes(query.toLowerCase()))
    return matchRegion && matchQuery
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-3xl mb-2">
          Gruppi WhatsApp per destinazione
        </h1>
        <p className="text-gray-500 text-sm">
          Trova il gruppo giusto, entra subito — nessun account necessario.
        </p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca destinazione..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        {regions.map(r => (
          <button
            key={r.value}
            onClick={() => setRegion(r.value)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
              region === r.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(dest => (
            <div key={dest.id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors">
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{dest.flag_emoji}</span>
                    <div>
                      <div className="font-medium text-base">{dest.name}</div>
                      <div className="text-xs text-gray-400">{dest.cities.join(' · ')}</div>
                    </div>
                  </div>
                  {dest.is_trending && (
                    <span className="text-xs font-medium px-2 py-1 bg-orange-50 text-orange-700 rounded-full whitespace-nowrap">
                      Trending
                    </span>
                  )}
                  {dest.is_emerging && (
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full whitespace-nowrap">
                      Emergente
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {dest.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Gruppi attivi
                </p>
                <div className="space-y-3">
                  {dest.groups.map(group => (
                    <div key={group.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={clsx(
                          'w-2 h-2 rounded-full flex-shrink-0',
                          group.member_count >= group.max_members ? 'bg-red-400' : 'bg-green-400'
                        )} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{group.name}</div>
                          <div className="text-xs text-gray-400">
                            {group.member_count.toLocaleString()} / {group.max_members.toLocaleString()} membri
                          </div>
                        </div>
                      </div>
                      {group.member_count < group.max_members ? (
                        <a
                          href={group.whatsapp_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          Entra
                        </a>
                      ) : (
                        <span className="flex-shrink-0 text-xs px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg">
                          Pieno
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  <span className="font-medium text-gray-900">{dest.member_count.toLocaleString()}</span>{' '}
                  italiani in questo paese
                </span>
                <Link
                  href={`/destinazioni/${dest.slug}`}
                  className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
                >
                  <Plus size={12} />
                  Aggiungi gruppo
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
