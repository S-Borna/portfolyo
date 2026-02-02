# Portfolyo

En portfolio-builder för svenska YH-studenter och nyexaminerade.

Skapa en professionell portfolio på minuter, inte timmar.

## Snabbstart

```bash
# Klona projektet
git clone https://github.com/your-username/portfolyo.git
cd portfolyo

# Installera dependencies
npm install

# Kopiera environment-variabler
cp .env.example .env.local

# Starta utvecklingsservern
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.

## Vad är Portfolyo?

Portfolyo löser ett problem: YH-studenter har inte tid att bygga portfolios från scratch, och färdiga verktyg passar sällan svenska förhållanden.

Med Portfolyo fyller du i din information genom en guidad process, får hjälp av AI att formulera texter, och publicerar direkt på en personlig URL.

**Funktioner:**

- Guidad onboarding med steg-för-steg-formulär
- AI-genererade texter (via Claude)
- Fyra professionella mallar
- CV-builder med export
- Publik portfolio-sida

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Språk | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Backend | Supabase (Postgres + Auth) |
| AI | Anthropic Claude |
| Hosting | Cloudflare Workers |
| Email | Resend |

## Projektstruktur

```
src/
├── app/                  # Sidor (Next.js App Router)
│   ├── dashboard/        # Användarens dashboard
│   ├── onboarding/       # Guidad registrering
│   ├── portfolio/        # Skapa/redigera portfolio
│   ├── cv/               # CV-builder
│   └── p/[username]/     # Publik portfolio
│
├── components/           # Återanvändbara komponenter
│   ├── ui/               # Buttons, Cards, Inputs
│   └── preview/          # Portfolio-förhandsvisning
│
└── lib/                  # Affärslogik
    ├── store.ts          # Global state (Zustand)
    ├── supabase.ts       # Databas-klient
    ├── ai.ts             # AI-generering
    └── types.ts          # TypeScript-typer
```

## Miljövariabler

Skapa `.env.local` med följande:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Anthropic (för AI-funktioner)
ANTHROPIC_API_KEY=sk-ant-...

# Stripe (valfritt, för betalningar)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Kommandon

```bash
# Utveckling
npm run dev           # Starta dev-server på port 3000

# Bygge
npm run build         # Bygg för produktion
npm run preview       # Förhandsgranska Cloudflare-bygge lokalt

# Deploy
npm run deploy        # Deploya till Cloudflare Workers

# Övrigt
npm run lint          # Kör ESLint
```

## Supabase Setup

1. Skapa ett projekt på [supabase.com](https://supabase.com)
2. Kör SQL-schemat i `supabase/schema.sql`
3. Konfigurera Auth:
   - Aktivera Email auth
   - Sätt Site URL till din domän
   - Konfigurera SMTP för custom emails (valfritt)

## Deploy till Cloudflare

Projektet använder [@opennextjs/cloudflare](https://github.com/opennextjs/opennextjs-cloudflare) för att köra Next.js på Cloudflare Workers.

```bash
# Första gången: logga in
npx wrangler login

# Deploya
npm run deploy
```

Miljövariabler sätts i Cloudflare Dashboard under Workers → Settings → Variables.

## Bidra

Pull requests välkomnas. För större ändringar, öppna först en issue för diskussion.

## Licens

MIT

---

Byggt med ☕ i Sverige
