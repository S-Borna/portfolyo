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
        userPrompt = `Analysera följande CV-text och extrahera strukturerad data.

CV-TEXT:
"""
${context.text}
"""

Svara med EXAKT DENNA JSON-struktur (inget annat):
{
  "fullName": "Namn",
  "title": "Titel/Roll",
  "email": "email@domain.com",
  "phone": "telefonnummer",
  "location": "Stad, Land",
  "linkedin": "linkedin-url eller null",
  "github": "github-url eller null",
  "website": "webbplats-url eller null",
  "bio": "2-3 meningar professionell sammanfattning baserat på CV:t",
  "experience": [
    {
      "title": "Jobbtitel",
      "company": "Företag",
      "period": "Start – Slut",
      "description": "Kort beskrivning av rollen",
      "current": false
    }
  ],
  "education": [
    {
      "degree": "Utbildning/Program",
      "institution": "Skola/Universitet",
      "period": "Start – Slut",
      "description": "Inriktning eller kurser"
    }
  ],
  "skills": ["Skill1", "Skill2", "Skill3"],
  "projects": [
    {
      "name": "Projektnamn",
      "description": "Kort beskrivning",
      "tags": ["Tech1", "Tech2"],
      "url": "url eller null"
    }
  ]
}

Regler:
- Extrahera ALL data du kan hitta
- Om ett fält saknas, använd null eller tom array
- Skriv bio:n på svenska, professionellt
- Svara ENBART med JSON, ingen annan text`;
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown generation type' },
          { status: 400 }
        );
    }

    const message = await getAnthropic().messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: type === 'parse-cv' ? 2000 : 500,
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
