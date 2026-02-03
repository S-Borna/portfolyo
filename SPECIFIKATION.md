# Portfolyo - Teknisk Specifikation & Arkitektur

> Ett komplett lärande dokument för att förstå appens uppbyggnad från grunden.

---

## Innehållsförteckning

1. [Vad är Portfolyo?](#vad-är-portfolyo)
2. [Varför byggdes den?](#varför-byggdes-den)
3. [Teknikstack](#teknikstack)
4. [Projektstruktur](#projektstruktur)
5. [Template-systemet](#template-systemet) ⭐ NY
6. [Autentisering](#autentisering)
7. [State Management](#state-management)
8. [Databasmodell](#databasmodell)
9. [AI-integration](#ai-integration)
10. [Deployment & Hosting](#deployment--hosting)
11. [Nuvarande funktioner](#nuvarande-funktioner)
12. [Flöden i appen](#flöden-i-appen)
13. [Framtida utveckling](#framtida-utveckling)

---

## Vad är Portfolyo?

Portfolyo är en webbaserad portfolio-builder riktad mot svenska YH-studenter och nyexaminerade. Målet är att göra det enkelt att skapa professionella portfolios och CV:n utan att behöva kunna webbutveckling.

Tänk dig Linktree, fast för din karriär. En sida, din egen URL, all din information samlad.

**Vision:** Varje student ska kunna visa upp sitt bästa jag på 5 minuter.

---

## Varför byggdes den?

Problemet vi löser:

1. **YH-studenter har dåligt med tid** - LIA-perioder, deadlines, jobb vid sidan av
2. **De flesta portfolios är halvdana** - Antingen för simpla eller aldrig färdiga
3. **CV-verktyg suger** - Word-dokument som ser ut som 2005
4. **GitHub-profiler räcker inte** - Rekryterare vill se mer än kod

Lösningen: En guided onboarding där du fyller i din info och AI hjälper dig formulera det professionellt. Sen publiceras det direkt på en personlig URL.

---

## Teknikstack

### Frontend

| Teknologi | Syfte | Varför vi valde det |
|-----------|-------|---------------------|
| **Next.js 15** | React-ramverk med App Router | Server components, bra SEO, snabb |
| **TypeScript** | Typat JavaScript | Färre buggar, bättre autocomplete |
| **Tailwind CSS** | Utility-first CSS | Snabb styling, konsekvent design |
| **Framer Motion** | Animationer | Smooth UI, professionell känsla |
| **Zustand** | State management | Lättare än Redux, persistent state |
| **Lucide React** | Ikoner | Konsekvent, snygg ikonset |

### Backend

| Teknologi | Syfte | Varför vi valde det |
|-----------|-------|---------------------|
| **Supabase** | Databas + Auth | Gratis tier, Postgres, inbyggd auth |
| **Cloudflare Workers** | Hosting | Edge deployment, gratis, snabb |
| **Resend** | Email | Bra deliverability, gratis tier |

### AI

| Teknologi | Syfte |
|-----------|-------|
| **Anthropic Claude** | Generera portfolio-texter, CV-formuleringar |

### Infrastruktur

| Teknologi | Syfte |
|-----------|-------|
| **Cloudflare DNS** | Domänhantering för portfolyo.se |
| **OpenNext** | Adapter för Next.js → Cloudflare Workers |

---

## Projektstruktur

```
portfolyo/
├── src/
│   ├── app/                    # Next.js App Router - alla sidor
│   │   ├── page.tsx            # Landing page (/)
│   │   ├── login/              # Inloggningssida
│   │   ├── register/           # Registreringssida
│   │   ├── verify-email/       # "Kolla din mail"-sida
│   │   ├── auth/callback/      # Hanterar email-bekräftelse
│   │   ├── dashboard/          # Användarens dashboard
│   │   ├── onboarding/         # Guidad registrering
│   │   ├── portfolio/          # Skapa/redigera portfolio
│   │   ├── cv/                 # Skapa/redigera CV
│   │   ├── p/[username]/       # Publik portfolio-sida
│   │   ├── upgrade/            # Betalplaner
│   │   └── api/                # API-routes (AI-generering)
│   │
│   ├── components/             # Återanvändbara komponenter
│   │   ├── ui/                 # Buttons, Cards, Inputs etc
│   │   └── preview/            # Portfolio-förhandsvisning
│   │
│   ├── lib/                    # Affärslogik & utilities
│   │   ├── store.ts            # Zustand store (global state)
│   │   ├── supabase.ts         # Supabase-klient
│   │   ├── types.ts            # TypeScript-typer
│   │   ├── ai.ts               # AI-generering med Claude
│   │   ├── utils.ts            # Hjälpfunktioner
│   │   └── templates/          # Portfolio-mallar
│   │
│   └── middleware.ts           # Subdomän-routing
│
├── supabase/
│   └── schema.sql              # Databasschema
│
├── email-templates/            # HTML-mallar för Supabase emails
│
├── public/                     # Statiska filer
│
└── Konfigurationsfiler
    ├── next.config.mjs         # Next.js-konfiguration
    ├── tailwind.config.js      # Tailwind-inställningar
    ├── wrangler.jsonc          # Cloudflare Workers-config
    └── open-next.config.ts     # OpenNext-adapter
```

---

## Template-systemet

> ⚠️ **VIKTIGT:** Se även `src/lib/templates/ARCHITECTURE.md` för teknisk detalj.

### Grundprincip

Alla templates bygger på **EN FAST DESIGN** - saidborna.com för portfolio och ditt CV för CV.
Det enda som skiljer templates åt är **FÄRGERNA**. Layouten är identisk.

### Benchmark-design

| Typ | Benchmark | Layout |
|-----|-----------|--------|
| **Portfolio** | saidborna.com | Split-hero, floating orbs, projekt-grid |
| **CV** | Ditt CV | Sidebar (vänster) + Main content (höger) |

### Filer och ansvar

```
src/lib/templates/
├── ARCHITECTURE.md          # ⭐ Dokumentation av systemet
├── cv-renderer-v2.ts        # ✅ CANONICAL - Renderar CV HTML
├── portfolio-renderer-v2.ts # ✅ CANONICAL - Renderar Portfolio HTML
├── templates.ts             # Portfolio template-definitioner
├── effects.ts               # Animationer, färgscheman
├── index.ts                 # Central export
│
├── cv-renderer.ts           # ❌ DEPRECATED - använd v2
├── portfolio-renderer.ts    # ❌ DEPRECATED - använd v2
└── renderer.ts              # ❌ DEPRECATED
```

### Template-varianter

**CV (50 varianter)** - Alla använder sidebar-layout:

- Said Dark, Said Light, Said Navy, Said Forest
- Tom Ford Collection (Noir Extreme, Oud Wood, etc.)
- Executive Collection
- Mer...

**Portfolio (100 varianter)** - Alla använder saidborna.com-design:

- DevOps Crimson, Deep Ocean, Matrix Code
- Designer Collection
- Minimal Collection
- Mer...

### Hur templates fungerar

```
┌─────────────────────────────────────────┐
│        CV_TEMPLATES_V2 / PORTFOLIO_TEMPLATES_V2        │
│        (Definierar färger + metadata)                   │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│        renderCVV2() / renderPortfolioV2()              │
│        (Genererar HTML med vald färg)                  │
│        Layout är ALLTID samma                           │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│        Slutresultat: HTML/PDF                          │
│        (Samma struktur, olika färger)                  │
└─────────────────────────────────────────┘
```

### Vid ändringar

| Vad du vill ändra | Var du gör det |
|-------------------|----------------|
| Ny färgvariant CV | `cv-renderer-v2.ts` → `CV_TEMPLATES_V2` |
| Ny färgvariant Portfolio | `portfolio-renderer-v2.ts` → `PORTFOLIO_TEMPLATES_V2` |
| Ändra CV-layout | `cv-renderer-v2.ts` → `renderCVV2()` |
| Ändra Portfolio-layout | `portfolio-renderer-v2.ts` → `renderPortfolioV2()` |
| Preview i templates-sidan | `src/app/templates/page.tsx` (hårdkodad till din design) |

### Viktiga regler

1. **Lägg ALDRIG till nya layout-typer** - Alla CV = sidebar, alla Portfolio = split-hero
2. **Endast V2-filer är aktiva** - Ignorera filer utan `-v2`
3. **Färger definieras EN gång** - I `*_TEMPLATES_V2` arrays
4. **Preview matchar slutresultat** - Samma struktur överallt

---

## Autentisering

Vi använder **Supabase Auth** med email-bekräftelse via **Resend SMTP**.

### Flödet steg för steg

1. **Användare registrerar sig** (`/register`)
   - Fyller i email + lösenord
   - `supabase.auth.signUp()` anropas med `emailRedirectTo`

2. **Supabase skickar bekräftelsemail**
   - Via Resend SMTP (portfolyo.se domän)
   - Egen HTML-template med Portfolyo-branding
   - Länk innehåller `token_hash`

3. **Användare klickar på länken**
   - Landar på `/auth/callback?token_hash=xxx&type=email`

4. **Callback-sidan verifierar**
   - `supabase.auth.verifyOtp({ token_hash, type: 'signup' })`
   - Skapar session
   - Sparar användare i Zustand store
   - Redirectar till `/dashboard`

### Konfiguration

**Supabase Dashboard:**

- Site URL: `https://portfolyo.se`
- Redirect URLs: `https://portfolyo.se/**`
- SMTP: Resend (smtp.resend.com:587)

**Miljövariabler (Cloudflare):**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## State Management

Vi använder **Zustand** med persist-middleware för att spara state i localStorage.

### Storestruktur (`src/lib/store.ts`)

```typescript
interface PortfolyoStore {
  // Autentisering
  user: User | null;
  isAuthenticated: boolean;

  // Data
  portfolios: Portfolio[];
  cvs: CV[];

  // Onboarding
  onboarding: OnboardingData;

  // Actions
  login: (user) => void;
  logout: () => void;
  createPortfolio: (data) => Portfolio;
  updatePortfolio: (id, updates) => void;
  // ... fler actions
}
```

### Varför Zustand?

1. **Enkelt** - Ingen boilerplate som Redux
2. **Persistens** - Inbyggd localStorage-sync
3. **TypeScript** - Bra typstöd
4. **Litet** - 1.5kb gzipped

### Användning i komponenter

```tsx
const { user, portfolios, createPortfolio } = usePortfolyoStore();
```

---

## Databasmodell

### Supabase-tabeller

**profiles** - Utökar Supabase auth.users

```sql
- id (UUID, FK → auth.users)
- email
- full_name
- avatar_url
- subscription_tier ('free' | 'pro' | 'team')
- credits
- created_at
```

**portfolios** - Användarnas portfolios

```sql
- id (UUID)
- user_id (FK → profiles)
- username (slug för URL)
- template_id
- title, tagline, bio
- profile_data (JSONB)
- projects (JSONB[])
- skills (JSONB[])
- status ('draft' | 'published')
- created_at, updated_at
```

### Row Level Security (RLS)

Varje tabell har RLS aktiverat:

- Användare kan bara se/ändra sin egen data
- `auth.uid() = user_id` i alla policies

---

## AI-integration

### Claude API (`src/lib/ai.ts`)

Vi använder Anthropic Claude för att generera texter.

**Tillgängliga genereringstyper:**

- `bio` - Om mig-texter
- `project-description` - Projektbeskrivningar
- `achievement` - CV bullet points
- `cv-summary` - CV-sammanfattningar
- `full-portfolio` - Komplett portfolio-content
- `rewrite` - Förbättra befintlig text

**System prompt (förkortad):**

```
Du är expert på portfolio/CV-content för svenska studenter.
- Skriv på svenska
- Använd konkreta siffror
- Aktiva verb: "Byggde", "Ledde", "Implementerade"
- Max 2 meningar per punkt
- Fokusera på VALUE och IMPACT
```

### API Route (`/api/ai/generate`)

Frontend anropar denna endpoint:

```typescript
POST /api/ai/generate
{
  type: 'bio',
  context: { namn, roll, erfarenhet, ... },
  tone: 'professional',
  length: 'medium'
}
```

---

## Deployment & Hosting

### Cloudflare Workers via OpenNext

Next.js körs inte direkt på Cloudflare. Vi använder **@opennextjs/cloudflare** som adapter.

**Build-process:**

1. `next build` - Bygger Next.js
2. OpenNext transformerar till Cloudflare Worker-format
3. Statiska filer → Cloudflare Assets
4. Server-kod → Cloudflare Worker

**Deploy:**

```bash
npm run deploy
# = opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

### Miljövariabler

**Lokalt:** `.env.local` och `.dev.vars`
**Produktion:** Cloudflare Dashboard → Workers → Settings → Variables

---

## Nuvarande funktioner

### ✅ Implementerat

**Autentisering**

- [x] Registrering med email
- [x] Email-bekräftelse (custom template)
- [x] Inloggning
- [x] Utloggning
- [x] Session-hantering

**Portfolio**

- [x] Dashboard med översikt
- [x] Onboarding-flöde
- [x] Skapa portfolio
- [x] 100 templates (färgvarianter av saidborna.com-design)
- [x] Publik portfolio-sida
- [x] Template-galleri med preview

**CV**

- [x] CV-builder
- [x] 50 templates (färgvarianter av din CV-design)
- [x] Sidebar-layout (konsekvent)
- [x] Template preview med riktigt innehåll

**AI**

- [x] Generera bio-texter
- [x] Generera projektbeskrivningar
- [x] Omskrivning av text

**Template-system** ⭐ NY

- [x] Konsoliderat till V2 (single source of truth)
- [x] ARCHITECTURE.md dokumentation
- [x] Alla CV = sidebar-layout
- [x] Alla Portfolio = saidborna.com-design
- [x] Preview visar riktigt innehåll (namn, bilder, etc.)

### 🔄 Under utveckling

- [ ] Subdomäner (said.portfolyo.se)
- [ ] Stripe-betalning
- [ ] Analytics
- [ ] PDF-export av CV

---

## Flöden i appen

### Registreringsflöde

```
1. Landing page (/)
   └─> Klicka "Kom igång"

2. Register (/register)
   └─> Fyll i email + lösenord
   └─> Klicka "Skapa konto"

3. Verify Email (/verify-email)
   └─> "Kolla din inkorg"

4. Email-bekräftelse (externt)
   └─> Klicka länk i mailet

5. Auth Callback (/auth/callback)
   └─> Verifierar token
   └─> Skapar session

6. Dashboard (/dashboard)
   └─> Välkommen! Skapa din första portfolio.
```

### Portfolio-skapande

```
1. Dashboard
   └─> Klicka "Skapa portfolio"

2. Onboarding (/onboarding)
   └─> Steg 1: Grundinfo (namn, roll, etc)
   └─> Steg 2: Erfarenhet
   └─> Steg 3: Projekt
   └─> Steg 4: Skills
   └─> Steg 5: Välj mall
   └─> Steg 6: Förhandsvisning

3. Portfolio sparas
   └─> Redirectas till dashboard

4. Publicera
   └─> Portfolio live på portfolyo.se/p/username
```

---

## Framtida utveckling

### Kort sikt

- Subdomäner (användarnamn.portfolyo.se)
- PDF-export av CV
- Bilduppladdning

### Medel sikt

- Stripe-integration för premium
- Analytics (besökare, klick)
- A/B-testning av portfolios

### Lång sikt

- Custom domains
- Fler mallar
- Team-funktioner (för skolor)
- API för integrationer

---

## Sammanfattning

Portfolyo är byggt med modern tech för att vara:

1. **Snabb** - Edge deployment, optimerade assets
2. **Skalbar** - Serverless, inga servrar att underhålla
3. **Billig** - Gratis tier på alla tjänster räcker långt
4. **Säker** - Supabase RLS, HTTPS överallt

Arkitekturen är enkel: Next.js frontend → Supabase backend → Cloudflare hosting.

AI-delen är "nice to have" men inte kritisk. Appen fungerar utan den.

---

*Senast uppdaterad: 3 februari 2026*
