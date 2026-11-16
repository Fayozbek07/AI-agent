# Biznes CRM (Next.js + Supabase)

Koʻp tashkilotli (multi-tenant) SaaS boshlangʻich loyihasi: login, tashkilot yaratish, mijozlar va bronlar. Maʼlumot himoyasi Supabase Row Level Security (RLS) orqali.

## Ishga tushirish
1. supabase.com da yangi loyiha yarating.
2. SQL Editor ga `supabase/schema.sql` ni qoʻyib ishga tushiring.
3. `.env.local.example` ni `.env.local` deb nusxalang va Project Settings → API dagi URL va anon key ni yozing.
4. `npm install` keyin `npm run dev` → http://localhost:3000
5. Test uchun Authentication → Providers → Email da "Confirm email" ni oʻchirib qoʻyishingiz mumkin.

## Vercel ga joylash
Repozitoriyni GitHub ga yuklang, vercel.com da import qiling va ikkala env oʻzgaruvchini qoʻying.

## Keyingi qadamlar
- Xodimlarni taklif qilish va rollar (owner/member)
- Toʻlov va tariflar (Stripe)
- Dashboardni sahifalarga boʻlish, qidiruv, eksport
