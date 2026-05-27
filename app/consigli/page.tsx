import { getTips, getDestinations } from '@/lib/data'
import ConsigliClient from '@/components/ConsigliClient'

export const revalidate = 0

export default async function ConsigliPage() {
  const [tips, destinations] = await Promise.all([getTips(), getDestinations()])
  return <ConsigliClient tips={tips} destinations={destinations} />
}
