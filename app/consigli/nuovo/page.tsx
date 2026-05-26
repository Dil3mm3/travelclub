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
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
          Community
        </p>
        <h1 className="font-display font-semibold text-2xl mb-2">
          Condividi un consiglio
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Un tip specifico vale più di mille guide generiche. Scrivi qualcosa che avresti
          voluto sapere prima di partire.
        </p>
      </div>
      <NuovoConsigliForm destinations={destinations} />
    </div>
  )
}
