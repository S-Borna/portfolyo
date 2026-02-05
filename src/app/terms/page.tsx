'use client';

import Link from 'next/link';
import { Button, Card, Icons } from '@/components/ui';

const { ArrowLeft } = Icons;

export default function TermsPage() {
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Allmänna Villkor</h1>
                    <p className="text-lg text-slate-600">
                        Dessa villkor ("Villkoren") reglerar din användning av Portfolyo och utgör ett juridiskt bindande avtal mellan dig och Said Borna ("vi", "oss", "Portfolyo").
                    </p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <Card className="p-6 mb-8 bg-amber-50 border-amber-200">
                        <p className="text-amber-800 font-medium mb-0">
                            Genom att skapa ett konto, göra ett köp eller använda våra tjänster accepterar du dessa villkor i sin helhet. Läs dem noggrant.
                        </p>
                    </Card>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Definitioner</h2>
                        <ul className="space-y-2 text-slate-600">
                            <li><strong>"Tjänsten"</strong> avser Portfolyo-plattformen, inklusive webbplatsen portfolyo.se, alla subdomäner, API:er och relaterade tjänster.</li>
                            <li><strong>"Användare"</strong> avser varje fysisk eller juridisk person som skapar ett konto eller använder Tjänsten.</li>
                            <li><strong>"Innehåll"</strong> avser all text, bilder, filer, CV-data, portfolioinnehåll och annat material som laddas upp eller skapas via Tjänsten.</li>
                            <li><strong>"Credits"</strong> avser den virtuella valuta som används för att utföra ändringar och skapa nytt innehåll inom Tjänsten.</li>
                            <li><strong>"Publicering"</strong> avser aktivering av en portfolio eller CV på en offentlig URL under portfolyo.se-domänen.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Tjänstens Omfattning</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">2.1 Vad vi erbjuder</h3>
                        <p className="text-slate-600 mb-4">Portfolyo tillhandahåller:</p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Skapande och hosting av digitala portfolios och CV:n</li>
                            <li>Publicering på personlig URL (portfolyo.se/användarnamn)</li>
                            <li>PDF-export av CV</li>
                            <li>Designmallar och templates</li>
                            <li>AI-assisterad textgenerering (inom ramarna för tillgängliga credits)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">2.2 Tjänstens tillgänglighet</h3>
                        <p className="text-slate-600">
                            Vi strävar efter 99,9% tillgänglighet men garanterar inte oavbruten åtkomst. Planerat underhåll aviseras 48 timmar i förväg via e-post till registrerade användare. Vi ansvarar inte för avbrott orsakade av tredje part, force majeure eller omständigheter utanför vår kontroll.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Priser och Betalning</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">3.1 Engångsavgift</h3>
                        <p className="text-slate-600 mb-4">
                            Publicering av portfolio eller CV kostar <strong>49 SEK</strong> som engångsbetalning. Denna avgift inkluderar:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Permanent publicering på portfolyo.se/användarnamn</li>
                            <li>Hosting utan tidsbegränsning</li>
                            <li>1 (en) CV-generering</li>
                            <li>PDF-export</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">3.2 Credits</h3>
                        <p className="text-slate-600 mb-4">
                            Ändringar och tillägg kräver credits enligt följande tabell:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li><strong>1 credit:</strong> Ändring på befintligt CV</li>
                            <li><strong>2 credits:</strong> Nytt CV eller ändring på befintlig portfolio</li>
                            <li><strong>4 credits:</strong> Ny portfolio</li>
                        </ul>
                        <p className="text-slate-600 mb-4">Credits kan köpas enligt följande priser:</p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>4 credits: 39 SEK</li>
                            <li>10 credits: 79 SEK</li>
                            <li>Enstaka credit: 14,99 SEK</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">3.3 Betalningsvillkor</h3>
                        <ul className="space-y-2 text-slate-600">
                            <li>Alla priser anges i svenska kronor (SEK) inklusive moms (25%).</li>
                            <li>Betalning sker via Stripe och godkända betalningsmetoder inkluderar Visa, Mastercard och Swish.</li>
                            <li>Köpet är genomfört när betalningen bekräftats och credits/tjänst levererats till kontot.</li>
                            <li>Vi utfärdar kvitto via e-post vid varje köp.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Ångerrätt och Återbetalning</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">4.1 Lagstadgad ångerrätt</h3>
                        <p className="text-slate-600 mb-4">
                            Enligt Distansavtalslagen (2005:59) har du som konsument rätt att ångra ditt köp inom 14 dagar utan att ange skäl. Ångerrätten börjar löpa från den dag köpet genomfördes.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">4.2 Undantag från ångerrätt</h3>
                        <p className="text-slate-600 mb-4">
                            Ångerrätten gäller <strong>inte</strong> om du har:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Publicerat en portfolio eller CV (tjänsten har levererats)</li>
                            <li>Använt credits för att generera eller ändra innehåll</li>
                            <li>Uttryckligen samtyckt till att tjänsten påbörjas innan ångerfristen löpt ut</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">4.3 Återbetalningsprocess</h3>
                        <p className="text-slate-600">
                            För att utöva din ångerrätt, kontakta oss via said@saidborna.com med ditt ordernummer. Återbetalning sker inom 14 dagar till samma betalningsmetod som användes vid köpet. Oanvända credits återbetalas till fullt belopp.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Användarens Åtaganden</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">5.1 Kontoansvar</h3>
                        <p className="text-slate-600 mb-4">Du ansvarar för att:</p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Tillhandahålla korrekt och aktuell information vid registrering</li>
                            <li>Skydda dina inloggningsuppgifter och inte dela dem med tredje part</li>
                            <li>Omedelbart meddela oss vid misstänkt obehörig åtkomst till ditt konto</li>
                            <li>Hålla din e-postadress uppdaterad för viktiga meddelanden</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">5.2 Tillåten användning</h3>
                        <p className="text-slate-600 mb-4">Du förbinder dig att inte:</p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Ladda upp innehåll som gör intrång i andras upphovsrätt, varumärken eller andra immateriella rättigheter</li>
                            <li>Publicera olagligt, hotfullt, obscent, hatiskt eller diskriminerande material</li>
                            <li>Använda Tjänsten för spam, bedrägeri eller vilseledande marknadsföring</li>
                            <li>Försöka kringgå tekniska skyddsåtgärder eller reverse-engineera Tjänsten</li>
                            <li>Överbelasta våra system med automatiserade förfrågningar</li>
                            <li>Skapa falska identiteter eller utge dig för att vara någon annan</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">5.3 Konsekvenser vid brott</h3>
                        <p className="text-slate-600">
                            Vid brott mot dessa villkor förbehåller vi oss rätten att omedelbart stänga av eller radera ditt konto utan återbetalning. Allvarliga överträdelser kan resultera i rättsliga åtgärder och skadeståndskrav.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Immateriella Rättigheter</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">6.1 Våra rättigheter</h3>
                        <p className="text-slate-600 mb-4">
                            Portfolyo, inklusive men inte begränsat till varumärken, logotyper, design, templates, källkod, algoritmer och dokumentation, tillhör Said Borna och skyddas av svensk och internationell upphovsrättslagstiftning.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">6.2 Dina rättigheter</h3>
                        <p className="text-slate-600 mb-4">
                            Du behåller alla rättigheter till det innehåll du laddar upp. Genom att använda Tjänsten ger du oss en icke-exklusiv, royalty-fri licens att:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Visa ditt innehåll på din publicerade portfolio/CV</li>
                            <li>Lagra och bearbeta ditt innehåll för att tillhandahålla Tjänsten</li>
                            <li>Skapa tekniska kopior för backup och drift</li>
                        </ul>
                        <p className="text-slate-600">
                            Denna licens upphör när du raderar ditt innehåll eller konto, med undantag för arkiverade säkerhetskopior.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Ansvarsbegränsning</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">7.1 Friskrivning</h3>
                        <p className="text-slate-600 mb-4">
                            Tjänsten tillhandahålls "i befintligt skick" och "som tillgänglig". Vi garanterar inte att:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Tjänsten kommer att vara felfri eller oavbruten</li>
                            <li>Tjänsten kommer att leda till anställning eller affärsframgång</li>
                            <li>AI-genererat innehåll är fritt från fel eller fullständigt korrekt</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">7.2 Begränsning av skadestånd</h3>
                        <p className="text-slate-600 mb-4">
                            Vårt totala skadeståndsansvar är begränsat till det belopp du betalat till oss under de senaste 12 månaderna, dock aldrig mer än 1000 SEK. Vi ansvarar aldrig för:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Indirekta skador, följdskador eller utebliven vinst</li>
                            <li>Förlust av data orsakad av Användarens egen hantering</li>
                            <li>Skador orsakade av tredjepartstjänster (Stripe, hosting-leverantörer etc.)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">7.3 Force majeure</h3>
                        <p className="text-slate-600">
                            Vi ansvarar inte för förseningar eller utebliven prestation orsakade av omständigheter utanför vår kontroll, inklusive men inte begränsat till naturkatastrofer, krig, strejker, elavbrott, cyberattacker eller myndighetsbeslut.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Uppsägning</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">8.1 Din rätt att avsluta</h3>
                        <p className="text-slate-600 mb-4">
                            Du kan när som helst radera ditt konto via inställningarna i din dashboard. Vid radering:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Avpubliceras din portfolio och CV inom 24 timmar</li>
                            <li>Oanvända credits förfaller utan rätt till återbetalning</li>
                            <li>Dina personuppgifter raderas enligt vår integritetspolicy</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">8.2 Vår rätt att avsluta</h3>
                        <p className="text-slate-600">
                            Vi förbehåller oss rätten att stänga av eller avsluta ditt konto med omedelbar verkan vid brott mot dessa villkor, misstänkt bedrägeri, eller om du inte har loggat in på 24 månader. Vid inaktivitetsavslutning skickas varning 30 dagar i förväg.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Ändringar av Villkoren</h2>
                        <p className="text-slate-600 mb-4">
                            Vi kan uppdatera dessa villkor från tid till annan. Vid väsentliga ändringar:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li>Meddelar vi dig via e-post minst 30 dagar före ikraftträdande</li>
                            <li>Publicerar vi de nya villkoren på denna sida med nytt datum</li>
                            <li>Ger vi dig möjlighet att säga upp avtalet före ändringens ikraftträdande</li>
                        </ul>
                        <p className="text-slate-600">
                            Fortsatt användning av Tjänsten efter att ändringarna trätt i kraft utgör ditt godkännande av de nya villkoren.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Tvistelösning och Tillämplig Lag</h2>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">10.1 Tillämplig lag</h3>
                        <p className="text-slate-600 mb-4">
                            Dessa villkor och alla tvister därtill ska tolkas enligt svensk lag.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-800 mb-3">10.2 Tvistelösning</h3>
                        <p className="text-slate-600 mb-4">
                            Vid tvist ska parterna i första hand försöka lösa tvisten genom förhandling. Om detta inte lyckas inom 30 dagar:
                        </p>
                        <ul className="space-y-2 text-slate-600 mb-6">
                            <li><strong>Konsumenter:</strong> Har rätt att vända sig till Allmänna reklamationsnämnden (ARN) för prövning. EU-kommissionens plattform för tvistlösning online finns på <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener" className="text-slate-900 underline">ec.europa.eu/odr</a>.</li>
                            <li><strong>Företag:</strong> Tvister avgörs slutligt av svensk allmän domstol med Stockholms tingsrätt som första instans.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Kontakt</h2>
                        <p className="text-slate-600 mb-4">
                            För frågor om dessa villkor eller vår tjänst, kontakta oss:
                        </p>
                        <Card className="p-6 bg-slate-50">
                            <p className="text-slate-700 mb-2"><strong>Said Borna</strong></p>
                            <p className="text-slate-600 mb-1">E-post: <a href="mailto:said@saidborna.com" className="text-slate-900 underline">said@saidborna.com</a></p>
                            <p className="text-slate-600 mb-1">Webb: <a href="https://portfolyo.se" className="text-slate-900 underline">portfolyo.se</a></p>
                            <p className="text-slate-600">Svarstid: Inom 48 timmar på vardagar</p>
                        </Card>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Slutbestämmelser</h2>
                        <ul className="space-y-2 text-slate-600">
                            <li><strong>Hela avtalet:</strong> Dessa villkor, tillsammans med integritetspolicyn och cookie-policyn, utgör hela avtalet mellan dig och Portfolyo.</li>
                            <li><strong>Ogiltighet:</strong> Om någon bestämmelse i dessa villkor befinns vara ogiltig ska övriga bestämmelser fortsätta gälla.</li>
                            <li><strong>Överlåtelse:</strong> Du får inte överlåta dina rättigheter eller skyldigheter enligt dessa villkor utan vårt skriftliga samtycke. Vi får överlåta avtalet vid företagsöverlåtelse.</li>
                            <li><strong>Ingen eftergift:</strong> Underlåtenhet att tillämpa en bestämmelse utgör inte avstående från rätten att tillämpa den i framtiden.</li>
                        </ul>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-500 text-center">
                        Genom att använda Portfolyo bekräftar du att du har läst, förstått och godkänner dessa Allmänna Villkor.
                    </p>
                </div>
            </main>
        </div>
    );
}
