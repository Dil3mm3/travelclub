'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'

export default function AuthButton() {
  const { user, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMenuOpen(false)
    window.location.href = '/'
  }

  if (loading) return <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />

  if (!user) {
    return (
      <Link
        href="/accedi"
        className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >
        Accedi
      </Link>
    )
  }

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0].toUpperCase() ?? '?'

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(v => !v)}
        className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors"
      >
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={initials}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : null}
        <span className={user.user_metadata?.avatar_url ? 'sr-only' : ''}>{initials}</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-10 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-700 truncate">
              {user.user_metadata?.full_name ?? user.email}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Settings size={14} />
              Pannello admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={14} />
            Esci
          </button>
        </div>
      )}
    </div>
  )
}
