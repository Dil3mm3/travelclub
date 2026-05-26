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

const suggestedTags = [
  'Pratico', 'Local', 'Budget', 'Off-track', 'Imperdibile',
  'Attenzione', 'Risparmio', 'Cibo', 'Natura', 'Sicurezza',
]

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

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

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

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const selectedDest = destinations.find(d => d.slug === form.destination_slug)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!form.destination_slug) {
      setErrorMsg('Seleziona una destinazione.')
      return
    }
    if (!form.author_name.trim()) {
      setErrorMsg('Inserisci il tuo nome o nickname.')
      return
    }
    if (form.content.trim().length < 30) {
      setErrorMsg('Il consiglio deve essere di almeno 30 caratteri.')
      return
    }

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

    if (error) {
      setStatus('error')
      setErrorMsg('Errore durante l\'invio. Riprova tra poco.')
      return
    }

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="border border-green-100 bg-green-50 rounded-2xl p-8 text-center">
        <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display font-semibold text-xl mb-2">Consiglio inviato!</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Grazie! Il tuo consiglio verrà revisionato entro 24-48 ore e pubblicato
          sulla pagina di {selectedDest?.name}.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href={`/destinazioni/${form.destination_slug}`}
            className="inline-block bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Torna a {selectedDest?.name}
          </Link>
          <button
            onClick={() => {
              setStatus('idle')
              setForm({ destination_slug: '', author_name: '', content: '', category: 'altro', tags: [], custom_tag: '' })
            }}
            className="inline-block border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Destinazione <span className="text-red-400">*</span>
        </label>
        <select
          value={form.destination_slug}
          onChange={e => update('destination_slug', e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors bg-white"
        >
          <option value="">Seleziona un paese...</option>
          {destinations.map(d => (
            <option key={d.slug} value={d.slug}>
              {d.flag_emoji} {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Il tuo nome o nickname <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.author_name}
          onChange={e => update('author_name', e.target.value)}
          placeholder="es. Marco R."
          maxLength={40}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Categoria
        </label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              type="button"
              onClick={() => update('category', cat.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Il tuo consiglio <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.content}
          onChange={e => update('content', e.target.value)}
          placeholder="Scrivi un consiglio specifico e utile. Es: 'A Kyoto evitate il Fushimi Inari nel weekend — andate all'alba il lunedì, ci sarete quasi soli e la luce è perfetta.'"
          rows={5}
          maxLength={500}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors resize-none"
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Tag <span className="text-gray-400 font-normal">(max 3)</span>
        </label>
        {form.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {form.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X size={11} />
                </button>
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
            className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors disabled:opacity-40"
          />
          <button
            type="button"
            onClick={addCustomTag}
            disabled={!form.custom_tag.trim() || form.tags.length >= 3}
            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40"
          >
            Aggiungi
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
        Inviando dichiari che il consiglio è basato su esperienza personale e non contiene
        contenuti promozionali o inappropriati. I consigli spam verranno rimossi.
      </div>

      {/* Errore */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          <AlertCircle size={15} />
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Invio in corso...
          </>
        ) : (
          '✈️ Condividi il consiglio'
        )}
      </button>

    </form>
  )
}
