import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 text-center">
      <p className="font-display font-semibold mb-4" style={{ fontSize: 72, color: '#DDE4D0', lineHeight: 1 }}>404</p>
      <h1 className="font-display font-semibold mb-3" style={{ fontSize: 24, color: '#1A2010' }}>Pagina non trovata</h1>
      <p style={{ fontSize: 14, color: '#7A8F6A', marginBottom: 28 }}>
        Questa destinazione non esiste ancora... o forse l&apos;hai già visitata?
      </p>
      <Link
        href="/"
        className="inline-block font-medium transition-colors"
        style={{ background: '#1A2010', color: 'white', padding: '10px 24px', borderRadius: 10, fontSize: 13 }}
      >
        Torna alla homepage →
      </Link>
    </div>
  )
}
