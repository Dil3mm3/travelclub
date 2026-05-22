'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/destinazioni', label: 'Destinazioni' },
  { href: '/consigli', label: 'Consigli' },
  { href: '/community', label: 'Community' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-semibold text-xl tracking-tight">
          travelcl<span className="italic text-gray-400">ub</span>
        </Link>

        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/accedi"
            className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Accedi
          </Link>
        </div>
      </div>
    </nav>
  )
}
