import Link from 'next/link'
import { destinations, tips } from '@/lib/data'
import TipCard from '@/components/TipCard'

const stats = [
  { num: '12k+', label: 'Viaggiatori iscritti' },
  { num: '340',  label: 'Gruppi WhatsApp attivi' },
  { num: '89',   label: 'Paesi coperti' },
  { num: '8.4k', label: 'Consigli condivisi' },
]

export default function HomePage() {
  const trending = destinations.filter(d => d.is_trending).slice(0, 3)
  const recentTips = tips.slice(0, 4)

  return (
    <div className="max-w-5xl mx-auto px-6">

      {/* Hero */}
      <section className="py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
            Community italiana di viaggiatori
          </p>
          <h1 className="font-display font-semibold text-5xl leading-tight mb-5">
            Viaggia{' '}
            <span className="italic font-normal text-gray-400">meglio</span>
            ,<br />insieme.
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-sm">
            Consigli veri da chi c&apos;è stato. Gruppi WhatsApp attivi per ogni destinazione.
            Niente agenzie, solo esperienze reali.
          </p>
          <div className="flex gap-3">
            <Link
              href="/destinazioni"
              className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Trova il tuo gruppo →
            </Link>
            <Link
              href="/consigli"
              className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Sfoglia i consigli
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ num, label }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-5">
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
              className="border border-gray-100 rounded-xl p-5 hover:border-gray-300 transition-colors group"
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
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <span className="text-xs text-gray-500">
                  {dest.groups.filter(g => g.is_active).length} gruppi attivi ·{' '}
                  {dest.groups.reduce((s, g) => s + g.member_count, 0)} membri
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
      <section className="bg-gray-50 rounded-2xl p-8 mb-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-display font-semibold text-xl mb-2">
            Sei appena tornato da un viaggio?
          </h3>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            Condividi i tuoi consigli e aiuta altri italiani a viaggiare meglio.
            Ogni tip utile guadagna punti community.
          </p>
        </div>
        <Link
          href="/consigli/nuovo"
          className="flex-shrink-0 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Condividi un consiglio →
        </Link>
      </section>

    </div>
  )
}
