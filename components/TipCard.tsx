import { Tip } from '@/lib/types'
import { Heart } from 'lucide-react'

const avatarColors: Record<string, string> = {
  MR: 'bg-teal-50 text-teal-700',
  SF: 'bg-purple-50 text-purple-700',
  LB: 'bg-orange-50 text-orange-700',
  AG: 'bg-blue-50 text-blue-700',
}

export default function TipCard({ tip }: { tip: Tip }) {
  const avatarColor = avatarColors[tip.author_initials] ?? 'bg-gray-100 text-gray-600'
  const weeksLabel = tip.weeks_ago === 1
    ? '1 settimana fa'
    : `${tip.weeks_ago} settimane fa`

  return (
    <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${avatarColor}`}>
          {tip.author_initials}
        </div>
        <div>
          <div className="text-sm font-medium">{tip.author_name}</div>
          <div className="text-xs text-gray-400">
            {tip.flag_emoji} {tip.destination_name} · {weeksLabel}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">{tip.content}</p>

      <div className="flex justify-between items-center">
        <div className="flex gap-1.5 flex-wrap">
          {tip.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Heart size={13} />
          {tip.likes}
        </div>
      </div>
    </div>
  )
}
