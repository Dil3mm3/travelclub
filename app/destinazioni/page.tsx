import { getDestinations } from '@/lib/data'
import DestinazioniClient from '@/components/DestinazioniClient'

export const revalidate = 0

export default async function DestinazioniPage() {
  const destinations = await getDestinations()
  return <DestinazioniClient destinations={destinations} />
}
