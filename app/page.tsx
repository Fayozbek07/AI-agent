import Link from 'next/link'

export default function Home() {
  return (
    <main className="wrap">
      <h1>Biznes CRM</h1>
      <p className="mute">Mijozlaringiz va bronlaringizni bir joyda boshqaring. Har bir tashkilot ma’lumoti alohida va himoyalangan.</p>
      <p><Link href="/login">Kirish yoki roʻyxatdan oʻtish</Link></p>
    </main>
  )
}
