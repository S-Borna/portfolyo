import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderCVV2, CV_TEMPLATES_V2 } from '@/lib/templates/cv-renderer-v2';
import type { CVData } from '@/lib/templates/cv-renderer-v2';

// ============================================
// CV EXPORT API
// Generates HTML for PDF conversion
// ============================================

// Create Supabase client lazily (not at build time)
function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = getSupabase();

    try {
        // Fetch CV from database
        const { data: cv, error } = await supabase
            .from('cvs')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !cv) {
            return new NextResponse(generateErrorHTML('CV hittades inte'), {
                status: 404,
                headers: { 'Content-Type': 'text/html' },
            });
        }

        // Convert database CV to CVData format
        const cvData: CVData = {
            fullName: cv.full_name || 'Namn Saknas',
            title: cv.title?.split(' ')[0]?.toUpperCase() || 'DEVOPS',
            subtitle: cv.title?.split(' ').slice(1).join(' ').toUpperCase() || 'ENGINEER',
            tagline: extractTagline(cv),
            photoUrl: cv.avatar_url,
            seeking: cv.is_seeking ? {
                active: true,
                title: cv.seeking_title || 'SÖKER LIA',
                period: cv.seeking_period || '',
                description: cv.seeking_description || '',
            } : undefined,
            contact: {
                phone: cv.phone,
                email: cv.email || '',
                linkedin: cv.linkedin,
                github: cv.github,
                location: cv.location,
            },
            portfolioUrl: cv.website,
            technicalSkills: extractTechnicalSkills(cv.skills || []),
            leadershipSkills: extractLeadershipSkills(cv.skills || []),
            languages: (cv.languages || []).map((l: { language: string; level: string }) => ({
                name: l.language,
                level: l.level,
            })),
            references: extractReferences(cv),
            other: [],
            profile: cv.summary || '',
            education: cv.education?.[0] ? {
                title: cv.education[0].degree || '',
                institution: cv.education[0].institution || '',
                period: formatPeriod(cv.education[0].start_date, cv.education[0].end_date),
                bullets: cv.education[0].achievements || [],
            } : undefined,
            projects: (cv.projects || []).slice(0, 2).map((p: { name: string; description: string; url?: string }) => ({
                name: p.name,
                url: p.url,
                bullets: p.description ? [p.description] : [],
            })),
            experience: (cv.experience || []).slice(0, 4).map((e: { title: string; company: string; achievements: string[] }) => ({
                title: e.title,
                company: e.company,
                bullets: e.achievements?.slice(0, 2) || [],
            })),
        };

        // Render HTML
        const templateId = cv.template_id || 'said-dark';
        const html = renderCVV2(cvData, templateId, {
            showPhoto: cv.settings?.show_photo !== false,
            pageSize: cv.settings?.page_size || 'a4',
        });

        // Add print-optimized styles
        const printOptimizedHtml = html.replace(
            '</head>',
            `<style>
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cv-container { break-inside: avoid; }
        }
      </style>
      </head>`
        );

        // Return HTML (client will use browser's print-to-PDF)
        return new NextResponse(printOptimizedHtml, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
                'Content-Disposition': `inline; filename="cv-${sanitizeFilename(cv.full_name || 'cv')}.html"`,
            },
        });

    } catch (error) {
        console.error('CV export error:', error);
        return new NextResponse(generateErrorHTML('Ett fel uppstod'), {
            status: 500,
            headers: { 'Content-Type': 'text/html' },
        });
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractTagline(cv: Record<string, unknown>): string {
    const skills = (cv.skills as Array<{ name: string }> | undefined) || [];
    const topSkills = skills.slice(0, 3).map(s => s.name);
    return topSkills.join(' · ').toUpperCase();
}

function extractTechnicalSkills(skills: Array<{ name: string; category?: string }>): string[] {
    return skills
        .filter(s => ['frontend', 'backend', 'devops', 'database', 'tools'].includes(s.category || ''))
        .map(s => s.name)
        .slice(0, 7);
}

function extractLeadershipSkills(skills: Array<{ name: string; category?: string }>): string[] {
    return skills
        .filter(s => s.category === 'leadership' || s.category === 'soft')
        .map(s => s.name)
        .slice(0, 4);
}

function extractReferences(cv: Record<string, unknown>): string[] {
    // Extract from experience companies
    const experience = (cv.experience as Array<{ company: string }>) || [];
    return experience.map(e => e.company).slice(0, 4);
}

function formatPeriod(start?: string, end?: string): string {
    if (!start) return '';
    const startYear = start.split('-')[0];
    const endYear = end ? end.split('-')[0] : 'Pågående';
    return `${startYear}–${endYear}`;
}

function sanitizeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[åä]/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function generateErrorHTML(message: string): string {
    return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fel | PORTFOLYO.SE</title>
  <style>
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
      background: #0a0a0a;
      color: #fff;
      margin: 0;
    }
    .error {
      text-align: center;
      padding: 2rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #666; }
    a {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: #fff;
      color: #000;
      text-decoration: none;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="error">
    <h1>${message}</h1>
    <p>Kontrollera att CVt finns och försök igen.</p>
    <a href="/dashboard">Till Dashboard</a>
  </div>
</body>
</html>`;
}
