import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

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

      default:
        return NextResponse.json(
          { error: 'Unknown generation type' },
          { status: 400 }
        );
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
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

    return NextResponse.json({
      content: content.text,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('AI Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
