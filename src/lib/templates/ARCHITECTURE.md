# Template System Architecture

## ⚠️ VIKTIGT: EN KÄLLA AV SANNING

All template-logik ska utgå från **DIN DESIGN** (saidborna.com / ditt CV).

### CANONICAL SOURCES (använd dessa)

| Typ | Fil | Beskrivning |
|-----|-----|-------------|
| CV Renderer | `cv-renderer-v2.ts` | SIDEBAR-LAYOUT - alltid 2-kolumn |
| Portfolio Renderer | `portfolio-renderer-v2.ts` | saidborna.com design |
| CV Templates | `cv-renderer-v2.ts` → `CV_TEMPLATES_V2` | Färgvarianter |
| Portfolio Templates | `portfolio-renderer-v2.ts` → `PORTFOLIO_TEMPLATES_V2` | Färgvarianter |

### DEPRECATED (ska tas bort)

- ❌ `cv-renderer.ts` - Gammal single-column
- ❌ `portfolio-renderer.ts` - Gammal renderer
- ❌ `renderer.ts` - Legacy
- ❌ `exports.ts` - Legacy exports

### REGLER

1. **Layout är FIXED** - Alla CV:n har sidebar-layout. Alla portfolios har split-hero.
2. **Endast FÄRGER varierar** - bgPrimary, accent, textPrimary etc.
3. **Templates-sidan visar preview** - Hårdkodad till din design
4. **Renderers genererar HTML** - Använder V2-versioner

### VID ÄNDRINGAR

1. Ändra i `cv-renderer-v2.ts` för CV-struktur
2. Ändra i `portfolio-renderer-v2.ts` för portfolio-struktur
3. Färgvarianter läggs till i respektive `*_TEMPLATES_V2` array
4. Preview i templates-sidan följer automatiskt (samma struktur)

### FLÖDE

```
User väljer template (färgschema)
        ↓
cv-renderer-v2.ts / portfolio-renderer-v2.ts
        ↓
Genererar HTML med vald färg + DIN FASTA LAYOUT
        ↓
Export till PDF / publicerad sida
```
