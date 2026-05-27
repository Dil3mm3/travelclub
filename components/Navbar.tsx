'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Menu, X, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import AuthButton from './AuthButton'

const continents = [
  {
    label: 'Europa', emoji: '🇪🇺',
    destinations: [
      { name: 'Spagna', slug: 'spagna', emoji: '🇪🇸' },
      { name: 'Grecia', slug: 'grecia', emoji: '🇬🇷' },
      { name: 'Francia', slug: 'francia', emoji: '🇫🇷' },
      { name: 'Portogallo', slug: 'portogallo', emoji: '🇵🇹' },
      { name: 'Albania', slug: 'albania', emoji: '🇦🇱' },
      { name: 'Croazia', slug: 'croazia', emoji: '🇭🇷' },
      { name: 'Turchia', slug: 'turchia', emoji: '🇹🇷' },
      { name: 'Georgia', slug: 'georgia', emoji: '🇬🇪' },
      { name: 'Islanda', slug: 'islanda', emoji: '🇮🇸' },
      { name: 'Norvegia', slug: 'norvegia', emoji: '🇳🇴' },
    ],
  },
  {
    label: 'Asia', emoji: '🌏',
    destinations: [
      { name: 'Giappone', slug: 'giappone', emoji: '🇯🇵' },
      { name: 'Vietnam', slug: 'vietnam', emoji: '🇻🇳' },
      { name: 'Tailandia', slug: 'tailandia', emoji: '🇹🇭' },
      { name: 'Bali', slug: 'bali', emoji: '🇮🇩' },
      { name: 'India', slug: 'india', emoji: '🇮🇳' },
      { name: 'Cambogia', slug: 'cambogia', emoji: '🇰🇭' },
      { name: 'Sri Lanka', slug: 'sri-lanka', emoji: '🇱🇰' },
      { name: 'Nepal', slug: 'nepal', emoji: '🇳🇵' },
      { name: 'Filippine', slug: 'filippine', emoji: '🇵🇭' },
    ],
  },
  {
    label: 'Africa & ME', emoji: '🌍',
    destinations: [
      { name: 'Marocco', slug: 'marocco', emoji: '🇲🇦' },
      { name: 'Egitto', slug: 'egitto', emoji: '🇪🇬' },
      { name: 'Tunisia', slug: 'tunisia', emoji: '🇹🇳' },
      { name: 'Tanzania', slug: 'tanzania', emoji: '🇹🇿' },
      { name: 'Kenya', slug: 'kenya', emoji: '🇰🇪' },
      { name: 'Sud Africa', slug: 'sud-africa', emoji: '🇿🇦' },
      { name: 'Emirati', slug: 'emirati', emoji: '🇦🇪' },
    ],
  },
  {
    label: 'Americhe', emoji: '🌎',
    destinations: [
      { name: 'Messico', slug: 'messico', emoji: '🇲🇽' },
      { name: 'USA', slug: 'usa', emoji: '🇺🇸' },
      { name: 'Colombia', slug: 'colombia', emoji: '🇨🇴' },
      { name: 'Perù', slug: 'peru', emoji: '🇵🇪' },
      { name: 'Argentina', slug: 'argentina', emoji: '🇦🇷' },
      { name: 'Brasile', slug: 'brasile', emoji: '🇧🇷' },
      { name: 'Cuba', slug: 'cuba', emoji: '🇨🇺' },
      { name: 'Costa Rica', slug: 'costarica', emoji: '🇨🇷' },
    ],
  },
  {
    label: 'Oceania', emoji: '🌊',
    destinations: [
      { name: 'Australia', slug: 'australia', emoji: '🇦🇺' },
      { name: 'Nuova Zelanda', slug: 'nuova-zelanda', emoji: '🇳🇿' },
    ],
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedContinent, setExpandedContinent] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Chiudi menu desktop cliccando fuori
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDesktopMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Chiudi menu al cambio pagina
  useEffect(() => {
    setDesktopMenuOpen(false)
    setMobileMenuOpen(false)
    setExpandedContinent(null)
  }, [pathname])

  // Blocca scroll quando menu mobile è aperto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display font-semibold text-xl tracking-tight">
            travelcl<span className="italic text-gray-400">ub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative" ref={menuRef}>
              <div className="flex items-center gap-0.5">
                <Link
                  href="/destinazioni"
                  className={clsx('text-sm transition-colors', pathname.startsWith('/destinazioni') ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900')}
                >
                  Destinazioni
                </Link>
                <button
                  onClick={() => setDesktopMenuOpen(v => !v)}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <ChevronDown size={14} className={clsx('transition-transform', desktopMenuOpen && 'rotate-180')} />
                </button>
              </div>

              {desktopMenuOpen && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[680px] bg-white border border-gray-100 rounded-2xl shadow-xl p-6 grid grid-cols-3 gap-6 z-[9999]">
                  {continents.map(continent => (
                    <div key={continent.label}>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-base">{continent.emoji}</span>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{continent.label}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {continent.destinations.map(dest => (
                          <li key={dest.slug}>
                            <Link href={`/destinazioni/${dest.slug}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-0.5">
                              <span>{dest.emoji}</span>{dest.name}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href="/destinazioni" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Vedi tutti →</Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                  <div className="col-span-3 pt-4 border-t border-gray-100 flex justify-end">
                    <Link href="/destinazioni" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                      Vedi tutte le destinazioni →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/consigli"
              className={clsx('text-sm transition-colors', pathname.startsWith('/consigli') ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900')}
            >
              Consigli
            </Link>

            <AuthButton />
          </div>

          {/* Mobile: avatar + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <AuthButton />
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden overflow-y-auto" style={{ top: '56px' }}>
          <div className="px-6 py-4 border-b border-gray-100 flex gap-4">
            <Link href="/destinazioni" className="flex-1 text-center py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg">
              Tutte le destinazioni
            </Link>
            <Link href="/consigli" className="flex-1 text-center py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700">
              Consigli
            </Link>
          </div>

          <div className="px-6 py-2">
            {continents.map(continent => (
              <div key={continent.label} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => setExpandedContinent(expandedContinent === continent.label ? null : continent.label)}
                  className="w-full flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{continent.emoji}</span>
                    <span className="font-medium text-sm">{continent.label}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={clsx('text-gray-400 transition-transform', expandedContinent === continent.label && 'rotate-90')}
                  />
                </button>

                {expandedContinent === continent.label && (
                  <div className="pb-4 grid grid-cols-2 gap-2">
                    {continent.destinations.map(dest => (
                      <Link
                        key={dest.slug}
                        href={`/destinazioni/${dest.slug}`}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                      >
                        <span>{dest.emoji}</span>{dest.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
