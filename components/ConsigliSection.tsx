'use client'

import { useState } from 'react'
import { Tip } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import TipCard from './TipCard'
import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'

interface Props {
  tips: Tip[]
  destinationSlug: string
  destinationName: string
  flagEmoji: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const categories = [
  { value: 'trasporti',  label: '🚌 Trasporti' },
  { value: 'ristoranti', label: '🍜 Ristoranti' },
  { value: 'alloggi',    label: '🏨 Alloggi' },
  { value: 'sicurezza',  label: '🔒 Sicurezza' },
  { value: 'cultura',    label: '🏛️ Cultura' },
  { value: 'altro',      label: '💡 Altro' },
]

const suggestedTags = ['Pratico', 'Local', 'Budget', 'Off-track', 'Imperdibile', 'Attenzione', 'Risparmio', 'Cibo']

export default function ConsigliSection({ tips, destinationSlug, destinationName, flagEmoji }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!form.author_name.trim()) { setErrorMsg('Inserisci il tuo nome.'); return }
    if (form.content.trim().length < 30) { setErrorMsg('Il consiglio deve essere di almeno 30 caratteri.'); return }
    setFormStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('tip_submissions').insert({
      destination_slug: destinationSlug,
      destination_name: destinationName,
      flag_emoji: flagEmoji,
      author_name: form.author_name.trim(),
      content: form.content.trim(),
      category: form.category,
      tags: form.tags,
      status: 'pending',
    })
    if (error) { setFormStatus('error'); setErrorMsg('Errore durante l\'invio. Riprova.'); return }
    setFormStatus('success')
  }

  const resetForm = () => {
    setForm({ author_name: '', content: '', category: 'altro', tags: [], custom_tag: '' })
    setFormStatus('idle')
    setErrorMsg('')
    setShowForm(false)
  }

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between items-end mb-5">
        <div>
          <h2 className="font-display font-semibold" style={{ fontSize: 18, color: '#1A2010', marginBottom: 3 }}>
            Consigli della community
          </h2>
          <p style={{ fontSize: 12, color: '#7A8F6A' }}>
            {tips.length > 0
              ? `${tips.length} tip condivisi da chi c'è stato`
              : 'Ancora nessun consiglio — sii il primo!'}
          </p>
        </div>
        {!showForm && formStatus !== 'success' && (
          <button
            onClick={() => setShowForm(true)}
            className="font-semibold transition-colors"
            style={{ background: '#5A7A35', color: 'white', fontSize: 12, padding: '8px 16px', borderRadius: 20, border: 'none' }}
          >
            ✈️ Condividi un consiglio
          </button>
        )}
      </div>

      {/* Lista consigli */}
      {tips.length > 0 && (
        <div className="space-y-4 mb-6">
          {tips.map(tip => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      )}

      {/* Form / Success / Empty state */}
      {formStatus === 'success' ? (
        <div className="rounded-xl p-6 text-center" style={{ background: '#F0F4E8', border: '1px solid #DDE4D0' }}>
          <CheckCircle size={32} className="mx-auto mb-3" style={{ color: '#5A7A35' }} />
          <h3 className="font-semibold mb-1" style={{ color: '#1A2010' }}>Consiglio inviato!</h3>
          <p style={{ fontSize: 12, color: '#7A8F6A', marginBottom: 16 }}>
            Verrà revisionato e pubblicato entro 24-48 ore.
          </p>
          <button onClick={resetForm} style={{ fontSize: 12, border: '1px solid #DDE4D0', padding: '7px 16px', borderRadius: 20, background: 'white', color: '#5A6B4A' }}>
            Aggiungi un altro consiglio
          </button>
        </div>
      ) : showForm ? (
        <div className="rounded-xl p-5" style={{ background: '#F8F9F4', border: '1px solid #DDE4D0' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold" style={{ fontSize: 13, color: '#1A2010' }}>
              Condividi un consiglio su {destinationName}
            </h3>
            <button onClick={() => setShowForm(false)} style={{ color: '#7A8F6A', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6B4A', display: 'block', marginBottom: 5 }}>
                Il tuo nome <span style={{ color: '#C1440E' }}>*</span>
              </label>
              <input type="text" value={form.author_name} onChange={e => update('author_name', e.target.value)}
                placeholder="es. Marco R." maxLength={40}
                className="w-full outline-none"
                style={{ padding: '8px 12px', fontSize: 13, border: '1px solid #DDE4D0', borderRadius: 8, background: 'white', color: '#1A2010' }} />
            </div>

            {/* Categoria */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6B4A', display: 'block', marginBottom: 5 }}>Categoria</label>
              <div className="grid grid-cols-3 gap-1.5">
                {categories.map(cat => (
                  <button key={cat.value} type="button" onClick={() => update('category', cat.value)}
                    style={{
                      padding: '6px 8px', borderRadius: 8, fontSize: 11, fontWeight: 500,
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
              <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6B4A', display: 'block', marginBottom: 5 }}>
                Il tuo consiglio <span style={{ color: '#C1440E' }}>*</span>
              </label>
              <textarea value={form.content} onChange={e => update('content', e.target.value)}
                placeholder={`Scrivi un consiglio specifico su ${destinationName}...`}
                rows={4} maxLength={500}
                className="w-full outline-none resize-none"
                style={{ padding: '8px 12px', fontSize: 12, border: '1px solid #DDE4D0', borderRadius: 8, background: 'white', color: '#1A2010', lineHeight: 1.6 }} />
              <div className="flex justify-between mt-1">
                <span style={{ fontSize: 10, color: '#7A8F6A' }}>Minimo 30 caratteri</span>
                <span style={{ fontSize: 10, color: form.content.length > 450 ? '#C1440E' : '#7A8F6A' }}>{form.content.length}/500</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#5A6B4A', display: 'block', marginBottom: 5 }}>Tag (max 3)</label>
              {form.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1"
                      style={{ fontSize: 11, background: '#5A7A35', color: 'white', padding: '2px 8px', borderRadius: 20 }}>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 0 }}>
                        <X size={10} />
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
                      fontSize: 11, padding: '3px 8px', borderRadius: 20,
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
                  className="outline-none"
                  style={{ flex: 1, padding: '5px 10px', fontSize: 11, border: '1px solid #DDE4D0', borderRadius: 8, background: 'white', opacity: form.tags.length >= 3 ? 0.4 : 1 }} />
                <button type="button" onClick={addCustomTag}
                  disabled={!form.custom_tag.trim() || form.tags.length >= 3}
                  style={{ fontSize: 11, padding: '5px 12px', borderRadius: 8, background: '#EEF2E6', color: '#5A6B4A', border: 'none', opacity: !form.custom_tag.trim() || form.tags.length >= 3 ? 0.4 : 1 }}>
                  Aggiungi
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2" style={{ fontSize: 12, color: '#C1440E', background: '#FBF0EB', padding: '8px 12px', borderRadius: 8 }}>
                <AlertCircle size={13} />{errorMsg}
              </div>
            )}

            <button type="submit" disabled={formStatus === 'loading'}
              className="w-full flex items-center justify-center gap-2 font-semibold"
              style={{ background: '#5A7A35', color: 'white', padding: '10px', borderRadius: 20, border: 'none', fontSize: 13, opacity: formStatus === 'loading' ? 0.6 : 1 }}>
              {formStatus === 'loading' ? <><Loader2 size={15} className="animate-spin" />Invio...</> : '✈️ Condividi il consiglio'}
            </button>
          </form>
        </div>
      ) : (
        tips.length === 0 && (
          <div className="rounded-xl p-8 text-center" style={{ border: '2px dashed #DDE4D0' }}>
            <p style={{ fontSize: 13, color: '#7A8F6A', marginBottom: 16 }}>
              Sei stato in {destinationName}? Condividi un consiglio utile alla community.
            </p>
            <button onClick={() => setShowForm(true)}
              className="font-bold inline-block"
              style={{ background: '#5A7A35', color: 'white', fontSize: 13, padding: '10px 20px', borderRadius: 20, border: 'none' }}>
              ✈️ Condividi un consiglio
            </button>
          </div>
        )
      )}
    </section>
  )
}
