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

  const [{ data: groupSubmissions }, { data: tipSubmissions }] = await Promise.all([
    supabase.from('group_submissions').select('*').order('created_at', { ascending: false }),
    supabase.from('tip_submissions').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <AdminClient
      groupSubmissions={groupSubmissions ?? []}
      tipSubmissions={tipSubmissions ?? []}
    />
  )
}
