import { getDestinations } from '@/lib/data'
import DestinazioniClient from '@/components/DestinazioniClient'

export default async function DestinazioniPage() {
  const destinations = await getDestinations()
  return <DestinazioniClient destinations={destinations} />
}
