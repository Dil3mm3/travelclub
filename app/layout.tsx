import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'travelclub — il club degli italiani che viaggiano',
  description: 'Consigli di viaggio e gruppi WhatsApp per destinazione. La community degli italiani che viaggiano.',
  openGraph: {
    title: 'travelclub',
    description: 'Il club degli italiani che viaggiano.',
    siteName: 'travelclub',
    locale: 'it_IT',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="min-h-screen" style={{ background: '#F8F9F4', color: '#1A2010' }}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer style={{ background: '#1A2010' }} className="mt-20 py-10 px-6">
            <div className="max-w-5xl mx-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
              <div className="flex items-baseline gap-0.5">
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 18, color: 'white' }}>travel</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 18, color: '#A8C468' }}>club</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
                <a href="/regole" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }} className="hover:text-white transition-colors">Regole</a>
                <a href="/destinazioni" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }} className="hover:text-white transition-colors">Destinazioni</a>
                <a href="mailto:ciao@travelclub.it" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }} className="hover:text-white transition-colors">Contatti</a>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© {new Date().getFullYear()} travelclub</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
