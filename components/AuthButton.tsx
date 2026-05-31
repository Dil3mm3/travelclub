'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import Image from 'next/image'
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

  if (loading) return <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: '#DDE4D0' }} />

  if (!user) {
    return (
      <Link
        href="/accedi"
        className="text-sm font-medium transition-colors"
        style={{ background: '#1A2010', color: 'white', padding: '6px 16px', borderRadius: 8 }}
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
        className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold transition-colors"
        style={{ background: '#1A2010', color: 'white' }}
      >
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt={initials}
            width={32}
            height={32}
            className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        ) : null}
        <span className={user.user_metadata?.avatar_url ? 'sr-only' : ''}>{initials}</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-10 w-52 rounded-xl shadow-lg py-1 z-50"
          style={{ background: 'white', border: '1px solid #DDE4D0' }}>
          <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #DDE4D0' }}>
            <p className="truncate" style={{ fontSize: 12, fontWeight: 600, color: '#1A2010' }}>
              {user.user_metadata?.full_name ?? user.email}
            </p>
            <p className="truncate" style={{ fontSize: 11, color: '#7A8F6A' }}>{user.email}</p>
          </div>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 transition-colors"
              style={{ fontSize: 13, color: '#5A6B4A' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0F4E8' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <Settings size={14} />
              Pannello admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 transition-colors"
            style={{ fontSize: 13, color: '#5A6B4A' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0F4E8' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <LogOut size={14} />
            Esci
          </button>
        </div>
      )}
    </div>
  )
}
