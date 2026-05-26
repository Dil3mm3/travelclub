'use client'

import { useState } from 'react'
import { Tip } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import TipCard from './TipCard'
import { CheckCircle, AlertCircle, Loader2, X, ChevronDown } from 'lucide-react'

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

    if (error) {
      setFormStatus('error')
      setErrorMsg('Errore durante l\'invio. Riprova tra poco.')
      return
    }

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
          <h2 className="font-display font-semibold text-xl mb-1">
            Consigli della community
          </h2>
          <p className="text-sm text-gray-400">
            {tips.length > 0
              ? `${tips.length} tip condivisi da chi c'è stato`
              : 'Ancora nessun consiglio — sii il primo!'}
          </p>
        </div>
        {!showForm && formStatus !== 'success' && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            + Aggiungi
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

      {/* Form inline */}
      {formStatus === 'success' ? (
        <div className="border border-green-100 bg-green-50 rounded-xl p-6 text-center">
          <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
          <h3 className="font-medium mb-1">Consiglio inviato!</h3>
          <p className="text-sm text-gray-500 mb-4">
            Verrà revisionato e pubblicato entro 24-48 ore.
          </p>
          <button
            onClick={resetForm}
            className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            Aggiungi un altro consiglio
          </button>
        </div>
      ) : showForm ? (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-sm">Condividi un consiglio su {destinationName}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Il tuo nome o nickname <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.author_name}
                onChange={e => update('author_name', e.target.value)}
                placeholder="es. Marco R."
                maxLength={40}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Categoria</label>
              <div className="grid grid-cols-3 gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => update('category', cat.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.category === cat.value
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenuto */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Il tuo consiglio <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={e => update('content', e.target.value)}
                placeholder={`Scrivi un consiglio specifico su ${destinationName}...`}
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors resize-none bg-white"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">Minimo 30 caratteri</p>
                <p className={`text-xs ${form.content.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {form.content.length}/500
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tag <span className="text-gray-400 font-normal">(max 3)</span>
              </label>
              {form.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-1.5 flex-wrap mb-2">
                {suggestedTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    disabled={form.tags.length >= 3 && !form.tags.includes(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      form.tags.includes(tag)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 disabled:opacity-40'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.custom_tag}
                  onChange={e => update('custom_tag', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                  placeholder="Tag personalizzato..."
                  maxLength={20}
                  disabled={form.tags.length >= 3}
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  disabled={!form.custom_tag.trim() || form.tags.length >= 3}
                  className="text-xs px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-40"
                >
                  Aggiungi
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle size={13} />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus === 'loading'}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              {formStatus === 'loading' ? (
                <><Loader2 size={15} className="animate-spin" /> Invio...</>
              ) : '✈️ Condividi il consiglio'}
            </button>
          </form>
        </div>
      ) : (
        /* CTA quando non c'è ancora nessun consiglio o il form è chiuso */
        tips.length === 0 && (
          <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Sei stato in {destinationName}? Condividi un consiglio utile alla community.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-block bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Condividi un consiglio →
            </button>
          </div>
        )
      )}
    </section>
  )
}
