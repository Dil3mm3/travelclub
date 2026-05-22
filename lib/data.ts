import { supabase } from './supabase'
import { Destination, Tip } from './types'

export async function getDestinations(): Promise<Destination[]> {
  const { data: destinations, error: destError } = await supabase
    .from('destinations')
    .select('*')
    .order('member_count', { ascending: false })

  if (destError || !destinations) return []

  const { data: groups } = await supabase
  .from('whatsapp_groups')
  .select('*')

  return destinations.map(d => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    country_code: d.country_code ?? '',
    flag_emoji: d.flag_emoji,
    region: d.region,
    cities: d.cities ?? [],
    tags: d.tags ?? [],
    member_count: d.member_count,
    is_trending: d.is_trending,
    is_emerging: d.is_emerging,
    groups: (groups ?? [])
    .filter(g => g.destination_id === d.id)
      .map(g => ({
        id: g.id,
        name: g.name,
        whatsapp_url: g.whatsapp_url,
        member_count: g.member_count,
        max_members: g.max_members,
        is_active: g.is_active,
      })),
  }))
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const { data: dest, error: destError } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (destError || !dest) return null

  const { data: groups } = await supabase
    .from('whatsapp_groups')
    .select('*')
    .eq('destination_id', dest.id)

  return {
    id: dest.id,
    slug: dest.slug,
    name: dest.name,
    country_code: dest.country_code ?? '',
    flag_emoji: dest.flag_emoji,
    region: dest.region,
    cities: dest.cities ?? [],
    tags: dest.tags ?? [],
    member_count: dest.member_count,
    is_trending: dest.is_trending,
    is_emerging: dest.is_emerging,
    groups: (groups ?? []).map(g => ({
      id: g.id,
      name: g.name,
      whatsapp_url: g.whatsapp_url,
      member_count: g.member_count,
      max_members: g.max_members,
      is_active: g.is_active,
    })),
  }
}

export async function getTips(destinationSlug?: string): Promise<Tip[]> {
  let query = supabase
    .from('tips')
    .select('*')
    .order('likes', { ascending: false })

  if (destinationSlug) {
    query = query.eq('destination_slug', destinationSlug)
  }

  const { data, error } = await query
  if (error || !data) return []

  return data.map(t => ({
    id: t.id,
    destination_slug: t.destination_slug,
    destination_name: t.destination_name,
    flag_emoji: t.flag_emoji,
    author_initials: t.author_initials,
    author_name: t.author_name,
    weeks_ago: t.weeks_ago,
    content: t.content,
    tags: t.tags ?? [],
    likes: t.likes,
    category: t.category,
  }))
}
