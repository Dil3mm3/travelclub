import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Regole della community — travelclub',
  description: 'Le regole per partecipare alla community travelclub e ai gruppi WhatsApp.',
}

const rules = [
  {
    number: '01',
    title: 'Rispetta tutti i membri',
    description: 'Ogni membro della community merita rispetto, indipendentemente dalla sua esperienza di viaggio, nazionalità o opinione. Commenti offensivi, discriminatori o aggressivi non sono tollerati.',
  },
  {
    number: '02',
    title: 'Condividi solo informazioni accurate',
    description: 'Prima di condividere un consiglio, assicurati che sia basato sulla tua esperienza diretta o su fonti affidabili. Informazioni false o non aggiornate possono danneggiare altri viaggiatori.',
  },
  {
    number: '03',
    title: 'Niente spam o pubblicità',
    description: 'È vietato condividere link promozionali, pubblicità, referral o qualsiasi contenuto commerciale non richiesto. I consigli devono essere genuini e disinteressati.',
  },
  {
    number: '04',
    title: 'Rimani in tema',
    description: 'Ogni gruppo WhatsApp è dedicato a una destinazione specifica. Mantieni le conversazioni pertinenti alla destinazione del gruppo. Per argomenti diversi, usa il gruppo più appropriato.',
  },
  {
    number: '05',
    title: 'Non condividere contenuti inappropriati',
    description: 'È vietato condividere contenuti violenti, sessualmente espliciti, illegali o che incitano all\'odio. Questo include immagini, link e testo di qualsiasi tipo.',
  },
  {
    number: '06',
    title: 'Proteggi la tua privacy e quella degli altri',
    description: 'Non condividere informazioni personali proprie o altrui (numeri di telefono, indirizzi, dati finanziari) nei gruppi pubblici. Sii prudente con le informazioni che condividi online.',
  },
  {
    number: '07',
    title: 'Niente link scaduti o non funzionanti',
    description: 'Se sei l\'admin di un gruppo, mantieni il link di invito aggiornato. Se noti un link non funzionante, usa il tasto "Segnala link non funzionante" sulla pagina della destinazione.',
  },
  {
    number: '08',
    title: 'Un gruppo per destinazione',
    description: 'Evita di creare gruppi duplicati per la stessa destinazione. Prima di proporre un nuovo gruppo, verifica che non ne esista già uno attivo. I gruppi duplicati verranno rimossi.',
  },
]

const consequences = [
  { level: '1°', action: 'Avviso privato dall\'admin del gruppo' },
  { level: '2°', action: 'Rimozione temporanea dal gruppo' },
  { level: '3°', action: 'Ban permanente da tutti i gruppi travelclub' },
]

export default function RegolePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-12">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Community</p>
        <h1 className="font-display font-semibold text-4xl mb-4">
          Regole della community
        </h1>
        <p className="text-gray-500 leading-relaxed">
          travelclub è uno spazio per viaggiatori italiani che vogliono condividere
          esperienze reali e aiutarsi a vicenda. Per mantenere la qualità della community,
          chiediamo a tutti di rispettare queste regole semplici.
        </p>
      </div>

      {/* Regole */}
      <div className="space-y-6 mb-16">
        {rules.map(rule => (
          <div key={rule.number} className="flex gap-6">
            <div className="font-display font-semibold text-3xl text-gray-100 flex-shrink-0 w-10">
              {rule.number}
            </div>
            <div className="pt-1">
              <h2 className="font-medium text-base mb-1.5">{rule.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Conseguenze */}
      <div className="border border-gray-100 rounded-2xl p-6 mb-12">
        <h2 className="font-display font-semibold text-xl mb-1">Cosa succede se si viola una regola?</h2>
        <p className="text-sm text-gray-500 mb-5">
          Le violazioni vengono gestite in modo progressivo dagli admin dei gruppi.
        </p>
        <div className="space-y-3">
          {consequences.map(({ level, action }) => (
            <div key={level} className="flex items-center gap-4">
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full w-8 text-center flex-shrink-0">
                {level}
              </span>
              <span className="text-sm text-gray-600">{action}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Per violazioni gravi (contenuti illegali, spam massivo) il ban può essere immediato senza avvisi precedenti.
        </p>
      </div>

      {/* Segnalazioni */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-12">
        <h2 className="font-display font-semibold text-lg mb-2">Hai visto qualcosa di inappropriato?</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          Se noti comportamenti che violano queste regole in un gruppo WhatsApp,
          puoi segnalarlo direttamente agli admin del gruppo tramite messaggio privato,
          oppure contattarci via email.
        </p>
        <a
          href="mailto:ciao@travelclub.it"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-white transition-colors"
        >
          ✉️ Contattaci
        </a>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-8 flex justify-between items-center">
        <p className="text-xs text-gray-400">
          Ultima modifica: maggio 2026
        </p>
        <Link
          href="/destinazioni"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Torna alle destinazioni →
        </Link>
      </div>

    </div>
  )
}
