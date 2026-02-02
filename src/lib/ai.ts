import Anthropic from '@anthropic-ai/sdk';
import type { AIGenerationRequest } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Du är en expert på att skriva professionell portfolio- och CV-content för svenska studenter och nyexaminerade. 

REGLER:
- Skriv alltid på svenska om inte annat anges
- Använd konkreta siffror och mätbara resultat ("ökade X med 34%", inte "förbättrade X")
- Aktiva verb: "Byggde", "Ledde", "Implementerade", "Koordinerade"
- Kortfattat men impactfullt - max 2 meningar per punkt
- Anpassat för svenska jobbmarknaden och rekryterare
- Undvik klyschor och generiska fraser
- Fokusera på VALUE och IMPACT, inte bara aktiviteter

EXEMPEL PÅ BRA OUTPUT:
"Koordinerade 6,700 förare i realtid och ökade leveranssäkerhet från 72% till 94% på sex månader genom implementering av nytt dispatchsystem."

"Byggde interaktiv SQL-lärplattform med 70+ övningar som används av 500+ studenter. Tech stack: Next.js, Cloudflare D1, TypeScript."`;

export async function generateContent(request: AIGenerationRequest): Promise<string> {
  const prompts: Record<string, string> = {
    'bio': `Skriv en professionell "Om mig"-text för en portfolio baserat på följande information:
${JSON.stringify(request.context, null, 2)}

Texten ska vara ${request.length === 'short' ? '2-3 meningar' : request.length === 'long' ? '4-6 meningar' : '3-4 meningar'}.
Tonen ska vara ${request.tone === 'confident' ? 'självsäker och ambitiös' : request.tone === 'humble' ? 'ödmjuk men kompetent' : 'professionell och engagerande'}.

Returnera ENDAST texten, ingen formatering eller förklaring.`,

    'project-description': `Skriv en övertygande projektbeskrivning för portfolio baserat på:
${JSON.stringify(request.context, null, 2)}

Inkludera:
- Vad projektet gör (1 mening)
- Teknisk komplexitet/utmaningar (1 mening)
- Impact eller resultat (1 mening)

Returnera ENDAST beskrivningen, max 3 meningar.`,

    'achievement': `Omformulera följande achievement/prestation till en slagkraftig bullet point för CV:
${JSON.stringify(request.context, null, 2)}

KRAV:
- Börja med aktivt verb
- Inkludera siffror om möjligt
- Max 1 mening
- Fokusera på resultat, inte aktivitet

Returnera ENDAST bullet pointen.`,

    'cv-summary': `Skriv en professionell sammanfattning för ett CV baserat på:
${JSON.stringify(request.context, null, 2)}

Sammanfattningen ska:
- Vara 2-3 meningar
- Lyfta unika styrkor
- Passa för svenska arbetsmarknaden
- Inkludera relevant erfarenhet och mål

Returnera ENDAST sammanfattningen.`,

    'full-portfolio': `Generera komplett portfolio-content baserat på denna information:
${JSON.stringify(request.context, null, 2)}

Returnera ett JSON-objekt med följande struktur:
{
  "bio": "Om mig-text (3-4 meningar)",
  "tagline": "Kort tagline (max 10 ord)",
  "highlights": [
    {"value": "X+", "label": "Beskrivning"}
  ],
  "projectDescriptions": [
    {"name": "projektnamn", "description": "beskrivning"}
  ]
}

Returnera ENDAST valid JSON.`,

    'rewrite': `Skriv om följande text för att göra den mer professionell och slagkraftig:
${JSON.stringify(request.context, null, 2)}

Behåll samma längd och budskap, men förbättra:
- Ordval
- Siffror och resultat om möjligt
- Aktiva verb
- Tydlighet

Returnera ENDAST den omskrivna texten.`,
  };

  const prompt = prompts[request.type] || prompts['rewrite'];

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  
  throw new Error('Unexpected response type');
}

export async function generatePortfolioFromOnboarding(onboardingData: Record<string, unknown>): Promise<{
  bio: string;
  tagline: string;
  highlights: Array<{ value: string; label: string }>;
  projectDescriptions: Array<{ name: string; description: string }>;
}> {
  const response = await generateContent({
    type: 'full-portfolio',
    context: onboardingData,
    tone: 'professional',
    length: 'medium',
  });

  try {
    // Clean the response - remove markdown code blocks if present
    const cleanedResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    return JSON.parse(cleanedResponse);
  } catch {
    // Fallback if JSON parsing fails
    return {
      bio: response,
      tagline: '',
      highlights: [],
      projectDescriptions: [],
    };
  }
}

export async function improveText(text: string, type: 'bio' | 'project' | 'achievement'): Promise<string> {
  return generateContent({
    type: type === 'bio' ? 'bio' : type === 'project' ? 'project-description' : 'achievement',
    context: { text },
    tone: 'professional',
    length: 'medium',
  });
}
