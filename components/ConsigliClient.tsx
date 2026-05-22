'use client'

import { useState } from 'react'
import { Tip, Destination } from '@/lib/types'
import TipCard from '@/components/TipCard'
import { Search } from 'lucide-react'
import clsx from 'clsx'

const categories = [
  { value: 'tutti', label: 'Tutti' },
  { value: 'trasporti', label: 'Trasporti' },
  { value: 'ristoranti', label: 'Ristoranti' },
  { value: 'alloggi', label: 'Alloggi' },
  { value: 'sicurezza', label: 'Sicurezza' },
  { value: 'cultura', label: 'Cultura' },
]

interface Props {
  tips: Tip[]
  destinations: Destination[]
}

export default function ConsigliClient({ tips, destinations }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('tutti')
  const [destination, setDestination] = useState('tutti')

  const filtered = tips.filter(tip => {
    const matchCat = category === 'tutti' || tip.category === category
    const matchDest = destination === 'tutti' || tip.destination_slug === destination
    const matchQuery =
      !query ||
      tip.content.toLowerCase().includes(query.toLowerCase()) ||
      tip.destination_name.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchDest && matchQuery
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-3xl mb-2">Consigli della community</h1>
        <p className="text-gray-500 text-sm">
          Tip verificati da chi c&apos;è appena tornato. Nessun influencer, solo viaggiatori veri.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca per destinazione o parola chiave..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={clsx(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border',
                category === c.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              )}
            >
              {c.label}
            </button>
          ))}

          <select
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="px-4 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 outline-none focus:border-gray-400 transition-colors bg-white ml-auto"
          >
            <option value="tutti">Tutte le destinazioni</option>
            {destinations.map(d => (
              <option key={d.slug} value={d.slug}>
                {d.flag_emoji} {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="mb-4">Nessun consiglio trovato.</p>
          <button
            onClick={() => { setQuery(''); setCategory('tutti'); setDestination('tutti') }}
            className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            Azzera i filtri
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-4">{filtered.length} consigli trovati</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(tip => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </>
      )}

      <div className="mt-12 border border-dashed border-gray-200 rounded-xl p-8 text-center">
        <h3 className="font-display font-semibold text-lg mb-2">Hai un consiglio da condividere?</h3>
        <p className="text-sm text-gray-400 mb-5 max-w-sm mx-auto">
          Aiuta altri italiani a viaggiare meglio. Un tip specifico vale più di mille guide generiche.
        </p>
        <button className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
          Condividi un consiglio →
        </button>
      </div>
    </div>
  )
}
