'use client'

import Link from 'next/link'
import { Destination } from '@/lib/types'
import WhatsAppIcon from './WhatsAppIcon'

export default function DestCardHover({ dest }: { dest: Destination }) {
  return (
    <Link
      href={`/destinazioni/${dest.slug}`}
      className="block"
      style={{
        background: 'white',
        border: '1px solid #DDE4D0',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 12px 32px rgba(90,122,53,0.18), 0 4px 12px rgba(90,122,53,0.1)'
        const bar = el.querySelector('.dest-top-bar') as HTMLElement
        if (bar) bar.style.height = '6px'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        const bar = el.querySelector('.dest-top-bar') as HTMLElement
        if (bar) bar.style.height = '3px'
      }}
    >
      <div className="dest-top-bar" style={{ height: 3, background: '#5A7A35', transition: 'height 0.25s ease' }} />
      <div style={{ padding: '14px' }}>
        <div className="flex justify-between items-start mb-2">
          <span style={{ fontSize: 30 }}>{dest.flag_emoji}</span>
          {dest.is_trending && (
            <span style={{ background: '#FEF9C3', color: '#854D0E', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>🔥 Trending</span>
          )}
          {dest.is_emerging && (
            <span style={{ background: '#EEF2E6', color: '#4A5E2F', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>✦ Emergente</span>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2010', marginBottom: 2 }}>{dest.name}</div>
        <div style={{ fontSize: 11, color: '#7A8F6A', marginBottom: 8 }}>{dest.cities.join(' · ')}</div>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {dest.tags.map(tag => (
            <span key={tag} style={{ background: '#EEF2E6', color: '#4A5E2F', fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>{tag}</span>
          ))}
        </div>
        <div className="flex justify-between items-center" style={{ paddingTop: 10, borderTop: '1px solid #EEF2E6' }}>
          <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: '#7A8F6A' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', display: 'inline-block' }} />
            {dest.groups.filter(g => g.is_active).length} gruppi attivi
          </div>
          <span className="inline-flex items-center gap-1.5" style={{ background: '#25D366', color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 20 }}>
            <WhatsAppIcon size={12} />
            Entra
          </span>
        </div>
      </div>
    </Link>
  )
}
