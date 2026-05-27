import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'travelclub — community italiana di viaggiatori',
  description: 'Consigli di viaggio e gruppi WhatsApp per destinazione. La community degli italiani che viaggiano.',
  openGraph: {
    title: 'travelclub',
    description: 'Consigli di viaggio e gruppi WhatsApp per destinazione.',
    siteName: 'travelclub',
    locale: 'it_IT',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="bg-white text-gray-900 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-gray-100 mt-20 py-10 px-6">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <span className="font-display font-semibold text-lg">
                travelcl<span className="italic text-gray-400">ub</span>
              </span>
              <div className="flex items-center gap-6">
                <a href="/regole" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Regole</a>
                <a href="/destinazioni" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Destinazioni</a>
                <a href="mailto:posta@travelclub.it" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Contatti</a>
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} travelclub
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
