import Link from 'next/link'
import { getDestinations, getTips, getSiteStats } from '@/lib/data'
import TipCard from '@/components/TipCard'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import DestCardHover from '@/components/DestCardHover'
import StatsHero from '@/components/StatsHero'

export const revalidate = 0

export default async function HomePage() {
  const [destinations, tips, stats] = await Promise.all([
    getDestinations(),
    getTips(),
    getSiteStats(),
  ])

  const trending = destinations.filter(d => d.is_trending).slice(0, 3)
  const recentTips = tips.slice(0, 4)

  return (
    <div>
      {/* HERO con foto mare + stats a destra */}
      <section className="relative" style={{ height: 580, overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=85')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(20,32,10,0.97) 0%, rgba(20,32,10,0.65) 50%, rgba(20,32,10,0.15) 100%)',
        }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-5xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8C468', marginBottom: 12 }}>
                il club degli italiani che viaggiano
              </p>
              <h1 className="font-display" style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, color: 'white', marginBottom: 12 }}>
                Viaggia{' '}
                <em style={{ fontStyle: 'italic', color: '#A8C468' }}>meglio</em>,<br />
                insieme.
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 24, maxWidth: 400 }}>
                Consigli veri da chi c&apos;è stato. Gruppi WhatsApp per ogni destinazione.
                Il tuo compagno di viaggio, sempre.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/destinazioni" className="inline-flex items-center gap-2 font-semibold transition-colors"
                  style={{ background: '#25D366', color: 'white', fontSize: 13, padding: '11px 22px', borderRadius: 24 }}>
                  <WhatsAppIcon size={15} />
                  Trova il tuo gruppo
                </Link>
                <Link href="/consigli" className="inline-flex items-center gap-2 font-medium transition-colors"
                  style={{ border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: 13, padding: '11px 22px', borderRadius: 24, background: 'transparent' }}>
                  Sfoglia i consigli
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <StatsHero
                activeGroups={stats.activeGroups}
                destinations={stats.destinations}
                totalMembers={stats.totalMembers}
                tips={stats.tips}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DESTINAZIONI TRENDING */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-display font-semibold" style={{ fontSize: 26, color: '#1A2010', marginBottom: 4 }}>
              Destinazioni di tendenza
            </h2>
            <p style={{ fontSize: 13, color: '#7A8F6A' }}>Dove stanno andando gli italiani in questo momento</p>
          </div>
          <Link href="/destinazioni" className="text-sm font-semibold transition-colors" style={{ color: '#5A7A35' }}>
            Vedi tutte →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {trending.map(dest => (
            <DestCardHover key={dest.id} dest={dest} />
          ))}
        </div>

        {/* FOTO COMMUNITY */}
        <div className="relative rounded-2xl overflow-hidden mb-4" style={{ height: 320 }}>
          <div className="absolute inset-0" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=85')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(20,32,10,0.88) 0%, rgba(20,32,10,0.35) 55%, rgba(20,32,10,0.1) 100%)',
          }} />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h3 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 8 }}>
              Non viaggi<br /><em style={{ fontStyle: 'italic', color: '#A8C468' }}>mai</em> da solo.
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: 16, maxWidth: 260 }}>
              Entra nel club e trova italiani che vanno dove vai tu.
            </p>
            <Link href="/destinazioni" className="font-bold transition-colors"
              style={{ background: '#A8C468', color: '#1A2010', fontSize: 12, padding: '9px 18px', borderRadius: 20, display: 'inline-block', width: 'fit-content' }}>
              Unisciti alla community
            </Link>
          </div>
        </div>
      </section>

      {/* DIVISORE */}
      <div style={{ height: 1, background: '#DDE4D0', margin: '0 24px' }} />

      {/* CONSIGLI */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-display font-semibold" style={{ fontSize: 26, color: '#1A2010', marginBottom: 4 }}>
              Dalla community
            </h2>
            <p style={{ fontSize: 13, color: '#7A8F6A' }}>Tip verificati da chi è appena tornato</p>
          </div>
          <Link href="/consigli" className="text-sm font-semibold" style={{ color: '#5A7A35' }}>
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
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ background: '#4A5E2F' }}>
          <div>
            <h3 className="font-display font-semibold" style={{ fontSize: 22, color: 'white', marginBottom: 6 }}>
              Sei appena tornato da un viaggio?
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 360 }}>
              Condividi i tuoi consigli e aiuta altri italiani a viaggiare meglio.
              La community ti aspetta.
            </p>
          </div>
          <Link href="/consigli/nuovo" className="font-bold flex-shrink-0 transition-colors"
            style={{ background: '#A8C468', color: '#1A2010', fontSize: 13, padding: '11px 22px', borderRadius: 24, whiteSpace: 'nowrap' }}>
            Condividi un consiglio →
          </Link>
        </div>
      </div>
    </div>
  )
}
