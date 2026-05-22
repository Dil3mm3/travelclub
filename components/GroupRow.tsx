import { WhatsAppGroup } from '@/lib/types'

interface Props {
  group: WhatsAppGroup
}

export default function GroupRow({ group }: Props) {
  const isFull = group.member_count >= group.max_members
  const percentage = Math.round((group.member_count / group.max_members) * 100)

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${isFull ? 'bg-red-400' : 'bg-green-400'}`} />
          <div className="min-w-0">
            <div className="text-sm font-medium leading-tight">{group.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {group.member_count.toLocaleString()} / {group.max_members.toLocaleString()} membri
            </div>
          </div>
        </div>

        {!isFull ? (
          <a
            href={group.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            Entra
          </a>
        ) : (
          <span className="flex-shrink-0 text-xs px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg">
            Pieno
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="ml-4">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isFull ? 'bg-red-300' : 'bg-green-300'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
