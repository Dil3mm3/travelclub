import Link from 'next/link'
import { getDestinations, getTips } from '@/lib/data'
import TipCard from '@/components/TipCard'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import { MapPin, Users, MessageCircle, Star } from 'lucide-react'

export const revalidate = 0

const stats = [
  { num: '12k+', label: 'Viaggiatori iscritti',    icon: <Users size={18} className="text-blue-500" /> },
  { num: '340',  label: 'Gruppi WhatsApp attivi',  icon: <span className="text-[#25D366]"><WhatsAppIcon size={18} /></span> },
  { num: '89',   label: 'Paesi coperti',           icon: <MapPin size={18} className="text-orange-500" /> },
  { num: '8.4k', label: 'Consigli condivisi',      icon: <Star size={18} className="text-yellow-500" /> },
]

export default async function HomePage() {
  const destinations = await getDestinations()
  const tips = await getTips()

  const trending = destinations.filter(d => d.is_trending).slice(0, 3)
  const recentTips = tips.slice(0, 4)

  return (
    <div className="max-w-5xl mx-auto px-6">

      {/* Hero */}
      <section className="py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <WhatsAppIcon size={13} />
            340 gruppi WhatsApp attivi
          </div>
          <h1 className="font-display font-semibold text-5xl leading-tight mb-5">
            Viaggia{' '}
            <span className="italic font-normal text-gray-400">meglio</span>
            ,<br />insieme.
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-sm">
            Consigli veri da chi c&apos;è stato. Gruppi WhatsApp attivi per ogni destinazione.
            Niente agenzie, solo esperienze reali.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/destinazioni"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1ebe5d] transition-colors shadow-sm"
            >
              <WhatsAppIcon size={15} />
              Trova il tuo gruppo
            </Link>
            <Link
              href="/consigli"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <MessageCircle size={15} />
              Sfoglia i consigli
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ num, label, icon }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-5">
              <div className="mb-2">{icon}</div>
              <div className="font-display font-semibold text-3xl mb-1">{num}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Destinazioni trending */}
      <section className="py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-display font-semibold text-2xl mb-1">Destinazioni di tendenza</h2>
            <p className="text-sm text-gray-500">Dove stanno andando gli italiani in questo momento</p>
          </div>
          <Link href="/destinazioni" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Vedi tutte →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trending.map(dest => (
            <Link
              key={dest.id}
              href={`/destinazioni/${dest.slug}`}
              className="border border-gray-100 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="text-3xl mb-3">{dest.flag_emoji}</div>
              <div className="font-medium text-base mb-1">{dest.name}</div>
              <div className="text-xs text-gray-400 mb-3">{dest.cities.join(' · ')}</div>
              <div className="flex gap-1.5 flex-wrap mb-4">
                {dest.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {dest.groups.filter(g => g.is_active).length} gruppi ·{' '}
                  {dest.groups.reduce((s, g) => s + g.member_count, 0)} membri
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-[#25D366] text-white rounded-lg group-hover:bg-[#1ebe5d] transition-colors shadow-sm">
                  <WhatsAppIcon size={12} />
                  Entra
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Consigli recenti */}
      <section className="py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-display font-semibold text-2xl mb-1">Consigli recenti dalla community</h2>
            <p className="text-sm text-gray-500">Tip verificati da chi è appena tornato</p>
          </div>
          <Link href="/consigli" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Vedi tutti →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentTips.map(tip => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 rounded-2xl p-8 mb-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-display font-semibold text-xl text-white mb-2">
            Sei appena tornato da un viaggio?
          </h3>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Condividi i tuoi consigli e aiuta altri italiani a viaggiare meglio.
            Ogni tip utile guadagna punti community.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link
            href="/consigli/nuovo"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <Star size={15} />
            Condividi un consiglio
          </Link>
        </div>
      </section>

    </div>
  )
}
