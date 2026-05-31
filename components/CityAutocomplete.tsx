'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

interface NominatimResult {
  place_id: number
  display_name: string
  name: string
  address: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    country?: string
  }
  lat: string
  lon: string
}

interface CityResult {
  name: string
  country: string
  display: string
  lat: number
  lng: number
}

interface Props {
  value: string
  onChange: (city: CityResult | null) => void
  destinationCountry?: string
  placeholder?: string
}

export default function CityAutocomplete({ value, onChange, destinationCountry, placeholder = 'Es. Tokyo, Kyoto...' }: Props) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<CityResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const search = async (q: string) => {
    if (q.length < 3) { setResults([]); return }
    setLoading(true)

    try {
      const countryParam = destinationCountry ? `&countrycodes=${destinationCountry}` : ''
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=8${countryParam}&accept-language=it`
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'it' }
      })
      const data: NominatimResult[] = await res.json()

      const cities: CityResult[] = data
        .map(r => {
          const name =
            r.address?.city ||
            r.address?.town ||
            r.address?.municipality ||
            r.address?.village ||
            r.address?.state ||
            r.name
          return {
            name,
            country: r.address?.country || '',
            display: r.display_name.split(',').slice(0, 2).join(',').trim(),
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
          }
        })
        .filter(c => c.name)
        // Deduplica per nome città
        .filter((city, index, self) => index === self.findIndex(c => c.name === city.name))
        // Priorità a chi inizia con la query
        .sort((a, b) => {
          const ql = q.toLowerCase()
          const aStarts = a.name.toLowerCase().startsWith(ql)
          const bStarts = b.name.toLowerCase().startsWith(ql)
          if (aStarts && !bStarts) return -1
          if (!aStarts && bStarts) return 1
          return 0
        })
        .slice(0, 5)

      setResults(cities)
      setOpen(cities.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleInput = (val: string) => {
    setQuery(val)
    setSelected(false)
    onChange(null)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 400)
  }

  const handleSelect = (city: CityResult) => {
    setQuery(city.name)
    setSelected(true)
    setOpen(false)
    onChange(city)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7A8F6A' }} />
        <input
          type="text"
          value={query}
          onChange={e => handleInput(e.target.value)}
          placeholder={placeholder}
          className="w-full outline-none transition-colors"
          style={{
            paddingLeft: 36, paddingRight: 36, paddingTop: 10, paddingBottom: 10,
            fontSize: 13, borderRadius: 10, color: '#1A2010',
            border: selected ? '1px solid #5A7A35' : '1px solid #DDE4D0',
            background: selected ? '#F0F4E8' : 'white',
          }}
        />
        {loading && (
          <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" style={{ color: '#7A8F6A' }} />
        )}
        {selected && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: '#5A7A35' }}>✓</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-50 overflow-hidden"
          style={{ background: 'white', border: '1px solid #DDE4D0' }}>
          {results.map((city, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-2.5 transition-colors"
              style={{ borderBottom: i < results.length - 1 ? '1px solid #EEF2E6' : 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0F4E8' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div className="flex items-center gap-2">
                <MapPin size={13} style={{ color: '#7A8F6A', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1A2010' }}>{city.name}</span>
                  <span style={{ fontSize: 11, color: '#7A8F6A', marginLeft: 6 }}>{city.country}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!selected && query.length >= 3 && !loading && results.length === 0 && (
        <p style={{ fontSize: 11, color: '#7A8F6A', marginTop: 4 }}>Nessuna città trovata. Prova con un nome diverso.</p>
      )}
    </div>
  )
}
