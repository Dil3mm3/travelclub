'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import WhatsAppIcon from './WhatsAppIcon'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
  destinationSlug: string
  destinationName: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

function isValidWhatsAppUrl(url: string): boolean {
  return url.startsWith('https://chat.whatsapp.com/')
}

export default function ProponiGruppoForm({ destinationSlug, destinationName }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    group_name: '',
    whatsapp_url: '',
    submitter_note: '',
  })

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!form.group_name.trim()) {
      setErrorMsg('Inserisci il nome del gruppo.')
      return
    }
    if (!isValidWhatsAppUrl(form.whatsapp_url.trim())) {
      setErrorMsg('Il link deve iniziare con https://chat.whatsapp.com/')
      return
    }

    setStatus('loading')

    const supabase = createClient()
    const { error } = await supabase.from('group_submissions').insert({
      destination_slug: destinationSlug,
      destination_name: destinationName,
      group_name: form.group_name.trim(),
      whatsapp_url: form.whatsapp_url.trim(),
      submitter_note: form.submitter_note.trim() || null,
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
        <h2 className="font-display font-semibold text-xl mb-2">Proposta inviata!</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Grazie! Verificheremo il gruppo entro 24-48 ore e lo pubblicheremo sulla pagina
          di {destinationName} se tutto è in ordine.
        </p>
        <Link
          href={`/destinazioni/${destinationSlug}`}
          className="inline-block bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Torna a {destinationName}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Nome gruppo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nome del gruppo <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.group_name}
          onChange={e => update('group_name', e.target.value)}
          placeholder={`es. Italiani in ${destinationName} 2025`}
          maxLength={80}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1">{form.group_name.length}/80 caratteri</p>
      </div>

      {/* Link WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Link di invito WhatsApp <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#25D366]">
            <WhatsAppIcon size={16} />
          </span>
          <input
            type="url"
            value={form.whatsapp_url}
            onChange={e => update('whatsapp_url', e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Apri WhatsApp → Info gruppo → Link di invito → Copia link
        </p>
        {form.whatsapp_url && !isValidWhatsAppUrl(form.whatsapp_url) && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            Il link deve iniziare con https://chat.whatsapp.com/
          </p>
        )}
        {form.whatsapp_url && isValidWhatsAppUrl(form.whatsapp_url) && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <CheckCircle size={12} />
            Link valido
          </p>
        )}
      </div>

      {/* Nota opzionale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Note aggiuntive <span className="text-gray-400 font-normal">(opzionale)</span>
        </label>
        <textarea
          value={form.submitter_note}
          onChange={e => update('submitter_note', e.target.value)}
          placeholder="Es. gruppo attivo da 2 anni, circa 300 membri italiani, focalizzato su..."
          rows={3}
          maxLength={300}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{form.submitter_note.length}/300 caratteri</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
        Inviando questo form dichiari che il gruppo è autentico, attivo e rispetta le
        linee guida di travelclub. I gruppi con contenuti inappropriati o link non
        funzionanti verranno rimossi.
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
        className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1ebe5d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Invio in corso...
          </>
        ) : (
          <>
            <WhatsAppIcon size={16} />
            Proponi il gruppo
          </>
        )}
      </button>

    </form>
  )
}
