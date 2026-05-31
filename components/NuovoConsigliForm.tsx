'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Destination } from '@/lib/types'
import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'
import Link from 'next/link'

interface Props {
  destinations: Destination[]
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const categories = [
  { value: 'trasporti',  label: '🚌 Trasporti' },
  { value: 'ristoranti', label: '🍜 Ristoranti' },
  { value: 'alloggi',    label: '🏨 Alloggi' },
  { value: 'sicurezza',  label: '🔒 Sicurezza' },
  { value: 'cultura',    label: '🏛️ Cultura' },
  { value: 'altro',      label: '💡 Altro' },
]

const suggestedTags = ['Pratico', 'Local', 'Budget', 'Off-track', 'Imperdibile', 'Attenzione', 'Risparmio', 'Cibo']

export default function NuovoConsigliForm({ destinations }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    destination_slug: '',
    author_name: '',
    content: '',
    category: 'altro',
    tags: [] as string[],
    custom_tag: '',
  })

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : prev.tags.length < 3 ? [...prev.tags, tag] : prev.tags,
    }))
  }

  const addCustomTag = () => {
    const tag = form.custom_tag.trim()
    if (!tag || form.tags.includes(tag) || form.tags.length >= 3) return
    setForm(prev => ({ ...prev, tags: [...prev.tags, tag], custom_tag: '' }))
  }

  const removeTag = (tag: string) =>
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))

  const selectedDest = destinations.find(d => d.slug === form.destination_slug)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!form.destination_slug) { setErrorMsg('Seleziona una destinazione.'); return }
    if (!form.author_name.trim()) { setErrorMsg('Inserisci il tuo nome o nickname.'); return }
    if (form.content.trim().length < 30) { setErrorMsg('Il consiglio deve essere di almeno 30 caratteri.'); return }
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('tip_submissions').insert({
      destination_slug: form.destination_slug,
      destination_name: selectedDest?.name ?? '',
      flag_emoji: selectedDest?.flag_emoji ?? '',
      author_name: form.author_name.trim(),
      content: form.content.trim(),
      category: form.category,
      tags: form.tags,
      status: 'pending',
    })
    if (error) { setStatus('error'); setErrorMsg('Errore durante l\'invio. Riprova.'); return }
    setStatus('success')
  }

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#5A6B4A', display: 'block', marginBottom: 6 } as const
  const inputStyle = { width: '100%', padding: '10px 14px', fontSize: 13, border: '1px solid #DDE4D0', borderRadius: 10, background: 'white', color: '#1A2010', outline: 'none' } as const

  if (status === 'success') {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: '#F0F4E8', border: '1px solid #DDE4D0' }}>
        <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#5A7A35' }} />
        <h2 className="font-display font-semibold mb-2" style={{ fontSize: 20, color: '#1A2010' }}>Consiglio inviato!</h2>
        <p style={{ fontSize: 13, color: '#7A8F6A', lineHeight: 1.6, marginBottom: 20 }}>
          Grazie! Il tuo consiglio verrà revisionato entro 24-48 ore e pubblicato sulla pagina di {selectedDest?.name}.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href={`/destinazioni/${form.destination_slug}`}
            style={{ background: '#5A7A35', color: 'white', fontSize: 13, padding: '10px 20px', borderRadius: 20, fontWeight: 700 }}>
            ← Torna a {selectedDest?.name}
          </Link>
          <button onClick={() => { setStatus('idle'); setForm({ destination_slug: '', author_name: '', content: '', category: 'altro', tags: [], custom_tag: '' }) }}
            style={{ border: '1px solid #DDE4D0', color: '#5A6B4A', fontSize: 13, padding: '10px 20px', borderRadius: 20, background: 'white' }}>
            Aggiungi un altro
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Destinazione */}
      <div>
        <label style={labelStyle}>Destinazione <span style={{ color: '#C1440E' }}>*</span></label>
        <select value={form.destination_slug} onChange={e => update('destination_slug', e.target.value)}
          style={{ ...inputStyle, appearance: 'auto' }}>
          <option value="">Seleziona un paese...</option>
          {destinations.map(d => (
            <option key={d.slug} value={d.slug}>{d.flag_emoji} {d.name}</option>
          ))}
        </select>
      </div>

      {/* Nome */}
      <div>
        <label style={labelStyle}>Il tuo nome o nickname <span style={{ color: '#C1440E' }}>*</span></label>
        <input type="text" value={form.author_name} onChange={e => update('author_name', e.target.value)}
          placeholder="es. Marco R." maxLength={40} style={inputStyle} />
      </div>

      {/* Categoria */}
      <div>
        <label style={labelStyle}>Categoria</label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map(cat => (
            <button key={cat.value} type="button" onClick={() => update('category', cat.value)}
              style={{
                padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 500, textAlign: 'left',
                border: form.category === cat.value ? 'none' : '1px solid #DDE4D0',
                background: form.category === cat.value ? '#5A7A35' : 'white',
                color: form.category === cat.value ? 'white' : '#5A6B4A',
              }}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenuto */}
      <div>
        <label style={labelStyle}>Il tuo consiglio <span style={{ color: '#C1440E' }}>*</span></label>
        <textarea value={form.content} onChange={e => update('content', e.target.value)}
          placeholder="Scrivi un consiglio specifico e utile. Es: 'A Kyoto evitate il Fushimi Inari nel weekend — andate all'alba il lunedì, ci sarete quasi soli.'"
          rows={5} maxLength={500}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
        <div className="flex justify-between mt-1">
          <span style={{ fontSize: 11, color: '#7A8F6A' }}>Minimo 30 caratteri</span>
          <span style={{ fontSize: 11, color: form.content.length > 450 ? '#C1440E' : '#7A8F6A' }}>{form.content.length}/500</span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle}>Tag <span style={{ fontWeight: 400, color: '#7A8F6A' }}>(max 3)</span></label>
        {form.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {form.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5"
                style={{ fontSize: 11, background: '#5A7A35', color: 'white', padding: '3px 10px', borderRadius: 20 }}>
                {tag}
                <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 0 }}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-1.5 flex-wrap mb-2">
          {suggestedTags.map(tag => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              disabled={form.tags.length >= 3 && !form.tags.includes(tag)}
              style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                border: form.tags.includes(tag) ? 'none' : '1px solid #DDE4D0',
                background: form.tags.includes(tag) ? '#5A7A35' : 'white',
                color: form.tags.includes(tag) ? 'white' : '#5A6B4A',
                opacity: form.tags.length >= 3 && !form.tags.includes(tag) ? 0.4 : 1,
              }}>
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={form.custom_tag} onChange={e => update('custom_tag', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
            placeholder="Tag personalizzato..." maxLength={20}
            disabled={form.tags.length >= 3}
            style={{ flex: 1, padding: '6px 12px', fontSize: 12, border: '1px solid #DDE4D0', borderRadius: 8, background: 'white', outline: 'none', opacity: form.tags.length >= 3 ? 0.4 : 1 }} />
          <button type="button" onClick={addCustomTag}
            disabled={!form.custom_tag.trim() || form.tags.length >= 3}
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: '#EEF2E6', color: '#5A6B4A', border: 'none', opacity: !form.custom_tag.trim() || form.tags.length >= 3 ? 0.4 : 1 }}>
            Aggiungi
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: '#F0F4E8', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#5A6B4A', lineHeight: 1.6 }}>
        Inviando dichiari che il consiglio è basato su esperienza personale e non contiene contenuti promozionali.
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#C1440E', background: '#FBF0EB', padding: '10px 14px', borderRadius: 10 }}>
          <AlertCircle size={15} />{errorMsg}
        </div>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 font-semibold"
        style={{ background: '#5A7A35', color: 'white', padding: '12px', borderRadius: 24, border: 'none', fontSize: 13, opacity: status === 'loading' ? 0.6 : 1 }}>
        {status === 'loading'
          ? <><Loader2 size={16} className="animate-spin" />Invio in corso...</>
          : '✈️ Condividi il consiglio'}
      </button>
    </form>
  )
}
