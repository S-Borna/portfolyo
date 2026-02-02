# Supabase E-postbekräftelse - Konfiguration

## 1. Aktivera E-postbekräftelse

1. Gå till [Supabase Dashboard](https://supabase.com/dashboard/project/bguvmisxpvjrbbeglrul)
2. Navigera till **Authentication** → **Providers** → **Email**
3. Se till att **"Confirm email"** är aktiverad ✅

## 2. Konfigurera Email Templates

### A. Confirm Signup (Bekräfta registrering)

1. Gå till **Authentication** → **Email Templates** → **Confirm signup**
2. Kopiera innehållet från `email-templates/confirm-signup.html`
3. Klistra in i template-editorn
4. Klicka **Save**

**Viktigt:** Supabase ersätter automatiskt dessa variabler:

- `{{ .ConfirmationURL }}` - Bekräftelselänk
- `{{ .Email }}` - Mottagarens e-post
- `{{ .Token }}` - Token för manuell verifiering (om behövs)

### B. Magic Link (Lösenordslös inloggning)

1. Gå till **Email Templates** → **Magic Link**
2. Kopiera innehållet från `email-templates/magic-link.html`
3. Klistra in och spara

### C. Reset Password (Återställ lösenord)

1. Gå till **Email Templates** → **Reset Password**
2. Kopiera innehållet från `email-templates/password-reset.html`
3. Klistra in och spara

## 3. Konfigurera Avsändare (VIKTIGT!)

### Ändra "From" namn och e-post

1. Gå till **Settings** → **Authentication**
2. Scrolla till **SMTP Settings**

**För testning (Supabase's inbyggda email):**

- Du kan **inte** ändra avsändaren med Supabase's gratis email
- Det kommer fortfarande säga "<noreply@mail.supabase.io>"
- Begränsning: Max 4 mail/timme

**För produktion (Egen SMTP - REKOMMENDERAS):**

### Option 1: SendGrid (Gratis tier: 100 mail/dag)

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: <your-sendgrid-api-key>
Sender email: noreply@portfolyo.se
Sender name: Portfolyo
```

**Steg för SendGrid:**

1. Skapa konto på [sendgrid.com](https://sendgrid.com)
2. Gå till Settings → API Keys → Create API Key
3. Verifiera din domän (portfolyo.se) under Sender Authentication
4. Lägg till API-nyckeln i Supabase SMTP Settings

### Option 2: Resend (Bra för utvecklare)

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: <your-resend-api-key>
Sender email: noreply@portfolyo.se
Sender name: Portfolyo
```

**Steg för Resend:**

1. Skapa konto på [resend.com](https://resend.com)
2. Verifiera din domän
3. Skapa API Key
4. Lägg till i Supabase

### Option 3: AWS SES (Billigast för stora volymer)

```
SMTP Host: email-smtp.eu-north-1.amazonaws.com
SMTP Port: 587
SMTP User: <your-smtp-username>
SMTP Password: <your-smtp-password>
Sender email: noreply@portfolyo.se
Sender name: Portfolyo
```

## 4. Domänverifiering

För att skicka från din egen domän (@portfolyo.se):

1. Lägg till SPF record i DNS:

```
TXT @ "v=spf1 include:sendgrid.net ~all"
```

1. Lägg till DKIM records (från din SMTP-leverantör)

2. Lägg till DMARC record:

```
TXT _dmarc "v=DMARC1; p=none; rua=mailto:postmaster@portfolyo.se"
```

## 4. Test-flöde

1. Registrera ny användare på `/register`
2. Användaren redirectas till `/verify-email` med sitt email
3. Användaren får ett bekräftelsemail
4. Klickar på länken i mailet
5. Redirectas till `/auth/callback` → verifiera session → `/dashboard`

## 5. Felhantering

Systemet hanterar nu:

- ✅ E-postbekräftelse krävs → visar verify-email sida
- ✅ Försök logga in med obekräftad email → redirect till verify-email
- ✅ Möjlighet att skicka om bekräftelsemail
- ✅ Tydliga felmeddelanden

## 6. Cloudflare Pages Environment Variables

Se till att dessa är satta i Cloudflare Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://bguvmisxpvjrbbeglrul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<din-anon-key>
```

## 7. Lokal Utveckling

Din `.env.local` är redan konfigurerad ✅

För att testa e-postbekräftelse lokalt:

- Använd Supabase's inbyggda email gateway (begränsad)
- Eller konfigurera MailTrap/Mailtrap för dev-testning

## Troubleshooting

**Problem**: "Email not confirmed" error

- **Lösning**: Kolla Supabase → Authentication → Users om emailen är verified

**Problem**: Får inget bekräftelsemail

- **Lösning**:
  1. Kolla skräppost
  2. Verifiera SMTP-konfiguration
  3. Kolla Supabase logs under Authentication → Logs

**Problem**: Callback URL funkar inte

- **Lösning**: Verifiera att `/auth/callback` är i Redirect URLs listan
