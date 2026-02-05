'use client';

import Link from 'next/link';
import { Button, Card, Icons } from '@/components/ui';

const { ArrowLeft, Lock } = Icons;

export default function PrivacyPage() {
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
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Lock className="h-6 w-6 text-slate-700" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Senast uppdaterad: 5 februari 2026</p>
                            <h1 className="text-4xl font-bold text-slate-900">Integritetspolicy</h1>
                        </div>
                    </div>
                    <p className="text-lg text-slate-600 mt-4">
                        Denna policy beskriver hur Portfolyo (Said Borna, "vi", "oss") samlar in, använder, lagrar och skyddar dina personuppgifter i enlighet med EU:s dataskyddsförordning (GDPR) och svensk dataskyddslagstiftning.
                    </p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <Card className="p-6 mb-8 bg-emerald-50 border-emerald-200">
                        <h3 className="text-emerald-800 font-semibold mb-2 mt-0">Dina rättigheter i korthet</h3>
                        <p className="text-emerald-700 mb-0">
                            Du har rätt att: få tillgång till dina uppgifter, begära rättelse, radera ditt konto, begränsa behandling, invända mot behandling, och få dina uppgifter i portabelt format. Kontakta oss på said@saidborna.com för att utöva dessa rättigheter.
                        </p>
                    </Card>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Personuppgiftsansvarig</h2>
                        <p className="text-slate-600 mb-4">
                            Personuppgiftsansvarig för behandlingen av dina personuppgifter är:
                        </p>
                        <Card className="p-6 bg-slate-50">
                            <p className="text-slate-700 mb-2"><strong>Said Borna</strong></p>
                            <p className="text-slate-600 mb-1">E-post: <a href="mailto:said@saidborna.com" className="text-slate-900 underline">said@saidborna.com</a></p>
                            <p className="text-slate-600 mb-1">Webb: portfolyo.se</p>
                            <p className="text-slate-600">Land: Sverige</p>
                        </Card>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Vilka Uppgifter Vi Samlar In</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">2.1 Uppgifter du tillhandahåller</h3>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Kategori</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Uppgifter</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Syfte</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Kontouppgifter</td>
                                    <td className="border border-slate-200 px-4 py-2">E-post, användarnamn, lösenord (krypterat)</td>
                                    <td className="border border-slate-200 px-4 py-2">Skapa och hantera ditt konto</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Profiluppgifter</td>
                                    <td className="border border-slate-200 px-4 py-2">Namn, yrke, foto, kontaktinfo, biografi</td>
                                    <td className="border border-slate-200 px-4 py-2">Visa på din portfolio/CV</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">CV-innehåll</td>
                                    <td className="border border-slate-200 px-4 py-2">Arbetslivserfarenhet, utbildning, kompetenser, projekt</td>
                                    <td className="border border-slate-200 px-4 py-2">Generera och visa CV</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Betalningsuppgifter</td>
                                    <td className="border border-slate-200 px-4 py-2">Transaktions-ID, betalningsmetod (ej kortnummer)</td>
                                    <td className="border border-slate-200 px-4 py-2">Hantera köp och återbetalningar</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">2.2 Uppgifter vi samlar automatiskt</h3>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Kategori</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Uppgifter</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Syfte</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Tekniska uppgifter</td>
                                    <td className="border border-slate-200 px-4 py-2">IP-adress, webbläsare, enhet, operativsystem</td>
                                    <td className="border border-slate-200 px-4 py-2">Säkerhet och felsökning</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Användningsdata</td>
                                    <td className="border border-slate-200 px-4 py-2">Besökta sidor, klick, sessionstid</td>
                                    <td className="border border-slate-200 px-4 py-2">Förbättra tjänsten</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Cookies</td>
                                    <td className="border border-slate-200 px-4 py-2">Sessionsdata, preferenser, analysdata</td>
                                    <td className="border border-slate-200 px-4 py-2">Funktionalitet och analys</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">2.3 Känsliga personuppgifter</h3>
                        <p className="text-slate-600">
                            Vi ber dig inte lämna och vi behandlar inte avsiktligt känsliga personuppgifter såsom etniskt ursprung, politiska åsikter, religiös övertygelse, hälsouppgifter eller sexuell läggning. Om du inkluderar sådan information i ditt CV-innehåll görs det på eget ansvar.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Rättsliga Grunder för Behandling</h2>
                        <p className="text-slate-600 mb-4">
                            Vi behandlar dina personuppgifter baserat på följande rättsliga grunder enligt GDPR artikel 6:
                        </p>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Rättslig grund</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Tillämpning</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2"><strong>Avtal (Art. 6.1.b)</strong></td>
                                    <td className="border border-slate-200 px-4 py-2">Nödvändigt för att tillhandahålla tjänsten – skapa konto, publicera portfolio, hantera betalningar</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2"><strong>Samtycke (Art. 6.1.a)</strong></td>
                                    <td className="border border-slate-200 px-4 py-2">Analys-cookies, marknadsföring, nyhetsbrev (du kan när som helst återkalla samtycke)</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2"><strong>Berättigat intresse (Art. 6.1.f)</strong></td>
                                    <td className="border border-slate-200 px-4 py-2">Säkerhet, bedrägeribekämpning, förbättring av tjänsten, grundläggande analys</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2"><strong>Rättslig förpliktelse (Art. 6.1.c)</strong></td>
                                    <td className="border border-slate-200 px-4 py-2">Bokföring, skattelagstiftning, myndighetsförfrågningar</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Hur Vi Använder Dina Uppgifter</h2>
                        <ul className="space-y-3 text-slate-600">
                            <li><strong>Tillhandahålla tjänsten:</strong> Skapa och visa din portfolio och CV, hantera inloggning, spara ditt innehåll</li>
                            <li><strong>Betalningshantering:</strong> Genomföra köp, utfärda kvitton, hantera återbetalningar</li>
                            <li><strong>Kommunikation:</strong> Skicka transaktionsmeddelanden, säkerhetsvarningar, tjänsterelaterad information</li>
                            <li><strong>Förbättra tjänsten:</strong> Analysera användningsmönster, identifiera buggar, utveckla nya funktioner</li>
                            <li><strong>Säkerhet:</strong> Förhindra obehörig åtkomst, upptäcka bedrägeri, skydda mot attacker</li>
                            <li><strong>Rättsliga förpliktelser:</strong> Uppfylla bokföringskrav, svara på myndighetsbegäranden</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Delning av Uppgifter</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">5.1 Tjänsteleverantörer (Personuppgiftsbiträden)</h3>
                        <p className="text-slate-600 mb-4">
                            Vi delar uppgifter med följande kategorier av leverantörer som behandlar data för vår räkning:
                        </p>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Leverantör</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Syfte</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Plats</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Supabase (PostgreSQL)</td>
                                    <td className="border border-slate-200 px-4 py-2">Databas och autentisering</td>
                                    <td className="border border-slate-200 px-4 py-2">EU (Frankfurt)</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Cloudflare</td>
                                    <td className="border border-slate-200 px-4 py-2">Hosting och CDN</td>
                                    <td className="border border-slate-200 px-4 py-2">Globalt (EU-primär)</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Stripe</td>
                                    <td className="border border-slate-200 px-4 py-2">Betalningshantering</td>
                                    <td className="border border-slate-200 px-4 py-2">EU/USA (SCCs)</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">OpenAI</td>
                                    <td className="border border-slate-200 px-4 py-2">AI-textgenerering</td>
                                    <td className="border border-slate-200 px-4 py-2">USA (DPA)</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">5.2 Vi säljer aldrig dina uppgifter</h3>
                        <p className="text-slate-600 mb-4">
                            Vi säljer, hyr eller byter aldrig dina personuppgifter till tredje part för marknadsföringsändamål.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">5.3 Överföring utanför EU/EES</h3>
                        <p className="text-slate-600">
                            Vissa av våra leverantörer (OpenAI, Stripe) har verksamhet i USA. Vi säkerställer lämpliga skyddsåtgärder genom EU-kommissionens standardavtalsklausuler (SCCs) och verifierar att mottagare upprätthåller adekvat skyddsnivå. Du kan begära kopia av relevanta skyddsåtgärder genom att kontakta oss.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Lagring och Radering</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">6.1 Lagringstider</h3>
                        <table className="w-full border-collapse mb-6">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-2 text-left">Uppgiftstyp</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Lagringstid</th>
                                    <th className="border border-slate-200 px-4 py-2 text-left">Motivering</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Kontouppgifter</td>
                                    <td className="border border-slate-200 px-4 py-2">Till kontot raderas</td>
                                    <td className="border border-slate-200 px-4 py-2">Avtalsuppfyllelse</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Portfolio/CV-innehåll</td>
                                    <td className="border border-slate-200 px-4 py-2">Till kontot raderas</td>
                                    <td className="border border-slate-200 px-4 py-2">Avtalsuppfyllelse</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Transaktionshistorik</td>
                                    <td className="border border-slate-200 px-4 py-2">7 år efter köp</td>
                                    <td className="border border-slate-200 px-4 py-2">Bokföringslag</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Säkerhetsloggar</td>
                                    <td className="border border-slate-200 px-4 py-2">90 dagar</td>
                                    <td className="border border-slate-200 px-4 py-2">Säkerhet</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 px-4 py-2">Analysdata</td>
                                    <td className="border border-slate-200 px-4 py-2">26 månader</td>
                                    <td className="border border-slate-200 px-4 py-2">Tjänsteförbättring</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">6.2 Radering</h3>
                        <p className="text-slate-600">
                            När du raderar ditt konto tas dina personuppgifter bort inom 30 dagar, med undantag för uppgifter vi enligt lag måste behålla (t.ex. transaktionshistorik). Säkerhetskopior innehållande dina uppgifter raderas inom 90 dagar.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Dina Rättigheter enligt GDPR</h2>
                        <p className="text-slate-600 mb-4">
                            Som registrerad har du följande rättigheter:
                        </p>

                        <div className="space-y-4">
                            <Card className="p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Rätt till tillgång (Art. 15)</h4>
                                <p className="text-slate-600 text-sm mb-0">
                                    Du har rätt att få bekräftelse på om vi behandlar dina personuppgifter och i så fall få tillgång till dem samt information om behandlingen.
                                </p>
                            </Card>

                            <Card className="p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Rätt till rättelse (Art. 16)</h4>
                                <p className="text-slate-600 text-sm mb-0">
                                    Du har rätt att få felaktiga uppgifter korrigerade och ofullständiga uppgifter kompletterade.
                                </p>
                            </Card>

                            <Card className="p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Rätt till radering/"Rätten att bli bortglömd" (Art. 17)</h4>
                                <p className="text-slate-600 text-sm mb-0">
                                    Du har rätt att få dina uppgifter raderade under vissa förutsättningar, t.ex. när uppgifterna inte längre är nödvändiga eller när du återkallar samtycke.
                                </p>
                            </Card>

                            <Card className="p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Rätt till begränsning av behandling (Art. 18)</h4>
                                <p className="text-slate-600 text-sm mb-0">
                                    Du har rätt att begära att vi begränsar behandlingen av dina uppgifter under vissa omständigheter.
                                </p>
                            </Card>

                            <Card className="p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Rätt till dataportabilitet (Art. 20)</h4>
                                <p className="text-slate-600 text-sm mb-0">
                                    Du har rätt att få ut dina uppgifter i ett strukturerat, maskinläsbart format (JSON/CSV) och överföra dem till annan tjänst.
                                </p>
                            </Card>

                            <Card className="p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Rätt att invända (Art. 21)</h4>
                                <p className="text-slate-600 text-sm mb-0">
                                    Du har rätt att invända mot behandling som grundar sig på berättigat intresse. Vi slutar då behandla uppgifterna om vi inte kan påvisa tvingande berättigade skäl.
                                </p>
                            </Card>

                            <Card className="p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Rätt att återkalla samtycke</h4>
                                <p className="text-slate-600 text-sm mb-0">
                                    Du kan när som helst återkalla samtycke du gett för cookies, nyhetsbrev eller marknadsföring. Återkallande påverkar inte lagligheten av tidigare behandling.
                                </p>
                            </Card>
                        </div>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Så utövar du dina rättigheter</h3>
                        <p className="text-slate-600">
                            Kontakta oss via <a href="mailto:said@saidborna.com" className="text-slate-900 underline">said@saidborna.com</a>. Vi besvarar din begäran inom 30 dagar. Vid komplexa förfrågningar kan tiden förlängas med ytterligare 60 dagar, varvid vi informerar dig. Begäran är kostnadsfri om den inte är uppenbart ogrundad eller orimlig.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Dataskydd och Säkerhet</h2>
                        <p className="text-slate-600 mb-4">
                            Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter:
                        </p>
                        <ul className="space-y-2 text-slate-600">
                            <li><strong>Kryptering:</strong> Alla data krypteras i transit (TLS 1.3) och i vila (AES-256)</li>
                            <li><strong>Autentisering:</strong> Lösenord hashas med bcrypt, stöd för tvåfaktorsautentisering</li>
                            <li><strong>Åtkomstkontroll:</strong> Strikt behörighetssystem med principen om minsta privilegium</li>
                            <li><strong>Säkerhetskopiering:</strong> Dagliga krypterade backups med geografisk redundans</li>
                            <li><strong>Övervakning:</strong> Kontinuerlig säkerhetsövervakning och intrångsdetektering</li>
                            <li><strong>Incidenthantering:</strong> Dokumenterade rutiner för hantering av personuppgiftsincidenter</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Personuppgiftsincidenter</h2>
                        <p className="text-slate-600">
                            Vid en personuppgiftsincident som sannolikt innebär risk för dina rättigheter och friheter:
                        </p>
                        <ul className="space-y-2 text-slate-600 mt-4">
                            <li>Anmäler vi incidenten till Integritetsskyddsmyndigheten (IMY) inom 72 timmar</li>
                            <li>Informerar vi dig direkt om incidenten innebär hög risk för dig</li>
                            <li>Dokumenterar vi incidenten och vidtagna åtgärder</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Cookies</h2>
                        <p className="text-slate-600 mb-4">
                            Vi använder cookies enligt vår <Link href="/cookies" className="text-slate-900 underline">Cookie-policy</Link>. Sammanfattningsvis:
                        </p>
                        <ul className="space-y-2 text-slate-600">
                            <li><strong>Nödvändiga cookies:</strong> Krävs för att tjänsten ska fungera (inloggning, säkerhet)</li>
                            <li><strong>Funktionscookies:</strong> Sparar dina preferenser</li>
                            <li><strong>Analyscookies:</strong> Hjälper oss förstå hur tjänsten används (kräver samtycke)</li>
                        </ul>
                        <p className="text-slate-600 mt-4">
                            Du kan hantera dina cookie-preferenser via vår cookie-banner eller webbläsarinställningar.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Barn</h2>
                        <p className="text-slate-600">
                            Portfolyo riktar sig inte till barn under 16 år. Vi samlar inte medvetet in personuppgifter från barn. Om vi upptäcker att vi oavsiktligt samlat in uppgifter om ett barn raderar vi dem omedelbart. Vårdnadshavare som upptäcker att deras barn skapat konto kan kontakta oss för radering.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Ändringar i Policyn</h2>
                        <p className="text-slate-600">
                            Vi kan uppdatera denna policy. Vid väsentliga ändringar:
                        </p>
                        <ul className="space-y-2 text-slate-600 mt-4">
                            <li>Meddelar vi dig via e-post minst 30 dagar före ikraftträdande</li>
                            <li>Publicerar vi den uppdaterade policyn på denna sida med nytt datum</li>
                            <li>Markerar vi tydligt vad som ändrats</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Tillsynsmyndighet och Klagomål</h2>
                        <p className="text-slate-600 mb-4">
                            Om du är missnöjd med hur vi hanterar dina personuppgifter har du rätt att lämna klagomål till:
                        </p>
                        <Card className="p-6 bg-slate-50">
                            <p className="text-slate-700 mb-2"><strong>Integritetsskyddsmyndigheten (IMY)</strong></p>
                            <p className="text-slate-600 mb-1">Box 8114, 104 20 Stockholm</p>
                            <p className="text-slate-600 mb-1">E-post: imy@imy.se</p>
                            <p className="text-slate-600">Webb: <a href="https://www.imy.se" target="_blank" rel="noopener" className="text-slate-900 underline">www.imy.se</a></p>
                        </Card>
                        <p className="text-slate-600 mt-4">
                            Vi uppskattar dock om du först kontaktar oss så att vi kan försöka lösa eventuella problem.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Kontakt</h2>
                        <p className="text-slate-600 mb-4">
                            Har du frågor om denna policy eller din integritet? Kontakta oss:
                        </p>
                        <Card className="p-6 bg-slate-50">
                            <p className="text-slate-700 mb-2"><strong>Said Borna</strong></p>
                            <p className="text-slate-600 mb-1">E-post: <a href="mailto:said@saidborna.com" className="text-slate-900 underline">said@saidborna.com</a></p>
                            <p className="text-slate-600">Svarstid: Inom 48 timmar på vardagar</p>
                        </Card>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-500 text-center">
                        Din integritet är viktig för oss. Vi behandlar dina personuppgifter med största omsorg och respekt.
                    </p>
                </div>
            </main>
        </div>
    );
}
