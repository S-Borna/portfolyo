# 🛡️ Cloudflare Security Configuration

## Rekommenderade inställningar för PORTFOLYO.SE

---

## 1. SSL/TLS

**Security → SSL/TLS → Overview**
- Encryption mode: **Full (strict)** ✅
- Edge Certificates: Aktivera alla

**Security → SSL/TLS → Edge Certificates**
- Always Use HTTPS: **ON** ✅
- Automatic HTTPS Rewrites: **ON** ✅
- Minimum TLS Version: **TLS 1.2** ✅
- TLS 1.3: **ON** ✅

---

## 2. Security Settings

**Security → Settings**
- Security Level: **High** (eller Medium i början)
- Challenge Passage: **30 minutes**
- Browser Integrity Check: **ON** ✅

---

## 3. WAF (Web Application Firewall)

**Security → WAF**

### Managed Rules
Aktivera dessa rulesets:
- ✅ Cloudflare Managed Ruleset
- ✅ Cloudflare OWASP Core Ruleset
- ✅ Cloudflare Leaked Credentials Check

### Custom Rules
Skapa följande regler:

#### Rule 1: Block Bad Bots
```
Name: Block Known Bad Bots
Expression: (cf.client.bot) or (http.user_agent contains "curl") or (http.user_agent contains "wget") or (http.user_agent contains "python") or (http.user_agent contains "scrapy")
Action: Block
```

#### Rule 2: Block DevTools/Scraping Countries (optional)
```
Name: Challenge Suspicious Regions
Expression: (ip.geoip.country in {"RU" "CN" "KP"})
Action: Managed Challenge
```

#### Rule 3: Rate Limit API
```
Name: API Rate Limit
Expression: (starts_with(http.request.uri.path, "/api/"))
Action: Rate Limit (10 requests/minute)
```

#### Rule 4: Block Source Map Requests
```
Name: Block Source Maps
Expression: (http.request.uri.path contains ".map")
Action: Block
```

---

## 4. Bots

**Security → Bots**

### Bot Fight Mode
- **ON** ✅ (tillgängligt på alla planer)

### Super Bot Fight Mode (Pro+)
- Definitely Automated: **Block**
- Likely Automated: **Managed Challenge**
- Verified Bots: **Allow**

---

## 5. DDoS Protection

**Security → DDoS**
- HTTP DDoS attack protection: **ON** (automatisk)
- Sensitivity: **High**

---

## 6. Page Rules / Configuration Rules

**Rules → Configuration Rules**

### Rule 1: Cache Static Assets
```
Expression: (http.request.uri.path contains "/_next/static/")
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 year
```

### Rule 2: Security for API Routes
```
Expression: (starts_with(http.request.uri.path, "/api/"))
Settings:
  - Security Level: High
  - Disable Apps
  - Disable Performance
```

### Rule 3: Cache Images
```
Expression: (http.request.uri.path contains "/images/") or (http.request.uri.path contains ".png") or (http.request.uri.path contains ".svg")
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 week
```

---

## 7. Scrape Shield

**Security → Scrape Shield**

- Email Address Obfuscation: **ON** ✅
- Server-side Excludes: **ON** ✅
- Hotlink Protection: **ON** ✅

---

## 8. Speed → Optimization

**Speed → Optimization**
- Auto Minify: JavaScript, CSS, HTML: **ON** ✅
- Brotli: **ON** ✅
- Early Hints: **ON** ✅
- Rocket Loader: **OFF** (kan störa React)

---

## 9. Caching

**Caching → Configuration**
- Caching Level: **Standard**
- Browser Cache TTL: **Respect Existing Headers**
- Always Online: **ON** ✅

**Caching → Tiered Cache**
- Tiered Cache: **ON** ✅ (Pro+ ger Smart Tiered Cache)

---

## 10. Network

**Network**
- HTTP/2: **ON** ✅
- HTTP/3 (QUIC): **ON** ✅
- WebSockets: **ON** ✅ (för Supabase realtime)
- Onion Routing: **OFF**
- IP Geolocation: **ON** ✅

---

## 11. Firewall Events & Analytics

**Security → Events**
- Övervaka regelbundet för att se blockade requests
- Skapa notifieringar för DDoS-attacker

---

## 12. Additional Security Headers (via Transform Rules)

**Rules → Transform Rules → Modify Response Header**

Lägg till dessa om de inte sätts av appen:

| Header | Value |
|--------|-------|
| X-Robots-Tag | noarchive, nosnippet |
| X-Download-Options | noopen |
| X-Permitted-Cross-Domain-Policies | none |

---

## 🔐 Sammanfattning Checklista

| Inställning | Status |
|-------------|--------|
| SSL Full (strict) | ☐ |
| Always Use HTTPS | ☐ |
| TLS 1.2+ | ☐ |
| WAF Managed Rules | ☐ |
| Bot Fight Mode | ☐ |
| DDoS Protection | ☐ |
| Email Obfuscation | ☐ |
| Hotlink Protection | ☐ |
| Block .map files | ☐ |
| Rate Limit API | ☐ |
| HSTS enabled | ☐ |

---

## 📊 Övervaka

1. **Security → Overview** - Se threat score
2. **Security → Events** - Blockade requests
3. **Analytics → Security** - DDoS/WAF stats
4. **Analytics → Traffic** - Anomalier

---

*Senast uppdaterad: 5 februari 2026*
