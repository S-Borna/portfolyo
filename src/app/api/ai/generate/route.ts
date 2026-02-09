import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMITS,
} from '@/lib/rate-limit';

// Lazy-init: Cloudflare Workers don't populate process.env at module-load time
let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      // Use global fetch for Cloudflare Workers compatibility
      fetch: globalThis.fetch.bind(globalThis),
    });
  }
  return _anthropic;
}

const SYSTEM_PROMPT = `Du är en expert på att skriva professionella texter på svenska för portfolios och CV:n.

REGLER:
- Skriv alltid på flytande svenska
- Var konkret och använd siffror när möjligt
- Använd aktiva verb
- Anpassa för ATS-system (Applicant Tracking Systems)
- Håll texten professionell men personlig
- Undvik klyschor och tomma fraser
- Fokusera på mätbara resultat och achievements`;

export async function POST(request: NextRequest) {
  try {
    // ============================================
    // RATE LIMITING
    // ============================================
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId, RATE_LIMITS.ai);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'För många förfrågningar. Vänta en stund innan du försöker igen.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }

    const { type, context } = await request.json();

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    let userPrompt = '';

    switch (type) {
      case 'bio':
        userPrompt = `Skriv en professionell och engagerande bio för en portfolio.

Bakgrund:
- Namn: ${context.name || 'Användare'}
- Titel/Roll: ${context.title || 'Student'}
- Erfarenhet: ${context.experience || 'Ingen angiven'}
- Skills: ${context.skills?.join(', ') || 'Ingen angiven'}
- Utbildning: ${context.education || 'Ingen angiven'}

Skriv en bio på 2-3 meningar som:
1. Presenterar personen professionellt
2. Nämner nyckelkompetenser
3. Är engagerande och minnesvärd

Svara ENDAST med bion, ingen annan text.`;
        break;

      case 'project-description':
        userPrompt = `Skriv en projektbeskrivning för en portfolio.

Projekt:
- Namn: ${context.projectName || 'Projekt'}
- Teknologier: ${context.technologies?.join(', ') || 'Inte specificerat'}
- Kort beskrivning: ${context.description || 'Inte angiven'}

Skriv en engagerande beskrivning på 2-4 meningar som:
1. Förklarar vad projektet gör
2. Nämner tekniska lösningar
3. Betonar utmaningar och lösningar

Svara ENDAST med beskrivningen, ingen annan text.`;
        break;

      case 'cv-summary':
        userPrompt = `Skriv en professionell CV-sammanfattning.

Person:
- Namn: ${context.name || 'Användare'}
- Titel: ${context.title || 'Student'}
- Erfarenhet: ${JSON.stringify(context.experience || [])}
- Utbildning: ${JSON.stringify(context.education || [])}
- Skills: ${JSON.stringify(context.skills || [])}

Skriv en sammanfattning på 3-4 meningar som:
1. Sammanfattar professionell bakgrund
2. Framhäver nyckelkompetenser
3. Visar karriärmål
4. Är ATS-optimerad

Svara ENDAST med sammanfattningen, ingen annan text.`;
        break;

      case 'improve':
        userPrompt = `Förbättra följande text för en portfolio/CV:

"${context.text}"

Förbättra texten genom att:
1. Göra den mer professionell
2. Använda aktiva verb
3. Vara mer specifik och konkret
4. Behålla personens röst

Svara ENDAST med den förbättrade texten, ingen annan text.`;
        break;

      case 'timeline-description':
        userPrompt = `Skriv en professionell beskrivning för en timeline-post i en portfolio.

Detaljer:
- Typ: ${context.type || 'erfarenhet'}
- Titel: ${context.title || 'Position'}
- Organisation: ${context.subtitle || 'Företag/Skola'}
- Period: ${context.period || 'Ej angiven'}

Skriv en beskrivning på 2-3 meningar som:
1. Beskriver ansvarsområden eller kurser
2. Nämner specifika teknologier eller metoder
3. Framhäver resultat och lärdomar

Svara ENDAST med beskrivningen, ingen annan text.`;
        break;

      case 'parse-cv':
        userPrompt = `Du är en expert på att analysera CV:n och skapa imponerande portfoliopresentationer. Analysera följande CV-text noggrant och extrahera ALL tillgänglig information.

CV-TEXT:
"""
${context.text}
"""

Svara med EXAKT DENNA JSON-struktur (inget annat):
{
  "fullName": "Fullständigt namn",
  "title": "Professionell titel (t.ex. 'DevOps Engineer' eller 'Fullstack-utvecklare')",
  "email": "email eller null",
  "phone": "telefonnummer eller null",
  "location": "Stad eller null",
  "linkedin": "linkedin-url eller null",
  "github": "github-url eller null",
  "website": "webbplats-url eller null",
  "bio": "3-4 meningar — en engagerande, professionell sammanfattning. Beskriv personen i tredje person. Framhäv kärnkompetenser, erfarenhet och vad som gör personen unik. Var specifik med teknologier och åstadkommanden.",
  "experience": [
    {
      "title": "Jobbtitel",
      "company": "Företagsnamn",
      "period": "Jan 2024 – Pågående",
      "description": "2-3 meningar som beskriver ansvar, åstadkommanden och teknologier. Var specifik med resultat och siffror om möjligt.",
      "current": true
    }
  ],
  "education": [
    {
      "degree": "Programnamn / Examen",
      "institution": "Skola / Universitet",
      "period": "2024 – 2026",
      "description": "Inriktning, relevanta kurser eller utmärkelser"
    }
  ],
  "skills": ["Linux", "Docker", "Kubernetes", "Python", "CI/CD"],
  "projects": [
    {
      "name": "Projektnamn",
      "description": "2-3 meningar som beskriver projektet, teknologier och resultat.",
      "tags": ["React", "Node.js", "Docker"],
      "url": "url eller null"
    }
  ]
}

VIKTIGA REGLER:
- Extrahera ABSOLUT ALL data. Missa inget.
- Skriv engagerande, proffsiga beskrivningar — inte bara kopiera rå text
- Bio ska vara 3-4 meningar, skriven på svenska i tredje person, och sälja in personen
- Erfarenhetsbeskrivningar: 2-3 meningar per post med konkreta detaljer
- Utbildningsbeskrivningar: nämn relevanta kurser eller fokusområden
- Skills: lista ALLA tekniska färdigheter, verktyg, språk och ramverk separat (inte grupperade)
- Projekt: beskriv varje projekt med vad det gör, vilken teknik som användes, och impact
- Om personen har egna företag/konsultuppdrag, lista dem under experience
- Period-format: "Månad År – Månad År" eller "Månad År – Pågående"
- Om ett fält saknas helt, använd null (strängar) eller tom array (listor)
- Svara ENBART med valid JSON, absolut ingen annan text`;
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown generation type' },
          { status: 400 }
        );
    }

    const message = await getAnthropic().messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: type === 'parse-cv' ? 4000 : 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return NextResponse.json(
      {
        content: content.text,
        usage: {
          input_tokens: message.usage.input_tokens,
          output_tokens: message.usage.output_tokens,
        },
      },
      {
        headers: getRateLimitHeaders(rateLimit),
      }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('AI Generation error:', errMsg);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
