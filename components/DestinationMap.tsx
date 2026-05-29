'use client'

import { useEffect, useRef } from 'react'
import { WhatsAppGroup } from '@/lib/types'
import { formatMemberCount } from '@/lib/utils'

const CITY_COORDS: Record<string, [number, number]> = {
  'Tokyo': [35.6762, 139.6503],
  'Kyoto': [35.0116, 135.7681],
  'Osaka': [34.6937, 135.5023],
  'Hiroshima': [34.3853, 132.4553],
  'Lisbona': [38.7169, -9.1395],
  'Porto': [41.1579, -8.6291],
  'Alentejo': [38.5, -8.0],
  'Algarve': [37.2, -8.3],
  'Hanoi': [21.0285, 105.8542],
  'Ho Chi Minh': [10.8231, 106.6297],
  'Hoi An': [15.8801, 108.3380],
  'CDMX': [19.4326, -99.1332],
  'Oaxaca': [17.0732, -96.7266],
  'Yucatán': [20.9674, -89.0238],
  'Baja': [28.0, -114.0],
  'Marrakech': [31.6295, -7.9811],
  'Fès': [34.0181, -5.0078],
  'Sahara': [31.0, -4.0],
  'Essaouira': [31.5085, -9.7595],
  'Tbilisi': [41.6938, 44.8015],
  'Kazbegi': [42.6522, 44.6497],
  'Kutaisi': [42.2679, 42.7181],
  'Barcellona': [41.3851, 2.1734],
  'Madrid': [40.4168, -3.7038],
  'Siviglia': [37.3891, -5.9845],
  'Valencia': [39.4699, -0.3763],
  'Atene': [37.9838, 23.7275],
  'Santorini': [36.3932, 25.4615],
  'Corfù': [39.6243, 19.9217],
  'Rodi': [36.4341, 28.2176],
  'Mykonos': [37.4467, 25.3289],
  'Parigi': [48.8566, 2.3522],
  'Nizza': [43.7102, 7.2620],
  'Lione': [45.7640, 4.8357],
  'Bordeaux': [44.8378, -0.5792],
  'Tirana': [41.3275, 19.8189],
  'Saranda': [39.8752, 20.0069],
  'Berat': [40.7058, 19.9522],
  'Valona': [40.4667, 19.4833],
  'Dubrovnik': [42.6507, 18.0944],
  'Spalato': [43.5081, 16.4402],
  'Hvar': [43.1729, 16.4413],
  'Zara': [44.1194, 15.2314],
  'Londra': [51.5074, -0.1278],
  'Edimburgo': [55.9533, -3.1883],
  'Manchester': [53.4808, -2.2426],
  'Oxford': [51.7520, -1.2577],
  'Amsterdam': [52.3676, 4.9041],
  'Rotterdam': [51.9225, 4.4792],
  'Berlino': [52.5200, 13.4050],
  'Monaco': [48.1351, 11.5820],
  'Amburgo': [53.5753, 10.0153],
  'Reykjavik': [64.1265, -21.8174],
  'Oslo': [59.9139, 10.7522],
  'Bergen': [60.3913, 5.3221],
  'Tromsø': [69.6492, 18.9553],
  'Istanbul': [41.0082, 28.9784],
  'Cappadocia': [38.6431, 34.8289],
  'Bodrum': [37.0344, 27.4305],
  'Antalya': [36.8969, 30.7133],
  'Sharm': [27.9158, 34.3300],
  'Hurghada': [27.2578, 33.8117],
  'Cairo': [30.0444, 31.2357],
  'Luxor': [25.6872, 32.6396],
  'Tunisi': [36.8065, 10.1815],
  'Djerba': [33.8076, 10.8451],
  'Zanzibar': [-6.1659, 39.2026],
  'Serengeti': [-2.3333, 34.8333],
  'Nairobi': [-1.2921, 36.8219],
  'Città del Capo': [-33.9249, 18.4241],
  'Johannesburg': [-26.2041, 28.0473],
  'Dubai': [25.2048, 55.2708],
  'Abu Dhabi': [24.4539, 54.3773],
  'Bangkok': [13.7563, 100.5018],
  'Chiang Mai': [18.7883, 98.9853],
  'Phuket': [7.8804, 98.3923],
  'Koh Samui': [9.5120, 100.0136],
  'Seminyak': [-8.6905, 115.1609],
  'Ubud': [-8.5069, 115.2625],
  'Canggu': [-8.6478, 115.1385],
  'Nusa Penida': [-8.7278, 115.5444],
  'Delhi': [28.7041, 77.1025],
  'Mumbai': [19.0760, 72.8777],
  'Rajasthan': [27.0238, 74.2179],
  'Kerala': [10.8505, 76.2711],
  'Goa': [15.2993, 74.1240],
  'Siem Reap': [13.3671, 103.8448],
  'Phnom Penh': [11.5564, 104.9282],
  'Colombo': [6.9271, 79.8612],
  'Kandy': [7.2906, 80.6337],
  'Galle': [6.0535, 80.2210],
  'Kathmandu': [27.7172, 85.3240],
  'Pokhara': [28.2096, 83.9856],
  'Manila': [14.5995, 120.9842],
  'Palawan': [9.8349, 118.7384],
  'Cebu': [10.3157, 123.8854],
  'New York': [40.7128, -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'Miami': [25.7617, -80.1918],
  'Chicago': [41.8781, -87.6298],
  "L'Avana": [23.1136, -82.3666],
  'Trinidad': [21.8048, -79.9839],
  'Varadero': [23.1508, -81.2516],
  'Bogotà': [4.7110, -74.0721],
  'Medellín': [6.2442, -75.5812],
  'Cartagena': [10.3910, -75.4794],
  'Lima': [-12.0464, -77.0428],
  'Cusco': [-13.5320, -71.9675],
  'Buenos Aires': [-34.6037, -58.3816],
  'Patagonia': [-51.6230, -69.2168],
  'Mendoza': [-32.8908, -68.8272],
  'Rio de Janeiro': [-22.9068, -43.1729],
  'São Paulo': [-23.5505, -46.6333],
  'Salvador': [-12.9714, -38.5014],
  'San José': [9.9281, -84.0907],
  'Sydney': [-33.8688, 151.2093],
  'Melbourne': [-37.8136, 144.9631],
  'Cairns': [-16.9186, 145.7781],
  'Auckland': [-36.8485, 174.7633],
  'Queenstown': [-45.0312, 168.6626],
  'Christchurch': [-43.5321, 172.6362],
}

interface Props {
  cities: string[]
  groups: WhatsAppGroup[]
  countryName: string
  center: [number, number]
  zoom: number
  destinationSlug: string
}

export default function DestinationMap({ cities, groups, countryName, center, zoom, destinationSlug }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Distruggi istanza precedente (fix Fast Refresh)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      // Tile CartoDB — nomi in inglese, stile pulito
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map

      const waIcon = L.divIcon({
        html: `<div style="background:#25D366;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:14px">🌍</div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const cityIcon = L.divIcon({
        html: `<div style="background:#1f2937;width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
        className: '',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      })

      cities.forEach(city => {
        const coords = CITY_COORDS[city]
        if (!coords) return

        const cityGroups = groups
          .filter(g => g.city?.toLowerCase().trim() === city.toLowerCase().trim() && g.is_active)
          .sort((a, b) => b.member_count - a.member_count)
          .slice(0, 3)

        const icon = cityGroups.length > 0 ? waIcon : cityIcon
        const marker = L.marker(coords, { icon }).addTo(map)

        let popupContent = `<div style="min-width:200px;font-family:'DM Sans',sans-serif">`
        popupContent += `<div style="font-weight:600;font-size:14px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #f0f0f0">${city}</div>`

        if (cityGroups.length > 0) {
          cityGroups.forEach(g => {
            popupContent += `
              <div style="margin-bottom:8px">
                <div style="font-size:12px;font-weight:500;margin-bottom:4px">${g.name}</div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:11px;color:#9ca3af">${formatMemberCount(g.member_count)}</span>
                  <a href="${g.whatsapp_url}" target="_blank" rel="noopener noreferrer"
                    style="background:#25D366;color:white;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;text-decoration:none">
                    Entra
                  </a>
                </div>
              </div>`
          })
          const allCityGroups = groups.filter(g => g.city?.toLowerCase().trim() === city.toLowerCase().trim() && g.is_active)
          if (allCityGroups.length > 3) {
            popupContent += `<div style="font-size:11px;color:#9ca3af;margin-top:4px">+${allCityGroups.length - 3} altri gruppi nella pagina</div>`
          }
        } else {
          popupContent += `<div style="font-size:12px;color:#9ca3af">Nessun gruppo ancora.<br><a href="/destinazioni/${destinationSlug}/proponi-gruppo" style="color:#1f2937;font-weight:500">Proponi il primo →</a></div>`
        }

        popupContent += '</div>'
        marker.bindPopup(popupContent, { maxWidth: 260 })
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [cities, groups, center, zoom, destinationSlug])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div
        ref={mapRef}
        className="w-full h-64 rounded-xl overflow-hidden border border-gray-100"
        style={{ zIndex: 0 }}
      />
    </>
  )
}
