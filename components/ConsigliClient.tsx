'use client'

import { useState } from 'react'
import { Tip, Destination } from '@/lib/types'
import TipCard from '@/components/TipCard'
import { Search } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { value: 'tutti',      label: 'Tutti',        emoji: '✨' },
  { value: 'trasporti',  label: 'Trasporti',    emoji: '🚌' },
  { value: 'ristoranti', label: 'Ristoranti',   emoji: '🍜' },
  { value: 'alloggi',    label: 'Alloggi',      emoji: '🏨' },
  { value: 'sicurezza',  label: 'Sicurezza',    emoji: '🔒' },
  { value: 'cultura',    label: 'Cultura',      emoji: '🏛️' },
  { value: 'altro',      label: 'Altro',        emoji: '💡' },
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
    const matchQuery = !query ||
      tip.content.toLowerCase().includes(query.toLowerCase()) ||
      tip.destination_name.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchDest && matchQuery
  })

  return (
    <div>
      {/* Hero header */}
      <div style={{ background: '#1A2010', padding: '32px 24px 28px' }}>
        <div className="max-w-5xl mx-auto">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8C468', marginBottom: 8 }}>
            ✨ dalla community
          </p>
          <h1 className="font-display font-bold" style={{ fontSize: 36, color: 'white', marginBottom: 8, lineHeight: 1.1 }}>
            Consigli di viaggio
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 400, lineHeight: 1.6 }}>
            Tip verificati da chi è appena tornato. Nessun influencer, solo viaggiatori veri.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Filtri */}
        <div className="space-y-3 mb-8">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7A8F6A' }} />
            <input
              type="text"
              placeholder="Cerca per destinazione o parola chiave..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full outline-none"
              style={{
                paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
                fontSize: 13, border: '1px solid #DDE4D0', borderRadius: 10,
                background: 'white', color: '#1A2010',
              }}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            {categories.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className="transition-all font-medium"
                style={{
                  padding: '7px 14px', borderRadius: 20, fontSize: 12,
                  border: category === c.value ? 'none' : '1px solid #DDE4D0',
                  background: category === c.value ? '#5A7A35' : 'white',
                  color: category === c.value ? 'white' : '#5A6B4A',
                }}
              >
                {c.emoji} {c.label}
              </button>
            ))}

            <select
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="outline-none ml-auto"
              style={{
                padding: '7px 12px', borderRadius: 20, fontSize: 12,
                border: '1px solid #DDE4D0', color: '#5A6B4A', background: 'white',
              }}
            >
              <option value="tutti">Tutte le destinazioni</option>
              {destinations.map(d => (
                <option key={d.slug} value={d.slug}>{d.flag_emoji} {d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Risultati */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#7A8F6A' }}>
            <p className="mb-4">Nessun consiglio trovato.</p>
            <button
              onClick={() => { setQuery(''); setCategory('tutti'); setDestination('tutti') }}
              style={{ border: '1px solid #DDE4D0', padding: '8px 16px', borderRadius: 10, background: 'white', color: '#5A6B4A', fontSize: 13 }}
            >
              Azzera i filtri
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12, color: '#7A8F6A', marginBottom: 16 }}>{filtered.length} consig{filtered.length === 1 ? 'lio' : 'li'} trovati</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(tip => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: '#F0F4E8', border: '1px solid #DDE4D0' }}>
          <h3 className="font-display font-semibold mb-2" style={{ fontSize: 20, color: '#1A2010' }}>
            Hai un consiglio da condividere?
          </h3>
          <p style={{ fontSize: 13, color: '#7A8F6A', marginBottom: 20, maxWidth: 360, margin: '0 auto 20px' }}>
            Un tip specifico vale più di mille guide generiche. Aiuta chi viene dopo di te.
          </p>
          <Link href="/consigli/nuovo" className="font-bold inline-block transition-colors"
            style={{ background: '#5A7A35', color: 'white', fontSize: 13, padding: '11px 22px', borderRadius: 24 }}>
            ✈️ Condividi un consiglio
          </Link>
        </div>
      </div>
    </div>
  )
}
