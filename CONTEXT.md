# TravelClub — Contesto Progetto

## Overview
Community italiana di viaggiatori, ispirata al modello olandese "dutches".
Il focus è su **gruppi WhatsApp per destinazione** e **consigli di viaggio con link affiliati**.

---

## Stack Tecnico
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth client**: `@supabase/ssr` — `createBrowserClient` per client, `createServerClient` per server
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Mappe**: Leaflet con tile CartoDB Voyager

---

## Struttura File Principali

### `/lib/supabase.ts`
- Usa `createBrowserClient` da `@supabase/ssr`
- Esporta `createClient()` come **funzione** (non singleton)

### `/lib/supabase-server.ts`
- Usa `createServerClient` con `cookies().getAll()` / `setAll()`

### `/middleware.ts`
- Esiste nella root del progetto
- Gestisce il refresh automatico della sessione Supabase

### `/lib/data.ts`
- Importa `createClient` da `./supabase`
- `const supabase = createClient()` all'inizio di ogni funzione
- Funzioni principali: `getDestinations()`, `getDestinationBySlug()`, `getTips()`, `getSiteStats()`
- I gruppi includono `city: g.city ?? undefined` in **entrambe** le funzioni `getDestinations` e `getDestinationBySlug`

### `/lib/utils.ts`
- Contiene `formatMemberCount()` → mostra soglie invece di numeri esatti (es. "100+", "500+")

---

## Componenti Principali

### `DestinazioniClient.tsx`
- Bottone "Entra" nelle card con `WhatsAppIcon` (size=12) prima del testo
- className bottone: `flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-[#25D366] text-white rounded-lg hover:bg-[#1ebe5d] transition-colors shadow-sm`
- Import: `WhatsAppIcon` da `'./WhatsAppIcon'`, `formatMemberCount` da `'@/lib/utils'`

### `DestinationMap.tsx`
- Tile: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`
- Usa `formatMemberCount` per i membri nel popup
- Prop `destinationSlug` per link "proponi gruppo"
- Popup con lista gruppi per città + bottone "Entra" verde
- Fix "Map container already initialized": chiama `.remove()` prima di creare nuova mappa
- `zIndex: 0` sul div contenitore della mappa

### `GroupRow.tsx`
- Usa `formatMemberCount` per soglie membri
- Bottone "Entra" verde `#25D366` con `WhatsAppIcon` (size=13)
- Gestisce 3 stati: `is_active=false` (grigio), `isFull` (rosso), normale (verde)
- Include bottone "Segnala link WhatsApp non funzionante"

### `AdminClient.tsx`
- 3 tab: **In attesa** / **Gruppi** / **Consigli**
- Modifica gruppo: campi `whatsapp_url` e `member_count` (numerico)
- Usa `formatMemberCount` per display
- Funzioni: `clearReports`, `toggleGroupActive`, `deleteGroup`, `deleteTip`
- Badge arancione `report_count` con bottone "Risolto"

### `WhatsAppIcon.tsx`
- Componente SVG per icona WhatsApp
- Prop `size` per dimensione

---

## Pattern Ricorrenti

```ts
// Sempre usare formatMemberCount invece di numeri esatti
import { formatMemberCount } from '@/lib/utils'
formatMemberCount(group.member_count) // → "100+", "500+", ecc.

// Supabase client-side
import { createClient } from '@/lib/supabase'
const supabase = createClient()

// Supabase server-side (Server Components / Route Handlers)
import { createClient } from '@/lib/supabase-server'
const supabase = createClient()
```

---

## Schema Supabase (tabelle principali)
- **destinations**: id, name, slug, country, description, image_url, ...
- **groups**: id, destination_id, city, whatsapp_url, member_count, is_active, report_count, ...
- **tips**: id, destination_id, title, content, affiliate_url, is_approved, ...

---

## Note Importanti
- Non usare singleton per il client Supabase (causa problemi con SSR in Next.js 14)
- `formatMemberCount` va usato **sempre** per mostrare membri — mai il numero grezzo
- Le mappe Leaflet richiedono il fix `.remove()` per evitare "Map container already initialized"
- Il middleware gestisce la sessione: non serve refresh manuale nei componenti
