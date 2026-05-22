import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 text-center">
      <p className="font-display text-6xl font-semibold mb-4">404</p>
      <h1 className="font-display text-2xl font-semibold mb-3">Pagina non trovata</h1>
      <p className="text-gray-400 text-sm mb-8">
        Questa destinazione non esiste ancora... o forse l&apos;hai già visitata?
      </p>
      <Link
        href="/"
        className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Torna alla homepage →
      </Link>
    </div>
  )
}
