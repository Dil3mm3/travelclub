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
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5&featuretype=city${countryParam}&accept-language=it`
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'it' }
      })
      const data: NominatimResult[] = await res.json()

      const cities: CityResult[] = data
        .filter(r => r.address?.city || r.address?.town || r.address?.municipality || r.address?.village)
        .map(r => ({
          name: r.address?.city || r.address?.town || r.address?.municipality || r.address?.village || r.name,
          country: r.address?.country || '',
          display: r.display_name.split(',').slice(0, 2).join(',').trim(),
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
        }))
        // Deduplica per nome città
        .filter((city, index, self) => index === self.findIndex(c => c.name === city.name))

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
        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => handleInput(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
            selected ? 'border-green-400 bg-green-50' : 'border-gray-200 focus:border-gray-400'
          }`}
        />
        {loading && (
          <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        )}
        {selected && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs font-medium">✓</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((city, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium">{city.name}</span>
                  <span className="text-xs text-gray-400 ml-1.5">{city.country}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!selected && query.length >= 3 && !loading && results.length === 0 && (
        <p className="text-xs text-gray-400 mt-1">Nessuna città trovata. Prova con un nome diverso.</p>
      )}
    </div>
  )
}
