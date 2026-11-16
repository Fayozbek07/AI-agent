import './globals.css'

export const metadata = { title: 'Biznes CRM', description: 'Mijozlar va bronlarni boshqarish' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}
