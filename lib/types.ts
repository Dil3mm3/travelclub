export type Region = 'asia' | 'europa' | 'america' | 'africa' | 'oceania'

export interface WhatsAppGroup {
  id: string
  name: string
  whatsapp_url: string
  member_count: number
  max_members: number
  is_active: boolean
  report_count?: number
}

export interface Destination {
  id: string
  slug: string
  name: string
  country_code: string
  flag_emoji: string
  region: Region
  cities: string[]
  tags: string[]
  member_count: number
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

export interface TipSubmission {
  id: string
  destination_slug: string
  destination_name: string
  flag_emoji: string
  author_name: string
  content: string
  tags: string[]
  category: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}