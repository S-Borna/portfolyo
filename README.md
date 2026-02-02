# PL0 - Prompt Layer Zero

**The Pre-Build Prompt Engine**

Transform any idea—no matter how vague—into an AI-executable build specification before you touch Lovable, Cursor, or ChatGPT.

![PL0 Screenshot](docs/screenshot.png)

## What is PL0?

PL0 is the missing layer between "I have an idea" and "I'm using an AI tool to build."

Every AI build tool assumes the user knows what they want. They don't.
**The failure happens at input, not execution.**

PL0 fixes the input.

## Features

### 🔍 Intelligent Idea Deconstruction

- Identifies product category, real problem, and complexity
- Extracts core features vs. non-features for MVP
- Analyzes AI vs. non-AI components
- Suggests tech stack options
- Estimates time and cost

### 🚦 Reality Gate

- Complexity score (1-10)
- Rebuild risk percentage
- Critical warnings before you build

### 📉 Scope Collapse Engine

- Auto-generates 3 scoped-down alternatives
- Preserves core value while reducing complexity
- Aggressive / Moderate / Conservative options

### ✨ Prompt Synthesis

- Tool-optimized prompts for Lovable, v0, Cursor, ChatGPT, Claude
- Safe / Balanced / Ambitious variants
- Quality scoring (0-100)
- Anti-pattern injection
- Follow-up prompts included

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (for Claude)
- Supabase account (optional, for persistence)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-layer-zero.git
cd prompt-layer-zero

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# ANTHROPIC_API_KEY=your_key_here
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting Up Supabase (Optional)

1. Create a new Supabase project
2. Run the schema in `supabase/schema.sql`
3. Add your Supabase credentials to `.env.local`

## Project Structure

```
prompt-engine/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── deconstruct/   # Idea analysis endpoint
│   │   │   ├── scope-collapse/# Alternatives generation
│   │   │   ├── synthesize/    # Prompt generation
│   │   │   └── score/         # Quality scoring
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/
│   │   ├── phases/            # Phase-specific components
│   │   │   ├── IdeaInput.tsx
│   │   │   ├── DeconstructionView.tsx
│   │   │   ├── ScopeAlternativesView.tsx
│   │   │   ├── ToolSelectionView.tsx
│   │   │   └── PromptOutputView.tsx
│   │   └── ui/                # Reusable UI components
│   │
│   └── lib/
│       ├── prompts/           # System prompts
│       │   ├── deconstruction.ts
│       │   ├── scope-collapse.ts
│       │   └── synthesis.ts
│       ├── llm.ts             # LLM client wrapper
│       ├── types.ts           # TypeScript definitions
│       └── utils.ts           # Utility functions
│
├── supabase/
│   └── schema.sql             # Database schema
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## How It Works

### Phase 1: Deconstruction

User inputs any idea → System analyzes and extracts:

- Category & real problem
- Complexity score & drivers
- Core features vs. non-features
- Data requirements
- AI components needed
- Tech stack recommendations
- Time & cost estimates
- Rebuild risk assessment

### Phase 2: Reality Gate

User sees the analysis and must choose:

- **Proceed** → Continue to prompt generation
- **Alternatives** → See scoped-down options
- **Start Over** → Try a different idea

### Phase 3: Scope Collapse (if needed)

System generates 3 alternatives:

1. **Aggressive** (2-3 weeks, 60-70% scope reduction)
2. **Moderate** (4-6 weeks, 40-50% scope reduction)
3. **Conservative** (6-8 weeks, 20-30% scope reduction)

### Phase 4: Tool Selection

User selects their target tool:

- Lovable
- v0 by Vercel
- Cursor
- ChatGPT
- Claude
- Generic LLM

### Phase 5: Prompt Output

System generates optimized prompts in 3 variants:

- **Safe** (95% success rate, minimal scope)
- **Balanced** (80% success rate, core features)
- **Ambitious** (60% success rate, full vision)

Each prompt includes:

- Quality score breakdown
- Usage instructions
- Expected output
- Warnings
- Follow-up prompts

## API Reference

### POST /api/deconstruct

Analyzes a raw idea and returns structured analysis.

```typescript
// Request
{ idea: string }

// Response
{ success: boolean, data: DeconstructionResult }
```

### POST /api/scope-collapse

Generates scoped-down alternatives.

```typescript
// Request
{ idea: string, deconstruction: DeconstructionResult }

// Response
{ success: boolean, data: ScopeCollapseResult }
```

### POST /api/synthesize

Generates an optimized build prompt.

```typescript
// Request
{
  idea: string,
  deconstruction: DeconstructionResult,
  selectedScope: ScopeAlternative | null,
  tool: TargetTool,
  variant: PromptVariant
}

// Response
{ success: boolean, data: SynthesizedPrompt }
```

### POST /api/score

Evaluates prompt quality.

```typescript
// Request
{ promptText: string, tool: TargetTool }

// Response
{ success: boolean, data: QualityScore }
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Next.js, Claude, and Tailwind CSS.
