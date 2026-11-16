'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const s = (f: FormData, k: string) => String(f.get(k) ?? '').trim()

export async function createOrg(f: FormData) {
  const supabase = await createClient()
  const name = s(f, 'name')
  if (name) await supabase.rpc('create_organization', { org_name: name })
  revalidatePath('/dashboard')
}

export async function addClient(f: FormData) {
  const supabase = await createClient()
  const name = s(f, 'name')
  if (!name) return
  await supabase.from('clients').insert({ org_id: s(f, 'org_id'), name, phone: s(f, 'phone'), note: s(f, 'note') })
  revalidatePath('/dashboard')
}

export async function deleteClient(f: FormData) {
  const supabase = await createClient()
  await supabase.from('clients').delete().eq('id', s(f, 'id'))
  revalidatePath('/dashboard')
}

export async function addBooking(f: FormData) {
  const supabase = await createClient()
  const starts = s(f, 'starts_at')
  if (!starts || !s(f, 'client_id')) return
  await supabase.from('bookings').insert({
    org_id: s(f, 'org_id'), client_id: s(f, 'client_id'),
    starts_at: new Date(starts).toISOString(), service: s(f, 'service'),
  })
  revalidatePath('/dashboard')
}

export async function setBookingStatus(f: FormData) {
  const supabase = await createClient()
  await supabase.from('bookings').update({ status: s(f, 'status') }).eq('id', s(f, 'id'))
  revalidatePath('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
