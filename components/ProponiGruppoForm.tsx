'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import WhatsAppIcon from './WhatsAppIcon'
import CityAutocomplete from './CityAutocomplete'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
  destinationSlug: string
  destinationName: string
  destinationCountryCode?: string
}

interface CityResult {
  name: string
  country: string
  display: string
  lat: number
  lng: number
}

type Status = 'idle' | 'loading' | 'success' | 'error'

function isValidWhatsAppUrl(url: string): boolean {
  return url.startsWith('https://chat.whatsapp.com/')
}

export default function ProponiGruppoForm({ destinationSlug, destinationName, destinationCountryCode }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null)
  const [form, setForm] = useState({ group_name: '', whatsapp_url: '', submitter_note: '' })

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!form.group_name.trim()) { setErrorMsg('Inserisci il nome del gruppo.'); return }
    if (!isValidWhatsAppUrl(form.whatsapp_url.trim())) { setErrorMsg('Il link deve iniziare con https://chat.whatsapp.com/'); return }
    if (!selectedCity) { setErrorMsg('Seleziona una città dalla lista dei suggerimenti.'); return }
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('group_submissions').insert({
      destination_slug: destinationSlug,
      destination_name: destinationName,
      group_name: form.group_name.trim(),
      whatsapp_url: form.whatsapp_url.trim(),
      submitter_note: form.submitter_note.trim() || null,
      city: selectedCity.name,
      status: 'pending',
    })
    if (error) { setStatus('error'); setErrorMsg('Errore durante l\'invio. Riprova.'); return }
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: '#F0F4E8', border: '1px solid #DDE4D0' }}>
        <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#5A7A35' }} />
        <h2 className="font-display font-semibold mb-2" style={{ fontSize: 20, color: '#1A2010' }}>Proposta inviata!</h2>
        <p style={{ fontSize: 13, color: '#7A8F6A', lineHeight: 1.6, marginBottom: 20 }}>
          Grazie! Verificheremo il gruppo entro 24-48 ore e lo pubblicheremo sulla pagina di {destinationName}.
        </p>
        <Link href={`/destinazioni/${destinationSlug}`}
          className="font-bold inline-block"
          style={{ background: '#5A7A35', color: 'white', fontSize: 13, padding: '10px 20px', borderRadius: 20 }}>
          ← Torna a {destinationName}
        </Link>
      </div>
    )
  }

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#5A6B4A', display: 'block', marginBottom: 6 } as const
  const inputStyle = { width: '100%', padding: '10px 14px', fontSize: 13, border: '1px solid #DDE4D0', borderRadius: 10, background: 'white', color: '#1A2010', outline: 'none' } as const

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Nome gruppo */}
      <div>
        <label style={labelStyle}>Nome del gruppo <span style={{ color: '#C1440E' }}>*</span></label>
        <input type="text" value={form.group_name} onChange={e => update('group_name', e.target.value)}
          placeholder={`es. Italiani in ${destinationName} 2025`} maxLength={80} style={inputStyle} />
        <p style={{ fontSize: 11, color: '#7A8F6A', marginTop: 4 }}>{form.group_name.length}/80 caratteri</p>
      </div>

      {/* Città */}
      <div>
        <label style={labelStyle}>Città di riferimento <span style={{ color: '#C1440E' }}>*</span></label>
        <CityAutocomplete
          value=""
          onChange={setSelectedCity}
          destinationCountry={destinationCountryCode}
          placeholder={`Cerca una città in ${destinationName}...`}
        />
        <p style={{ fontSize: 11, color: '#7A8F6A', marginTop: 4 }}>Digita almeno 3 caratteri e seleziona dalla lista.</p>
      </div>

      {/* Link WhatsApp */}
      <div>
        <label style={labelStyle}>Link di invito WhatsApp <span style={{ color: '#C1440E' }}>*</span></label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#25D366' }}>
            <WhatsAppIcon size={16} />
          </span>
          <input type="url" value={form.whatsapp_url} onChange={e => update('whatsapp_url', e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
            style={{ ...inputStyle, paddingLeft: 38 }} />
        </div>
        <p style={{ fontSize: 11, color: '#7A8F6A', marginTop: 4 }}>
          Apri WhatsApp → Info gruppo → Link di invito → Copia link
        </p>
        {form.whatsapp_url && !isValidWhatsAppUrl(form.whatsapp_url) && (
          <p className="flex items-center gap-1 mt-1" style={{ fontSize: 11, color: '#C1440E' }}>
            <AlertCircle size={12} />Il link deve iniziare con https://chat.whatsapp.com/
          </p>
        )}
        {form.whatsapp_url && isValidWhatsAppUrl(form.whatsapp_url) && (
          <p className="flex items-center gap-1 mt-1" style={{ fontSize: 11, color: '#5A7A35' }}>
            <CheckCircle size={12} />Link valido
          </p>
        )}
      </div>

      {/* Note */}
      <div>
        <label style={labelStyle}>Note aggiuntive <span style={{ fontWeight: 400, color: '#7A8F6A' }}>(opzionale)</span></label>
        <textarea value={form.submitter_note} onChange={e => update('submitter_note', e.target.value)}
          placeholder="Es. gruppo attivo da 2 anni, focalizzato su backpacking..."
          rows={3} maxLength={300}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
      </div>

      {/* Disclaimer */}
      <div style={{ background: '#F0F4E8', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#5A6B4A', lineHeight: 1.6 }}>
        Inviando dichiari che il gruppo è autentico, attivo e rispetta le linee guida di travelclub.
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#C1440E', background: '#FBF0EB', padding: '10px 14px', borderRadius: 10 }}>
          <AlertCircle size={15} />{errorMsg}
        </div>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 font-semibold"
        style={{ background: '#25D366', color: 'white', padding: '12px', borderRadius: 24, border: 'none', fontSize: 13, opacity: status === 'loading' ? 0.6 : 1 }}>
        {status === 'loading'
          ? <><Loader2 size={16} className="animate-spin" />Invio in corso...</>
          : <><WhatsAppIcon size={16} />Proponi il gruppo</>}
      </button>
    </form>
  )
}
