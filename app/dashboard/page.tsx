import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { addBooking, addClient, createOrg, deleteClient, setBookingStatus, signOut } from './actions'

const STATUS: Record<string, string> = { pending: 'Kutilmoqda', done: 'Bajarildi', cancelled: 'Bekor qilindi' }

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: m } = await supabase
    .from('members').select('org_id, organizations(name)').eq('user_id', user.id).limit(1).maybeSingle()

  if (!m) {
    return (
      <main className="wrap" style={{ maxWidth: 460 }}>
        <div className="card">
          <h1>Tashkilot yarating</h1>
          <p className="mute">Biznesingiz yoki klinikangiz nomini kiriting.</p>
          <form action={createOrg} className="inline">
            <input name="name" placeholder="Tashkilot nomi" required />
            <button type="submit">Yaratish</button>
          </form>
        </div>
      </main>
    )
  }

  const orgId = m.org_id as string
  const org = m.organizations as unknown as { name: string } | null
  const [{ data: clients }, { data: bookings }] = await Promise.all([
    supabase.from('clients').select('*').eq('org_id', orgId).order('created_at', { ascending: false }),
    supabase.from('bookings').select('*, clients(name)').eq('org_id', orgId).order('starts_at'),
  ])

  return (
    <main className="wrap">
      <div className="bar">
        <h1>{org?.name ?? 'Tashkilot'}</h1>
        <form action={signOut}><button className="ghost" type="submit">Chiqish</button></form>
      </div>

      <div className="card">
        <h2>Bronlar</h2>
        {clients && clients.length > 0 ? (
          <form action={addBooking} className="inline">
            <input type="hidden" name="org_id" value={orgId} />
            <select name="client_id" required>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="datetime-local" name="starts_at" required />
            <input name="service" placeholder="Xizmat" />
            <button type="submit">Bron qoʻshish</button>
          </form>
        ) : <p className="mute">Bron qoʻshish uchun avval mijoz qoʻshing.</p>}
        {(bookings ?? []).map(b => {
          const c = b.clients as unknown as { name: string } | null
          return (
            <div className="row" key={b.id}>
              <span><b>{c?.name}</b> <span className="mute">{b.service}</span><br />
                <span className="mute">{new Date(b.starts_at).toLocaleString('uz')}</span></span>
              <form action={setBookingStatus} className="inline">
                <input type="hidden" name="id" value={b.id} />
                <select name="status" defaultValue={b.status}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button className="ghost" type="submit">Saqlash</button>
              </form>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h2>Mijozlar</h2>
        <form action={addClient} className="inline">
          <input type="hidden" name="org_id" value={orgId} />
          <input name="name" placeholder="Ism" required />
          <input name="phone" placeholder="Telefon" />
          <input name="note" placeholder="Izoh" />
          <button type="submit">Mijoz qoʻshish</button>
        </form>
        {(clients ?? []).map(c => (
          <div className="row" key={c.id}>
            <span><b>{c.name}</b> <span className="mute">{c.phone} {c.note}</span></span>
            <form action={deleteClient}>
              <input type="hidden" name="id" value={c.id} />
              <button className="ghost" type="submit">Oʻchirish</button>
            </form>
          </div>
        ))}
      </div>
    </main>
  )
}
