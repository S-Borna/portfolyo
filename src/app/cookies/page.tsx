'use client';

import Link from 'next/link';
import { Button, Card, Icons } from '@/components/ui';

const { ArrowLeft } = Icons;

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Tillbaka</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <p className="text-sm text-slate-500 mb-2">Senast uppdaterad: 5 februari 2026</p>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie-policy</h1>
                    <p className="text-lg text-slate-600">
                        Denna policy förklarar hur Portfolyo (Said Borna) använder cookies och liknande tekniker på vår webbplats portfolyo.se, i enlighet med EU:s ePrivacy-direktiv och GDPR.
                    </p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Vad är Cookies?</h2>
                        <p className="text-slate-600 mb-4">
                            Cookies är små textfiler som lagras på din enhet (dator, telefon, surfplatta) när du besöker en webbplats. De används för att:
                        </p>
                        <ul className="space-y-2 text-slate-600">
                            <li>Komma ihåg dina inloggningsuppgifter och inställningar</li>
                            <li>Förstå hur du använder webbplatsen</li>
                            <li>Förbättra din upplevelse</li>
                            <li>Säkerställa att webbplatsen fungerar korrekt</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Typer av Cookies Vi Använder</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">2.1 Strikt Nödvändiga Cookies</h3>
                        <Card className="p-4 mb-4 bg-emerald-50 border-emerald-200">
                            <p className="text-emerald-700 text-sm mb-0">
                                <strong>Kräver inte samtycke</strong> – Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av.
                            </p>
                        </Card>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Cookie</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Syfte</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Varaktighet</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 text-sm">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">sb-*-auth-token</td>
                                    <td className="border border-slate-200 px-4 py-2">Autentisering via Supabase – håller dig inloggad</td>
                                    <td className="border border-slate-200 px-4 py-2">Session / 1 år</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">__cf_bm</td>
                                    <td className="border border-slate-200 px-4 py-2">Cloudflare bot-skydd – säkerhet mot automatiserade attacker</td>
                                    <td className="border border-slate-200 px-4 py-2">30 minuter</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">__cfruid</td>
                                    <td className="border border-slate-200 px-4 py-2">Cloudflare rate limiting – skyddar mot överbelastning</td>
                                    <td className="border border-slate-200 px-4 py-2">Session</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">cookie_consent</td>
                                    <td className="border border-slate-200 px-4 py-2">Sparar dina cookie-preferenser</td>
                                    <td className="border border-slate-200 px-4 py-2">1 år</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">2.2 Funktionscookies</h3>
                        <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
                            <p className="text-blue-700 text-sm mb-0">
                                <strong>Kräver samtycke</strong> – Förbättrar din upplevelse men är inte nödvändiga för grundfunktionalitet.
                            </p>
                        </Card>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Cookie</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Syfte</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Varaktighet</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 text-sm">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">theme</td>
                                    <td className="border border-slate-200 px-4 py-2">Sparar ditt val av ljust/mörkt tema</td>
                                    <td className="border border-slate-200 px-4 py-2">1 år</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">language</td>
                                    <td className="border border-slate-200 px-4 py-2">Sparar ditt språkval</td>
                                    <td className="border border-slate-200 px-4 py-2">1 år</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">editor_prefs</td>
                                    <td className="border border-slate-200 px-4 py-2">Sparar inställningar i CV/portfolio-editorn</td>
                                    <td className="border border-slate-200 px-4 py-2">1 år</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">2.3 Analyscookies</h3>
                        <Card className="p-4 mb-4 bg-amber-50 border-amber-200">
                            <p className="text-amber-700 text-sm mb-0">
                                <strong>Kräver samtycke</strong> – Hjälper oss förstå hur webbplatsen används för att förbättra den.
                            </p>
                        </Card>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Cookie</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Leverantör</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Syfte</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Varaktighet</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 text-sm">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">_ga</td>
                                    <td className="border border-slate-200 px-4 py-2">Google Analytics</td>
                                    <td className="border border-slate-200 px-4 py-2">Särskiljer unika besökare</td>
                                    <td className="border border-slate-200 px-4 py-2">2 år</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">_ga_*</td>
                                    <td className="border border-slate-200 px-4 py-2">Google Analytics 4</td>
                                    <td className="border border-slate-200 px-4 py-2">Persisterar sessionstillstånd</td>
                                    <td className="border border-slate-200 px-4 py-2">2 år</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">_gid</td>
                                    <td className="border border-slate-200 px-4 py-2">Google Analytics</td>
                                    <td className="border border-slate-200 px-4 py-2">Särskiljer unika besökare per dag</td>
                                    <td className="border border-slate-200 px-4 py-2">24 timmar</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-slate-600 text-sm">
                            <strong>Not:</strong> Vi använder Google Analytics med IP-anonymisering aktiverat. Din fullständiga IP-adress samlas aldrig in.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Tredjepartscookies</h2>
                        <p className="text-slate-600 mb-4">
                            Vissa funktioner på vår webbplats kräver cookies från tredje part:
                        </p>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Leverantör</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Syfte</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Mer info</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 text-sm">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Stripe</td>
                                    <td className="border border-slate-200 px-4 py-2">Betalningshantering och bedrägeribekämpning</td>
                                    <td className="border border-slate-200 px-4 py-2"><a href="https://stripe.com/privacy" target="_blank" rel="noopener" className="text-slate-900 underline">Stripes policy</a></td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Supabase</td>
                                    <td className="border border-slate-200 px-4 py-2">Autentisering och databashantering</td>
                                    <td className="border border-slate-200 px-4 py-2"><a href="https://supabase.com/privacy" target="_blank" rel="noopener" className="text-slate-900 underline">Supabases policy</a></td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Cloudflare</td>
                                    <td className="border border-slate-200 px-4 py-2">CDN, säkerhet och prestanda</td>
                                    <td className="border border-slate-200 px-4 py-2"><a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener" className="text-slate-900 underline">Cloudflares policy</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Hantera Dina Cookie-preferenser</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">4.1 Via vår Cookie-banner</h3>
                        <p className="text-slate-600 mb-4">
                            När du först besöker portfolyo.se visas en cookie-banner där du kan:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-4">
                            <li><strong>Acceptera alla:</strong> Samtycka till alla typer av cookies</li>
                            <li><strong>Endast nödvändiga:</strong> Acceptera endast cookies som krävs för att webbplatsen ska fungera</li>
                            <li><strong>Anpassa:</strong> Välja exakt vilka kategorier du vill tillåta</li>
                        </ul>
                        <p className="text-slate-600">
                            Du kan när som helst ändra dina preferenser genom att klicka på "Cookie-inställningar" i sidfoten.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">4.2 Via webbläsarinställningar</h3>
                        <p className="text-slate-600 mb-4">
                            Du kan också hantera cookies via din webbläsare:
                        </p>
                        <ul className="space-y-2 text-slate-600">
                            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-slate-900 underline">Google Chrome</a></li>
                            <li><a href="https://support.mozilla.org/sv/kb/rensa-cookies-och-webbplatsdata-firefox" target="_blank" rel="noopener" className="text-slate-900 underline">Mozilla Firefox</a></li>
                            <li><a href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-slate-900 underline">Safari</a></li>
                            <li><a href="https://support.microsoft.com/sv-se/microsoft-edge/ta-bort-cookies-i-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" className="text-slate-900 underline">Microsoft Edge</a></li>
                        </ul>
                        <p className="text-slate-600 mt-4">
                            <strong>Observera:</strong> Om du blockerar nödvändiga cookies kan delar av webbplatsen sluta fungera korrekt (t.ex. inloggning).
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Lokal Lagring (Local Storage)</h2>
                        <p className="text-slate-600 mb-4">
                            Utöver cookies använder vi webbläsarens lokala lagring för att:
                        </p>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Nyckel</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Syfte</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 text-sm">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">portfolyo-store</td>
                                    <td className="border border-slate-200 px-4 py-2">Sparar ditt utkast till portfolio/CV lokalt för att förhindra dataförlust</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2 font-mono">supabase.auth.token</td>
                                    <td className="border border-slate-200 px-4 py-2">Autentiseringstoken för inloggning</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-slate-600 mt-4">
                            Local storage-data stannar på din enhet och skickas inte till våra servrar automatiskt.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Rättslig Grund</h2>
                        <p className="text-slate-600 mb-4">
                            Vår användning av cookies baseras på följande rättsliga grunder:
                        </p>
                        <ul className="space-y-2 text-slate-600">
                            <li><strong>Berättigat intresse (Art. 6.1.f GDPR):</strong> Strikt nödvändiga cookies för säkerhet och grundfunktionalitet</li>
                            <li><strong>Samtycke (Art. 6.1.a GDPR):</strong> Funktions- och analyscookies aktiveras endast efter ditt aktiva samtycke</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Ändringar i Policyn</h2>
                        <p className="text-slate-600">
                            Vi uppdaterar denna policy vid behov, t.ex. när vi lägger till nya cookies eller ändrar leverantörer. Väsentliga ändringar meddelas via cookie-banner nästa gång du besöker webbplatsen. Senaste uppdateringsdatum visas alltid längst upp på denna sida.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Kontakt</h2>
                        <p className="text-slate-600 mb-4">
                            Har du frågor om vår användning av cookies? Kontakta oss:
                        </p>
                        <Card className="p-6 bg-slate-50">
                            <p className="text-slate-700 mb-2"><strong>Said Borna</strong></p>
                            <p className="text-slate-600 mb-1">E-post: <a href="mailto:said@saidborna.com" className="text-slate-900 underline">said@saidborna.com</a></p>
                            <p className="text-slate-600">Webb: portfolyo.se</p>
                        </Card>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Mer Information</h2>
                        <ul className="space-y-2 text-slate-600">
                            <li>Läs vår <Link href="/privacy" className="text-slate-900 underline">Integritetspolicy</Link> för fullständig information om hur vi hanterar personuppgifter</li>
                            <li>Läs våra <Link href="/terms" className="text-slate-900 underline">Allmänna villkor</Link> för information om tjänstens användning</li>
                            <li>Besök <a href="https://www.imy.se" target="_blank" rel="noopener" className="text-slate-900 underline">Integritetsskyddsmyndigheten (IMY)</a> för mer information om dina rättigheter</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}
