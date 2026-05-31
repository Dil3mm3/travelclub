import NuovoConsigliForm from '@/components/NuovoConsigliForm'
import { getDestinations } from '@/lib/data'

export const revalidate = 0

export const metadata = {
  title: 'Condividi un consiglio — travelclub',
  description: 'Condividi un consiglio di viaggio con la community italiana.',
}

export default async function NuovoConsigliPage() {
  const destinations = await getDestinations()
  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8C468', marginBottom: 8 }}>
          Community
        </p>
        <h1 className="font-display font-semibold" style={{ fontSize: 28, color: '#1A2010', marginBottom: 8, lineHeight: 1.1 }}>
          Condividi un consiglio
        </h1>
        <p style={{ fontSize: 13, color: '#7A8F6A', lineHeight: 1.6 }}>
          Un tip specifico vale più di mille guide generiche. Scrivi qualcosa che avresti
          voluto sapere prima di partire.
        </p>
      </div>
      <NuovoConsigliForm destinations={destinations} />
    </div>
  )
}
