import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminClient from '@/components/AdminClient'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect('/')
  }

  const [
    { data: groupSubmissions },
    { data: tipSubmissions },
    { data: activeGroups },
    { data: publishedTips },
    { data: destinations },
    { data: linkReports },
  ] = await Promise.all([
    supabase.from('group_submissions').select('*').order('created_at', { ascending: false }),
    supabase.from('tip_submissions').select('*').order('created_at', { ascending: false }),
    supabase.from('whatsapp_groups').select('*').order('created_at', { ascending: false }),
    supabase.from('tips').select('*').order('created_at', { ascending: false }),
    supabase.from('destinations').select('id, slug, name, flag_emoji'),
    supabase.from('link_reports').select('*').order('created_at', { ascending: false }),
  ])

  // Arricchisci i gruppi con nome, flag e conteggio segnalazioni
  const destMap = Object.fromEntries((destinations ?? []).map(d => [d.id, d]))
  const reportCountMap: Record<string, number> = {}
  ;(linkReports ?? []).forEach(r => {
    reportCountMap[r.group_id] = (reportCountMap[r.group_id] ?? 0) + 1
  })
  const enrichedGroups = (activeGroups ?? []).map(g => ({
    ...g,
    destination_name: destMap[g.destination_id]?.name ?? '',
    destination_flag: destMap[g.destination_id]?.flag_emoji ?? '',
    report_count: reportCountMap[g.id] ?? 0,
  }))

  return (
    <AdminClient
      groupSubmissions={groupSubmissions ?? []}
      tipSubmissions={tipSubmissions ?? []}
      activeGroups={enrichedGroups}
      publishedTips={publishedTips ?? []}
    />
  )
}
