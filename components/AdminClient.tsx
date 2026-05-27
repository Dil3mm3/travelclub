'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { CheckCircle, XCircle, Clock, Users, MessageSquare } from 'lucide-react'
import clsx from 'clsx'

interface GroupSubmission {
  id: string
  destination_slug: string
  destination_name: string
  group_name: string
  whatsapp_url: string
  submitter_note: string | null
  status: string
  created_at: string
}

interface TipSubmission {
  id: string
  destination_slug: string
  destination_name: string
  flag_emoji: string
  author_name: string
  content: string
  tags: string[]
  category: string
  status: string
  created_at: string
}

interface Props {
  groupSubmissions: GroupSubmission[]
  tipSubmissions: TipSubmission[]
}

type Tab = 'gruppi' | 'consigli'

export default function AdminClient({ groupSubmissions, tipSubmissions }: Props) {
  const [tab, setTab] = useState<Tab>('gruppi')
  const [groups, setGroups] = useState(groupSubmissions)
  const [tips, setTips] = useState(tipSubmissions)
  const [processing, setProcessing] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const pendingGroups = groups.filter(g => g.status === 'pending')
  const pendingTips = tips.filter(t => t.status === 'pending')

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  // Approva gruppo — lo inserisce in whatsapp_groups
  const approveGroup = async (sub: GroupSubmission) => {
    setProcessing(sub.id)
    const supabase = createClient()

    // Trova destination_id
    const { data: dest } = await supabase
      .from('destinations')
      .select('id')
      .eq('slug', sub.destination_slug)
      .single()

    if (!dest) { setProcessing(null); showMessage('Destinazione non trovata'); return }

    const { error: insertError } = await supabase.from('whatsapp_groups').insert({
      destination_id: dest.id,
      name: sub.group_name,
      whatsapp_url: sub.whatsapp_url,
      member_count: 0,
      max_members: 1024,
      is_active: true,
    })

    if (insertError) { setProcessing(null); showMessage('Errore: ' + insertError.message); return }

    await supabase.from('group_submissions').update({ status: 'approved' }).eq('id', sub.id)
    setGroups(prev => prev.map(g => g.id === sub.id ? { ...g, status: 'approved' } : g))
    setProcessing(null)
    showMessage(`✅ Gruppo "${sub.group_name}" approvato!`)
  }

  // Rifiuta gruppo
  const rejectGroup = async (sub: GroupSubmission) => {
    setProcessing(sub.id)
    const supabase = createClient()
    await supabase.from('group_submissions').update({ status: 'rejected' }).eq('id', sub.id)
    setGroups(prev => prev.map(g => g.id === sub.id ? { ...g, status: 'rejected' } : g))
    setProcessing(null)
    showMessage(`❌ Gruppo rifiutato.`)
  }

  // Approva consiglio — lo inserisce in tips
  const approveTip = async (sub: TipSubmission) => {
    setProcessing(sub.id)
    const supabase = createClient()

    const { error: insertError } = await supabase.from('tips').insert({
      destination_slug: sub.destination_slug,
      destination_name: sub.destination_name,
      flag_emoji: sub.flag_emoji,
      author_initials: sub.author_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      author_name: sub.author_name,
      weeks_ago: 0,
      content: sub.content,
      tags: sub.tags,
      likes: 0,
      category: sub.category,
    })

    if (insertError) { setProcessing(null); showMessage('Errore: ' + insertError.message); return }

    await supabase.from('tip_submissions').update({ status: 'approved' }).eq('id', sub.id)
    setTips(prev => prev.map(t => t.id === sub.id ? { ...t, status: 'approved' } : t))
    setProcessing(null)
    showMessage(`✅ Consiglio di ${sub.author_name} approvato!`)
  }

  // Rifiuta consiglio
  const rejectTip = async (sub: TipSubmission) => {
    setProcessing(sub.id)
    const supabase = createClient()
    await supabase.from('tip_submissions').update({ status: 'rejected' }).eq('id', sub.id)
    setTips(prev => prev.map(t => t.id === sub.id ? { ...t, status: 'rejected' } : t))
    setProcessing(null)
    showMessage(`❌ Consiglio rifiutato.`)
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })

  const statusBadge = (status: string) => {
    if (status === 'approved') return <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Approvato</span>
    if (status === 'rejected') return <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Rifiutato</span>
    return <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={10} />In attesa</span>
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-semibold text-3xl mb-1">Pannello admin</h1>
        <p className="text-sm text-gray-500">Approva o rifiuta le proposte della community.</p>
      </div>

      {/* Messaggio feedback */}
      {message && (
        <div className="mb-6 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-gray-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Gruppi in attesa</span>
          </div>
          <div className="font-display font-semibold text-3xl">{pendingGroups.length}</div>
        </div>
        <div className="border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={16} className="text-gray-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Consigli in attesa</span>
          </div>
          <div className="font-display font-semibold text-3xl">{pendingTips.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('gruppi')}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
            tab === 'gruppi' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
          )}
        >
          Gruppi WhatsApp {pendingGroups.length > 0 && <span className="ml-1.5 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingGroups.length}</span>}
        </button>
        <button
          onClick={() => setTab('consigli')}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
            tab === 'consigli' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
          )}
        >
          Consigli {pendingTips.length > 0 && <span className="ml-1.5 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingTips.length}</span>}
        </button>
      </div>

      {/* Gruppi */}
      {tab === 'gruppi' && (
        <div className="space-y-4">
          {groups.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">Nessuna proposta di gruppo ricevuta.</div>
          )}
          {groups.map(sub => (
            <div key={sub.id} className={clsx(
              'border rounded-xl p-5 transition-colors',
              sub.status === 'pending' ? 'border-gray-200' : 'border-gray-100 opacity-60'
            )}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {statusBadge(sub.status)}
                    <span className="text-xs text-gray-400">{formatDate(sub.created_at)}</span>
                  </div>
                  <div className="font-medium text-sm mb-1">{sub.group_name}</div>
                  <div className="text-xs text-gray-400 mb-2">
                    📍 {sub.destination_name}
                  </div>
                  <a
                    href={sub.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline break-all"
                  >
                    {sub.whatsapp_url}
                  </a>
                  {sub.submitter_note && (
                    <p className="text-xs text-gray-500 mt-2 italic">"{sub.submitter_note}"</p>
                  )}
                </div>

                {sub.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => approveGroup(sub)}
                      disabled={processing === sub.id}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={14} />
                      Approva
                    </button>
                    <button
                      onClick={() => rejectGroup(sub)}
                      disabled={processing === sub.id}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Rifiuta
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consigli */}
      {tab === 'consigli' && (
        <div className="space-y-4">
          {tips.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">Nessun consiglio ricevuto.</div>
          )}
          {tips.map(sub => (
            <div key={sub.id} className={clsx(
              'border rounded-xl p-5 transition-colors',
              sub.status === 'pending' ? 'border-gray-200' : 'border-gray-100 opacity-60'
            )}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {statusBadge(sub.status)}
                    <span className="text-xs text-gray-400">{formatDate(sub.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{sub.flag_emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{sub.destination_name}</span>
                    <span className="text-xs text-gray-400">· {sub.author_name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{sub.category}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{sub.content}</p>
                  {sub.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {sub.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {sub.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => approveTip(sub)}
                      disabled={processing === sub.id}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={14} />
                      Approva
                    </button>
                    <button
                      onClick={() => rejectTip(sub)}
                      disabled={processing === sub.id}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Rifiuta
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
