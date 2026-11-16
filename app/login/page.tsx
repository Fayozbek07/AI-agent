'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    const supabase = createClient()
    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return setMsg(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) return setMsg(error.message)
      if (!data.session) return setMsg('Emailingizga tasdiqlash xati yuborildi. Tasdiqlab, keyin kiring.')
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="wrap" style={{ maxWidth: 420 }}>
      <div className="card">
        <h1>{mode === 'in' ? 'Kirish' : 'Roʻyxatdan oʻtish'}</h1>
        <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Parol (kamida 6 belgi)" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">{mode === 'in' ? 'Kirish' : 'Roʻyxatdan oʻtish'}</button>
        </form>
        {msg && <p className="err" role="alert">{msg}</p>}
        <p className="mute">
          {mode === 'in' ? 'Akkaunt yoʻqmi? ' : 'Akkaunt bormi? '}
          <a href="#" onClick={e => { e.preventDefault(); setMode(mode === 'in' ? 'up' : 'in') }}>
            {mode === 'in' ? 'Roʻyxatdan oʻting' : 'Kiring'}
          </a>
        </p>
      </div>
    </main>
  )
}
