'use client'

import { useState } from 'react'
import { WhatsAppGroup } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import WhatsAppIcon from './WhatsAppIcon'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { formatMemberCount } from '@/lib/utils'

interface Props {
  group: WhatsAppGroup
  destinationName: string
}

export default function GroupRow({ group, destinationName }: Props) {
  const isFull = group.member_count >= group.max_members
  const percentage = Math.round((group.member_count / group.max_members) * 100)
  const [reported, setReported] = useState(false)
  const [reporting, setReporting] = useState(false)

  const handleReport = async () => {
    if (reported || reporting) return
    setReporting(true)
    const supabase = createClient()
    await supabase.from('link_reports').insert({
      group_id: group.id,
      group_name: group.name,
      destination_name: destinationName,
    })
    setReported(true)
    setReporting(false)
  }

  return (
    <div style={{ padding: '14px 20px' }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="flex-shrink-0" style={{
            width: 8, height: 8, borderRadius: '50%', marginTop: 6,
            background: !group.is_active ? '#9CA3AF' : isFull ? '#EF4444' : '#25D366',
          }} />
          <div className="min-w-0">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2010', lineHeight: 1.3 }}>{group.name}</div>
            <div style={{ fontSize: 11, color: '#7A8F6A', marginTop: 2 }}>{formatMemberCount(group.member_count)}</div>
          </div>
        </div>

        {!group.is_active ? (
          <span style={{ fontSize: 11, padding: '5px 12px', background: '#F3F4F6', color: '#9CA3AF', borderRadius: 20, flexShrink: 0, cursor: 'not-allowed' }}
            title="Gruppo momentaneamente disattivato">
            Non disponibile
          </span>
        ) : !isFull ? (
          <a href={group.whatsapp_url} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 font-semibold transition-colors"
            style={{ fontSize: 12, padding: '6px 12px', background: '#25D366', color: 'white', borderRadius: 20 }}>
            <WhatsAppIcon size={13} />
            Entra
          </a>
        ) : (
          <span style={{ fontSize: 11, padding: '5px 12px', background: '#F3F4F6', color: '#9CA3AF', borderRadius: 20, flexShrink: 0 }}>
            Pieno
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ marginLeft: 16, marginBottom: 8 }}>
        <div style={{ height: 3, background: '#EEF2E6', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${percentage}%`,
            background: isFull ? '#EF4444' : !group.is_active ? '#E5E7EB' : '#25D366',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Segnala link */}
      {group.is_active && (
        <div style={{ marginLeft: 16 }}>
          {reported ? (
            <span className="flex items-center gap-1" style={{ fontSize: 11, color: '#5A7A35' }}>
              <CheckCircle size={11} />
              Segnalazione inviata, grazie!
            </span>
          ) : (
            <button onClick={handleReport} disabled={reporting}
              className="flex items-center gap-1 transition-colors"
              style={{ fontSize: 11, color: '#C4D4B0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <AlertTriangle size={11} />
              {reporting ? 'Invio...' : 'Segnala link WhatsApp non funzionante'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
