'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
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
    label: 'Africa', emoji: '🌍',
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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-semibold text-xl tracking-tight">
          travelcl<span className="italic text-gray-400">ub</span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Mega menu destinazioni */}
          <div className="relative" ref={menuRef}>
            <div className="flex items-center gap-0.5">
              <Link
                href="/destinazioni"
                className={clsx(
                  'text-sm transition-colors',
                  pathname.startsWith('/destinazioni')
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                Destinazioni
              </Link>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className={clsx(
                  'p-1 rounded transition-colors',
                  'text-gray-400 hover:text-gray-700'
                )}
              >
                <ChevronDown
                  size={14}
                  className={clsx('transition-transform', menuOpen && 'rotate-180')}
                />
              </button>
            </div>

            {menuOpen && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[680px] bg-white border border-gray-100 rounded-2xl shadow-xl p-6 grid grid-cols-3 gap-6 z-[9999]">
                {continents.map(continent => (
                  <div key={continent.label}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-base">{continent.emoji}</span>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {continent.label}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {continent.destinations.map(dest => (
                        <li key={dest.slug}>
                          <Link
                            href={`/destinazioni/${dest.slug}`}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-0.5"
                          >
                            <span>{dest.emoji}</span>
                            {dest.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={`/destinazioni#${continent.label.toLowerCase()}`}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Vedi tutti →
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}

                {/* Footer del menu */}
                <div className="col-span-3 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Sfoglia tutte le destinazioni per continente
                  </span>
                  <Link
                    href="/destinazioni"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Vedi tutte le destinazioni →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/consigli"
            className={clsx(
              'text-sm transition-colors',
              pathname.startsWith('/consigli')
                ? 'text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            Consigli
          </Link>

          <AuthButton />
        </div>
      </div>
    </nav>
  )
}
