import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Regole della community — travelclub',
  description: 'Le regole per partecipare alla community travelclub e ai gruppi WhatsApp.',
}

const rules = [
  { number: '01', title: 'Rispetta tutti i membri', description: 'Ogni membro della community merita rispetto, indipendentemente dalla sua esperienza di viaggio, nazionalità o opinione. Commenti offensivi, discriminatori o aggressivi non sono tollerati.' },
  { number: '02', title: 'Condividi solo informazioni accurate', description: 'Prima di condividere un consiglio, assicurati che sia basato sulla tua esperienza diretta o su fonti affidabili. Informazioni false o non aggiornate possono danneggiare altri viaggiatori.' },
  { number: '03', title: 'Niente spam o pubblicità', description: 'È vietato condividere link promozionali, pubblicità, referral o qualsiasi contenuto commerciale non richiesto. I consigli devono essere genuini e disinteressati.' },
  { number: '04', title: 'Rimani in tema', description: 'Ogni gruppo WhatsApp è dedicato a una destinazione specifica. Mantieni le conversazioni pertinenti alla destinazione del gruppo. Per argomenti diversi, usa il gruppo più appropriato.' },
  { number: '05', title: 'Non condividere contenuti inappropriati', description: 'È vietato condividere contenuti violenti, sessualmente espliciti, illegali o che incitano all\'odio. Questo include immagini, link e testo di qualsiasi tipo.' },
  { number: '06', title: 'Proteggi la tua privacy e quella degli altri', description: 'Non condividere informazioni personali proprie o altrui nei gruppi pubblici. Sii prudente con le informazioni che condividi online.' },
  { number: '07', title: 'Niente link scaduti o non funzionanti', description: 'Se sei l\'admin di un gruppo, mantieni il link di invito aggiornato. Se noti un link non funzionante, usa il tasto "Segnala link non funzionante" sulla pagina della destinazione.' },
  { number: '08', title: 'Un gruppo per destinazione', description: 'Evita di creare gruppi duplicati per la stessa destinazione. Prima di proporre un nuovo gruppo, verifica che non ne esista già uno attivo.' },
]

const consequences = [
  { level: '1°', action: 'Avviso privato dall\'admin del gruppo' },
  { level: '2°', action: 'Rimozione temporanea dal gruppo' },
  { level: '3°', action: 'Ban permanente da tutti i gruppi travelclub' },
]

export default function RegolePage() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: '#1A2010', padding: '32px 24px 28px' }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8C468', marginBottom: 8 }}>
            Community
          </p>
          <h1 className="font-display font-bold" style={{ fontSize: 36, color: 'white', marginBottom: 8, lineHeight: 1.1 }}>
            Regole della community
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 480, lineHeight: 1.6 }}>
            travelclub è uno spazio per viaggiatori italiani che vogliono condividere esperienze reali.
            Per mantenere la qualità della community, chiediamo a tutti di rispettare queste regole.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Regole */}
        <div className="space-y-6 mb-14">
          {rules.map(rule => (
            <div key={rule.number} className="flex gap-6">
              <div className="font-display font-bold flex-shrink-0" style={{ fontSize: 28, color: '#DDE4D0', width: 40 }}>
                {rule.number}
              </div>
              <div style={{ paddingTop: 2 }}>
                <h2 className="font-semibold mb-1.5" style={{ fontSize: 15, color: '#1A2010' }}>{rule.title}</h2>
                <p style={{ fontSize: 13, color: '#5A6B4A', lineHeight: 1.7 }}>{rule.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Conseguenze */}
        <div className="rounded-2xl p-6 mb-10" style={{ border: '1px solid #DDE4D0', background: 'white' }}>
          <h2 className="font-display font-semibold mb-1" style={{ fontSize: 20, color: '#1A2010' }}>
            Cosa succede se si viola una regola?
          </h2>
          <p style={{ fontSize: 13, color: '#7A8F6A', marginBottom: 16 }}>
            Le violazioni vengono gestite in modo progressivo dagli admin dei gruppi.
          </p>
          <div className="space-y-3">
            {consequences.map(({ level, action }) => (
              <div key={level} className="flex items-center gap-4">
                <span className="font-semibold flex-shrink-0" style={{ fontSize: 12, color: '#5A7A35', background: '#EEF2E6', padding: '3px 10px', borderRadius: 20 }}>
                  {level}
                </span>
                <span style={{ fontSize: 13, color: '#5A6B4A' }}>{action}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#7A8F6A', marginTop: 14 }}>
            Per violazioni gravi (contenuti illegali, spam massivo) il ban può essere immediato.
          </p>
        </div>

        {/* Segnalazioni */}
        <div className="rounded-2xl p-6 mb-10" style={{ background: '#F0F4E8', border: '1px solid #DDE4D0' }}>
          <h2 className="font-display font-semibold mb-2" style={{ fontSize: 18, color: '#1A2010' }}>
            Hai visto qualcosa di inappropriato?
          </h2>
          <p style={{ fontSize: 13, color: '#5A6B4A', lineHeight: 1.6, marginBottom: 16 }}>
            Se noti comportamenti che violano queste regole in un gruppo WhatsApp, puoi segnalarlo
            direttamente agli admin del gruppo o contattarci via email.
          </p>
          <a href="mailto:ciao@travelclub.it"
            className="inline-flex items-center gap-2 font-semibold transition-colors"
            style={{ background: '#5A7A35', color: 'white', fontSize: 13, padding: '9px 18px', borderRadius: 20 }}>
            ✉️ Contattaci
          </a>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center" style={{ borderTop: '1px solid #DDE4D0', paddingTop: 24 }}>
          <p style={{ fontSize: 11, color: '#7A8F6A' }}>Ultima modifica: maggio 2026</p>
          <Link href="/destinazioni" style={{ fontSize: 13, color: '#5A7A35', fontWeight: 600 }}>
            Torna alle destinazioni →
          </Link>
        </div>
      </div>
    </div>
  )
}
