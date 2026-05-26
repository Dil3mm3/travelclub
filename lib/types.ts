export type Region = 'asia' | 'europa' | 'america' | 'africa' | 'oceania'

export interface WhatsAppGroup {
  id: string
  name: string
  whatsapp_url: string
  member_count: number
  max_members: number
  is_active: boolean
}

export interface Destination {
  id: string
  slug: string
  name: string
  country_code: string       // ISO 3166-1 alpha-2 e.g. "JP"
  flag_emoji: string
  region: Region
  cities: string[]           // ["Tokyo", "Kyoto", "Osaka"]
  tags: string[]             // ["Cultura", "Cibo"]
  member_count: number       // italiani totali che ci hanno viaggiato
  is_trending: boolean
  is_emerging: boolean
  groups: WhatsAppGroup[]
}

export interface Tip {
  id: string
  destination_slug: string
  destination_name: string
  flag_emoji: string
  author_initials: string
  author_name: string
  weeks_ago: number
  content: string
  tags: string[]
  likes: number
  category: 'trasporti' | 'ristoranti' | 'alloggi' | 'sicurezza' | 'cultura' | 'altro'
}

export interface GroupSubmission {
  id: string
  destination_slug: string
  destination_name: string
  group_name: string
  whatsapp_url: string
  submitter_note?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}