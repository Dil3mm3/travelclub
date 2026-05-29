import { Tip } from '@/lib/types'
import { Heart } from 'lucide-react'

const avatarColors: Record<string, { bg: string; color: string }> = {
  MR: { bg: '#EEF2E6', color: '#4A5E2F' },
  SF: { bg: '#EEF2E6', color: '#5A7A35' },
  LB: { bg: '#FEF9C3', color: '#854D0E' },
  AG: { bg: '#EEF2E6', color: '#4A5E2F' },
}

export default function TipCard({ tip }: { tip: Tip }) {
  const avatar = avatarColors[tip.author_initials] ?? { bg: '#EEF2E6', color: '#4A5E2F' }
  const weeksLabel = tip.weeks_ago === 1 ? '1 settimana fa' : `${tip.weeks_ago} settimane fa`

  return (
    <div style={{ background: 'white', border: '1px solid #DDE4D0', borderRadius: 14, padding: 16 }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 34, height: 34, background: avatar.bg, color: avatar.color, fontSize: 12, fontWeight: 700 }}>
          {tip.author_initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2010' }}>{tip.author_name}</div>
          <div style={{ fontSize: 11, color: '#7A8F6A' }}>
            {tip.flag_emoji} {tip.destination_name} · {weeksLabel}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#3A4A2A', lineHeight: 1.65, marginBottom: 12 }}>{tip.content}</p>
      <div className="flex justify-between items-center">
        <div className="flex gap-1.5 flex-wrap">
          {tip.tags.map(tag => (
            <span key={tag} style={{ background: '#EEF2E6', color: '#4A5E2F', fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1" style={{ fontSize: 11, color: '#7A8F6A' }}>
          <Heart size={12} />
          {tip.likes}
        </div>
      </div>
    </div>
  )
}
