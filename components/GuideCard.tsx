'use client'

import Link from 'next/link'
import { GuideMeta } from '@/lib/guides'

export default function GuideCard({ guide, destinationSlug }: { guide: GuideMeta; destinationSlug: string }) {
  return (
    <Link
      href={`/destinazioni/${destinationSlug}/guide/${guide.slug}`}
      className="block rounded-2xl p-5 transition-all"
      style={{ border: '1px solid #DDE4D0', background: 'white' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 8px 24px rgba(90,122,53,0.12)'
        el.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 10 }}>{guide.emoji}</div>
      <div className="font-display font-semibold" style={{ fontSize: 16, color: '#1A2010', marginBottom: 4 }}>
        {guide.city}
      </div>
      <p style={{ fontSize: 12, color: '#7A8F6A', lineHeight: 1.5, marginBottom: 12 }}>
        {guide.description}
      </p>
      <span style={{ fontSize: 12, color: '#5A7A35', fontWeight: 600 }}>
        Leggi la guida →
      </span>
    </Link>
  )
}
