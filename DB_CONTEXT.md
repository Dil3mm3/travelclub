# TravelClub — Database Context

## Stack
- **Database**: Supabase (PostgreSQL)
- **Auth client**: `@supabase/ssr`
  - Client-side: `createBrowserClient` → `/lib/supabase.ts`
  - Server-side: `createServerClient` → `/lib/supabase-server.ts`

---

## Tabelle

### `destinations`
Tabella principale delle destinazioni. Popolata manualmente.

| Colonna | Tipo | Note |
|---|---|---|
| id | uuid | PK |
| name | text | Es. "Giappone" |
| slug | text | Es. "giappone" — usato nelle URL e come FK testuale |
| country | text | |
| description | text | |
| image_url | text | |
| ... | | |

> Attualmente 39 destinazioni nel DB.

---

### `whatsapp_groups`
I gruppi WhatsApp per destinazione. `is_full` è **derivato** (non è una colonna).

| Colonna | Tipo | Note |
|---|---|---|
| id | uuid | PK |
| destination_id | uuid | FK → `destinations.id` |
| name | text | Es. "Giappone 2026 — Generale" |
| whatsapp_url | text | Link invito WhatsApp |
| member_count | integer | Numero attuale membri |
| max_members | integer | Limite massimo membri |
| is_active | boolean | Se false → gruppo disattivato (grigio nell'UI) |
| city | text | Città specifica o "Generale" |
| created_at | timestamptz | |

**`is_full`** = `member_count >= max_members` — calcolato lato app, non esiste come colonna.

Le **segnalazioni** di link non funzionanti sono in tabella separata `link_reports` (non esiste `report_count` su questa tabella).

---

### `tips`
Consigli di viaggio della community. Usa `destination_slug` diretto, **nessuna FK** verso `destinations`.

| Colonna | Tipo | Note |
|---|---|---|
| id | uuid | PK |
| destination_slug | text | Es. "giappone" — diretto, no FK |
| destination_name | text | Es. "Giappone" |
| flag_emoji | text | Es. "🇯🇵" |
| author_initials | text | Es. "MR" |
| author_name | text | Es. "Marco R." |
| weeks_ago | integer | Settimane fa (non una data calcolata) |
| content | text | Testo del consiglio |
| tags | text[] | Array, es. `ARRAY['Trasporti','Pratico']` |
| likes | integer | |
| category | text | Valori: `'trasporti'` `'ristoranti'` `'alloggi'` `'sicurezza'` `'cultura'` `'altro'` |
| created_at | timestamptz | |

**Colonne che NON esistono** (attenzione): `title`, `city`, `is_approved`, `affiliate_url`.

---

### `tip_submissions`
Consigli proposti dagli utenti in attesa di approvazione (moderazione admin).

---

### `group_submissions`
Proposte di nuovi gruppi WhatsApp in attesa di approvazione (moderazione admin).

---

### `link_reports`
Segnalazioni di link WhatsApp non funzionanti. Separata da `whatsapp_groups`.

---

## Pattern SQL comuni

```sql
-- Gruppi per destinazione
SELECT * FROM whatsapp_groups
WHERE destination_id = (SELECT id FROM destinations WHERE slug = 'giappone')
AND is_active = true;

-- is_full derivato
SELECT *, (member_count >= max_members) AS is_full
FROM whatsapp_groups;

-- Tip per destinazione
SELECT * FROM tips
WHERE destination_slug = 'giappone'
ORDER BY likes DESC;

-- Inserire un tip
INSERT INTO tips (destination_slug, destination_name, flag_emoji, author_initials, author_name, weeks_ago, content, tags, likes, category)
VALUES ('giappone', 'Giappone', '🇯🇵', 'MR', 'Marco R.', 1, '...', ARRAY['Trasporti','Pratico'], 0, 'trasporti');

-- Inserire un gruppo
INSERT INTO whatsapp_groups (destination_id, name, city, whatsapp_url, member_count, max_members, is_active)
VALUES ((SELECT id FROM destinations WHERE slug='giappone'), 'Giappone 2026 — Generale', 'Generale', 'https://chat.whatsapp.com/...', 500, 1000, true);
```

---

## Note importanti

- **Non usare singleton** per il client Supabase (causa problemi SSR in Next.js 14) — sempre `createClient()` come funzione
- **`formatMemberCount()`** in `/lib/utils.ts` va usato sempre per mostrare `member_count` — mai il numero grezzo
- **`is_full`** non è una colonna: calcolarlo sempre come `member_count >= max_members`
- **`tips.destination_slug`** è un testo libero, non una FK — può esistere anche senza una riga in `destinations`
- Le **segnalazioni** link sono in `link_reports`, non in `whatsapp_groups`
