'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { CheckCircle, XCircle, Clock, Users, MessageSquare, Trash2, Edit2, X, Check } from 'lucide-react'
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

interface ActiveGroup {
  id: string
  destination_id: string
  name: string
  whatsapp_url: string
  member_count: number
  max_members: number
  is_active: boolean
  destination_name?: string
  destination_flag?: string
  report_count?: number
}

interface PublishedTip {
  id: string
  destination_slug: string
  destination_name: string
  flag_emoji: string
  author_name: string
  content: string
  tags: string[]
  category: string
  likes: number
  created_at: string
}

interface Props {
  groupSubmissions: GroupSubmission[]
  tipSubmissions: TipSubmission[]
  activeGroups: ActiveGroup[]
  publishedTips: PublishedTip[]
}

type Tab = 'attesa' | 'gruppi' | 'consigli'

export default function AdminClient({ groupSubmissions, tipSubmissions, activeGroups: initialGroups, publishedTips: initialTips }: Props) {
  const [tab, setTab] = useState<Tab>('attesa')
  const [groups, setGroups] = useState(groupSubmissions)
  const [tips, setTips] = useState(tipSubmissions)
  const [activeGroups, setActiveGroups] = useState(initialGroups)
  const [publishedTips, setPublishedTips] = useState(initialTips)
  const [processing, setProcessing] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const [editGroupUrl, setEditGroupUrl] = useState('')

  const pendingGroups = groups.filter(g => g.status === 'pending')
  const pendingTips = tips.filter(t => t.status === 'pending')

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  // --- SUBMISSIONS ---
  const approveGroup = async (sub: GroupSubmission) => {
    setProcessing(sub.id)
    const supabase = createClient()
    const { data: dest } = await supabase.from('destinations').select('id').eq('slug', sub.destination_slug).single()
    if (!dest) { setProcessing(null); showMessage('Destinazione non trovata'); return }
    const { error } = await supabase.from('whatsapp_groups').insert({
      destination_id: dest.id, name: sub.group_name, whatsapp_url: sub.whatsapp_url,
      member_count: 0, max_members: 1024, is_active: true,
    })
    if (error) { setProcessing(null); showMessage('Errore: ' + error.message); return }
    await supabase.from('group_submissions').update({ status: 'approved' }).eq('id', sub.id)
    setGroups(prev => prev.map(g => g.id === sub.id ? { ...g, status: 'approved' } : g))
    setProcessing(null)
    showMessage(`✅ Gruppo "${sub.group_name}" approvato!`)
  }

  const rejectGroup = async (sub: GroupSubmission) => {
    setProcessing(sub.id)
    const supabase = createClient()
    await supabase.from('group_submissions').update({ status: 'rejected' }).eq('id', sub.id)
    setGroups(prev => prev.map(g => g.id === sub.id ? { ...g, status: 'rejected' } : g))
    setProcessing(null)
    showMessage('❌ Gruppo rifiutato.')
  }

  const approveTip = async (sub: TipSubmission) => {
    setProcessing(sub.id)
    const supabase = createClient()
    const { error } = await supabase.from('tips').insert({
      destination_slug: sub.destination_slug, destination_name: sub.destination_name,
      flag_emoji: sub.flag_emoji,
      author_initials: sub.author_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      author_name: sub.author_name, weeks_ago: 0, content: sub.content,
      tags: sub.tags, likes: 0, category: sub.category,
    })
    if (error) { setProcessing(null); showMessage('Errore: ' + error.message); return }
    await supabase.from('tip_submissions').update({ status: 'approved' }).eq('id', sub.id)
    setTips(prev => prev.map(t => t.id === sub.id ? { ...t, status: 'approved' } : t))
    setProcessing(null)
    showMessage(`✅ Consiglio di ${sub.author_name} approvato!`)
  }

  const rejectTip = async (sub: TipSubmission) => {
    setProcessing(sub.id)
    const supabase = createClient()
    await supabase.from('tip_submissions').update({ status: 'rejected' }).eq('id', sub.id)
    setTips(prev => prev.map(t => t.id === sub.id ? { ...t, status: 'rejected' } : t))
    setProcessing(null)
    showMessage('❌ Consiglio rifiutato.')
  }

  // --- ACTIVE GROUPS ---
  const deleteGroup = async (id: string, name: string) => {
    if (!confirm(`Eliminare il gruppo "${name}"?`)) return
    setProcessing(id)
    const supabase = createClient()
    await supabase.from('whatsapp_groups').delete().eq('id', id)
    setActiveGroups(prev => prev.filter(g => g.id !== id))
    setProcessing(null)
    showMessage(`🗑️ Gruppo eliminato.`)
  }

  const toggleGroupActive = async (group: ActiveGroup) => {
    setProcessing(group.id)
    const supabase = createClient()
    await supabase.from('whatsapp_groups').update({ is_active: !group.is_active }).eq('id', group.id)
    setActiveGroups(prev => prev.map(g => g.id === group.id ? { ...g, is_active: !g.is_active } : g))
    setProcessing(null)
    showMessage(group.is_active ? '⏸️ Gruppo disattivato.' : '▶️ Gruppo attivato.')
  }

  const saveGroupUrl = async (id: string) => {
    setProcessing(id)
    const supabase = createClient()
    await supabase.from('whatsapp_groups').update({ whatsapp_url: editGroupUrl }).eq('id', id)
    setActiveGroups(prev => prev.map(g => g.id === id ? { ...g, whatsapp_url: editGroupUrl } : g))
    setEditingGroup(null)
    setProcessing(null)
    showMessage('✅ Link aggiornato.')
  }

  // Cancella segnalazioni per un gruppo
  const clearReports = async (groupId: string) => {
    setProcessing(groupId + '_report')
    const supabase = createClient()
    await supabase.from('link_reports').delete().eq('group_id', groupId)
    setActiveGroups(prev => prev.map(g => g.id === groupId ? { ...g, report_count: 0 } : g))
    setProcessing(null)
    showMessage('✅ Segnalazioni cancellate.')
  }

  // --- PUBLISHED TIPS ---
  const deleteTip = async (id: string) => {
    if (!confirm('Eliminare questo consiglio?')) return
    setProcessing(id)
    const supabase = createClient()
    await supabase.from('tips').delete().eq('id', id)
    setPublishedTips(prev => prev.filter(t => t.id !== id))
    setProcessing(null)
    showMessage('🗑️ Consiglio eliminato.')
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
      <div className="mb-8">
        <h1 className="font-display font-semibold text-3xl mb-1">Pannello admin</h1>
        <p className="text-sm text-gray-500">Gestisci proposte, gruppi e consigli della community.</p>
      </div>

      {message && (
        <div className="mb-6 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl">{message}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'In attesa', value: pendingGroups.length + pendingTips.length, icon: <Clock size={15} className="text-orange-400" /> },
          { label: 'Gruppi attivi', value: activeGroups.filter(g => g.is_active).length, icon: <Users size={15} className="text-green-500" /> },
          { label: 'Consigli pubblicati', value: publishedTips.length, icon: <MessageSquare size={15} className="text-blue-500" /> },
          { label: 'Gruppi totali', value: activeGroups.length, icon: <Users size={15} className="text-gray-400" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-xs text-gray-400">{label}</span></div>
            <div className="font-display font-semibold text-2xl">{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: 'attesa', label: 'In attesa', count: pendingGroups.length + pendingTips.length },
          { key: 'gruppi', label: 'Gruppi attivi', count: null },
          { key: 'consigli', label: 'Consigli pubblicati', count: null },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
              tab === t.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            )}
          >
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* TAB: In attesa */}
      {tab === 'attesa' && (
        <div className="space-y-8">
          {/* Gruppi in attesa */}
          <div>
            <h2 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-3">Gruppi WhatsApp</h2>
            {pendingGroups.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center border border-dashed border-gray-200 rounded-xl">Nessuna proposta in attesa.</p>
            ) : (
              <div className="space-y-3">
                {groups.filter(g => g.status === 'pending').map(sub => (
                  <div key={sub.id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {statusBadge(sub.status)}
                          <span className="text-xs text-gray-400">{formatDate(sub.created_at)}</span>
                        </div>
                        <div className="font-medium text-sm mb-1">{sub.group_name}</div>
                        <div className="text-xs text-gray-400 mb-2">📍 {sub.destination_name}</div>
                        <a href={sub.whatsapp_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline break-all">{sub.whatsapp_url}</a>
                        {sub.submitter_note && <p className="text-xs text-gray-500 mt-2 italic">&quot;{sub.submitter_note}&quot;</p>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => approveGroup(sub)} disabled={processing === sub.id} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50">
                          <CheckCircle size={14} />Approva
                        </button>
                        <button onClick={() => rejectGroup(sub)} disabled={processing === sub.id} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">
                          <XCircle size={14} />Rifiuta
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consigli in attesa */}
          <div>
            <h2 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-3">Consigli</h2>
            {pendingTips.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center border border-dashed border-gray-200 rounded-xl">Nessun consiglio in attesa.</p>
            ) : (
              <div className="space-y-3">
                {tips.filter(t => t.status === 'pending').map(sub => (
                  <div key={sub.id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {statusBadge(sub.status)}
                          <span className="text-xs text-gray-400">{formatDate(sub.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{sub.flag_emoji}</span>
                          <span className="text-xs font-medium">{sub.destination_name}</span>
                          <span className="text-xs text-gray-400">· {sub.author_name}</span>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{sub.category}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">{sub.content}</p>
                        {sub.tags.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {sub.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => approveTip(sub)} disabled={processing === sub.id} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50">
                          <CheckCircle size={14} />Approva
                        </button>
                        <button onClick={() => rejectTip(sub)} disabled={processing === sub.id} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">
                          <XCircle size={14} />Rifiuta
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Gruppi attivi */}
      {tab === 'gruppi' && (
        <div className="space-y-3">
          {activeGroups.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">Nessun gruppo attivo.</p>
          )}
          {activeGroups.map(group => (
            <div key={group.id} className={clsx('border rounded-xl p-4 transition-colors', group.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60')}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', group.is_active ? 'bg-green-400' : 'bg-gray-300')} />
                    <span className="font-medium text-sm">{group.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400">{group.destination_flag} {group.destination_name} · {group.member_count}/{group.max_members} membri</span>
                    {(group.report_count ?? 0) > 0 && (
                      <span className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                        ⚠️ {group.report_count} segnalazion{group.report_count === 1 ? 'e' : 'i'}
                      </span>
                    )}
                  </div>
                  {editingGroup === group.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={editGroupUrl}
                        onChange={e => setEditGroupUrl(e.target.value)}
                        className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                        placeholder="https://chat.whatsapp.com/..."
                      />
                      <button onClick={() => saveGroupUrl(group.id)} disabled={processing === group.id} className="p-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingGroup(null)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <a href={group.whatsapp_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline break-all">{group.whatsapp_url}</a>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingGroup(group.id); setEditGroupUrl(group.whatsapp_url) }}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Modifica link"
                  >
                    <Edit2 size={14} />
                  </button>
                  {(group.report_count ?? 0) > 0 && (
                    <button
                      onClick={() => clearReports(group.id)}
                      disabled={processing === group.id + '_report'}
                      className="text-xs px-2.5 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium"
                      title="Cancella segnalazioni"
                    >
                      Risolto
                    </button>
                  )}
                  <button
                    onClick={() => toggleGroupActive(group)}
                    disabled={processing === group.id}
                    className={clsx('text-xs px-3 py-1.5 rounded-lg transition-colors font-medium', group.is_active ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-700 hover:bg-green-100')}
                  >
                    {group.is_active ? 'Disattiva' : 'Attiva'}
                  </button>
                  <button
                    onClick={() => deleteGroup(group.id, group.name)}
                    disabled={processing === group.id}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Consigli pubblicati */}
      {tab === 'consigli' && (
        <div className="space-y-3">
          {publishedTips.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">Nessun consiglio pubblicato.</p>
          )}
          {publishedTips.map(tip => (
            <div key={tip.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{tip.flag_emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{tip.destination_name}</span>
                    <span className="text-xs text-gray-400">· {tip.author_name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tip.category}</span>
                    <span className="text-xs text-gray-400">· ❤️ {tip.likes}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{tip.content}</p>
                  {tip.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {tip.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteTip(tip.id)}
                  disabled={processing === tip.id}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
