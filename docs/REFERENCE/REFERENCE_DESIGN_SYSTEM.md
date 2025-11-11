---
type: reference-doc
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: reference, design, system.md, platform, system, executive, summary
priority: medium
quick-read-time: 10min
deep-dive-time: 17min
---

# Ori Platform - Design System & UI Patterns Analysis

## Executive Summary

The Ori platform uses a modern, clean design language built on:

- **shadcn/ui** component library
- **Tailwind CSS** with custom HSL color tokens
- **Dark mode first** (with light mode fallback)
- **Glassmorphism** and smooth animations
- **Responsive grid layouts** with accent color highlights
- **Inter font** for typography hierarchy

This document provides the complete patterns needed to create two new public pages that match the existing aesthetic perfectly.

---

## 1. COLOR SYSTEM

### CSS Variables (HSL Format)

All colors are defined in `/src/app/globals.css` using HSL for maximum flexibility:

**Light Mode (Root):**

```css
--bg: 0 0% 100%; /* Pure white */
--surface: 0 0% 98%; /* Off-white for surfaces */
--muted: 214 20% 70%; /* Neutral gray */
--text: 215 27% 6%; /* Almost black */
--accent: 203 100% 74%; /* Bright cyan-blue (PRIMARY) */
--accent-2: 248 100% 74%; /* Purple-blue (SECONDARY) */
--border: 214 20% 85%; /* Light gray for borders */
```

**Dark Mode (.dark class):**

```css
--bg: 215 27% 6%; /* Very dark blue-gray */
--surface: 215 22% 8%; /* Slightly lighter dark */
--text: 214 40% 95%; /* Near white */
--accent: 203 100% 74%; /* Same bright cyan-blue */
--accent-2: 248 100% 74%; /* Same purple-blue */
--border: 214 20% 15%; /* Dark gray for borders */
```

### Tailwind Color Palette

| Color                | Usage                           | Tailwind Classes                     |
| -------------------- | ------------------------------- | ------------------------------------ |
| **Primary**          | Buttons, highlights, accents    | `bg-primary text-primary-foreground` |
| **Accent**           | Icons, highlights, hover states | `text-accent bg-accent/10`           |
| **Foreground**       | Main text, headings             | `text-foreground`                    |
| **Muted Foreground** | Secondary text, descriptions    | `text-muted-foreground`              |
| **Card**             | Backgrounds for card components | `bg-card`                            |
| **Surface**          | Section backgrounds             | `bg-surface/50`                      |
| **Border**           | Dividers, edges                 | `border-border`                      |

### Color Applications

```tsx
// Bright primary accent (CTA buttons, headers)
className = 'bg-primary text-primary-foreground'

// Light accent background with accent text (icons, badges)
className = 'bg-accent/10'
className = 'text-accent'

// Cards with subtle hover
className = 'border-border bg-card hover:border-accent/50'

// Sections with subtle background
className = 'bg-surface/50'

// Muted/secondary text
className = 'text-muted-foreground'
```

---

## 2. TYPOGRAPHY HIERARCHY

### Font Family

**Inter** (system fonts fallback)

- All sizes use `font-smooth` for consistency
- No custom fonts needed

### Heading Scale

| Element   | Classes                                          | Use Case                       |
| --------- | ------------------------------------------------ | ------------------------------ |
| **H1**    | `text-4xl sm:text-5xl lg:text-6xl font-semibold` | Page heroes, main titles       |
| **H2**    | `text-3xl sm:text-4xl font-semibold`             | Section titles                 |
| **H3**    | `text-xl font-semibold`                          | Card titles, subsections       |
| **Body**  | `text-base leading-relaxed`                      | Paragraph text                 |
| **Small** | `text-sm`                                        | Metadata, labels, descriptions |
| **Tiny**  | `text-xs`                                        | Badges, overlines              |

### Typography Patterns

```tsx
// Page header with eyebrow
<p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
  Eyebrow text
</p>
<h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
  Main heading
</h1>
<p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
  Subheadline text
</p>

// Section heading
<h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
  Section Title
</h2>
<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
  Section subtitle
</p>

// Body text
<p className="text-lg leading-relaxed text-muted-foreground">
  Regular paragraph with comfortable line-height
</p>
```

---

## 3. SPACING & LAYOUT PATTERNS

### Section Component

The base container for all public page sections (defined in `/src/components/ui/Section.tsx`):

```tsx
<Section className="...optional classes">{/* Content goes here */}</Section>
```

**Default spacing:**

- Padding: `px-4 sm:px-6 lg:px-8` + `py-12 sm:py-16 lg:py-20`
- Max width: `max-w-7xl`
- Margin: `mx-auto w-full`

### Grid Patterns

**4-column grid (features, values):**

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
  {/* Cards */}
</div>
```

**3-column grid (pricing, testimonials, features):**

```tsx
<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
  {/* Cards */}
</div>
```

**2-column grid (values):**

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2">{/* Cards */}</div>
```

**2-column split (text + image):**

```tsx
<div className="grid grid-cols-1 items-center gap-12 lg:gap-16 xl:grid-cols-2">
  {/* Content column */}
  {/* Image/Visual column */}
</div>
```

### Spacing Rules

```tsx
// Section padding (varies by size)
py-12 sm:py-16 lg:py-20

// Title spacing (bottom margin)
mb-4           // After eyebrow
mb-6, mb-8     // After h1/h2
mb-12           // After full section header

// Gap between cards
gap-6           // Compact
gap-8           // Comfortable
gap-12          // Spacious

// Max widths for content
max-w-2xl       // Narrower content (text-heavy)
max-w-3xl       // Comfortable text width
max-w-4xl, max-w-6xl  // Wider containers (grids)
```

---

## 4. COMPONENT PATTERNS

### Card Component

**Basic Card:**

```tsx
<Card className="border-border bg-card p-6 transition-colors duration-200 hover:border-accent/50">
  {/* Content */}
</Card>
```

**Features:**

- Default border: `border-border` (light gray)
- Background: `bg-card`
- Hover effect: Border becomes lighter, slightly transparent accent color
- Shadow: `shadow-md` (default from shadcn/ui)

### Button Component

**Variants:**

```tsx
// Primary (filled background)
<Button size="lg" className="w-full sm:w-auto">
  Sign Up for Free
</Button>

// Ghost (text only, hover background)
<Button variant="ghost" size="lg">
  Learn More
</Button>

// Outline (bordered)
<Button variant="outline" size="lg">
  Explore
</Button>

// With gradient (special primary button)
<Button className="gradient-primary rounded-xl shadow-sm">
  Sign up
</Button>
```

**Sizes:**

```
size="lg"  // Height: 11px, Padding: 8px horizontal
size="default"  // Height: 10px, Padding: 4px horizontal
```

### Icon Patterns

**Icon Container (from ValuePropositionSection):**

```tsx
<div
  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10"
  aria-hidden="true"
>
  <Icon className="h-6 w-6 text-accent" />
</div>
```

**Larger Icon Container (from HowItWorksSection):**

```tsx
<div
  className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent/20 bg-accent/10"
  aria-hidden="true"
>
  <Icon className="h-10 w-10 text-accent" />
</div>
```

---

## 5. SECTION PATTERNS (Public Pages)

### Pattern: Hero Section

Used in landing page (`HeroSection.tsx`)

```tsx
<Section className="relative flex min-h-[600px] items-center justify-center overflow-hidden">
  {/* Background illustration (optional) */}
  <div className="pointer-events-none absolute inset-0 opacity-30">
    <Illustration />
  </div>

  {/* Content */}
  <div className="relative z-10 mx-auto max-w-4xl text-center">
    <p className="mb-4 text-sm font-medium uppercase tracking-wide text-accent">
      {eyebrow}
    </p>
    <h1 className="mb-6 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
      {headline}
    </h1>
    <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
      {subheadline}
    </p>

    {/* CTAs */}
    <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg">{primaryCta}</Button>
      <Button asChild variant="ghost" size="lg">
        <Link href="#">{secondaryCta}</Link>
      </Button>
    </div>

    {/* Reassurance */}
    <p className="text-sm text-muted-foreground">{reassurance}</p>
  </div>
</Section>
```

### Pattern: Value Cards Section

Used in landing, about, and features pages

```tsx
<Section data-testid="values" className="bg-surface/50">
  {/* Header */}
  <div className="mb-12 text-center">
    <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
      {title}
    </h2>
    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
      {subtitle}
    </p>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
    {values.map((value) => (
      <Card
        key={value.title}
        className="border-border bg-card p-6 transition-colors duration-200 hover:border-accent/50"
      >
        <div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10"
          aria-hidden="true"
        >
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {value.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {value.description}
        </p>
      </Card>
    ))}
  </div>
</Section>
```

### Pattern: Feature Section (Left/Right Layout)

Used in features page (`FeatureSection.tsx`)

```tsx
<Section id={id}>
  <div className="grid grid-cols-1 items-center gap-12 lg:gap-16 xl:grid-cols-2">
    {/* Content */}
    <div className={cn('space-y-6', align === 'right' && 'xl:order-2')}>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wider text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        {name}
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground">
        {description}
      </p>
      {points && (
        <ul className="space-y-3">
          {points.map((point, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-muted-foreground"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Visual */}
    <div
      className={cn(
        'relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted/5 shadow-md',
        align === 'right' && 'xl:order-1',
      )}
      aria-hidden="true"
    >
      {visual || <div>{/* placeholder */}</div>}
    </div>
  </div>
</Section>
```

### Pattern: Testimonial/Social Proof Section

Used in landing page (`SocialProofSection.tsx`)

```tsx
<Section className="bg-surface/50">
  {/* Header */}
  <div className="mb-12 text-center">
    <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
      {title}
    </h2>
    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
      {subtitle}
    </p>
  </div>

  {/* Grid */}
  <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
    {testimonials.map((testimonial, index) => (
      <Card
        key={index}
        className="border-border bg-card p-6 transition-colors duration-200 hover:border-accent/50"
      >
        <Quote className="mb-4 h-8 w-8 text-accent/30" aria-hidden="true" />
        <blockquote className="mb-4 text-base leading-relaxed text-foreground">
          &quot;{testimonial.quote}&quot;
        </blockquote>
        <div className="mt-4 border-t border-border pt-4">
          <cite className="not-italic">
            <p className="font-medium text-foreground">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </cite>
        </div>
      </Card>
    ))}
  </div>
</Section>
```

### Pattern: FAQ/Accordion Section

Used in pricing and landing pages (`FAQSection.tsx`)

```tsx
<Section>
  {/* Header */}
  <div className="mb-12 text-center">
    <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
      {title}
    </h2>
    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
      {subtitle}
    </p>
  </div>

  {/* Accordion */}
  <div className="mx-auto max-w-3xl">
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-base font-medium text-foreground hover:text-accent">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
</Section>
```

### Pattern: Bottom CTA Section

Used to transition between pages (`BottomCTASection.tsx`)

```tsx
<Section className="bg-surface/50">
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
      {headline}
    </h2>
    <p className="mb-8 text-lg text-muted-foreground">{description}</p>

    {/* CTAs */}
    <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg" className="w-full sm:w-auto">
        {primaryCta}
      </Button>
      <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
        <Link href={secondaryHref}>{secondaryCta}</Link>
      </Button>
    </div>

    {/* Strapline */}
    <p className="text-sm italic text-muted-foreground">{strapline}</p>
  </div>
</Section>
```

---

## 6. SPECIAL EFFECTS & UTILITIES

### Glassmorphism

**Header backdrop blur:**

```tsx
className = 'backdrop-blur-header sticky top-0 z-50'
```

**CSS definition in globals.css:**

```css
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-header {
    backdrop-filter: blur(12px);
    background-color: hsl(var(--surface) / 0.7);
  }
}
```

### Gradient Button

```tsx
className =
  'gradient-primary rounded-xl shadow-sm transition-opacity hover:opacity-95'
```

**CSS definition:**

```css
.gradient-primary {
  background: linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent-2)));
}
```

### Glow Effects

```css
.glow {
  box-shadow: 0 0 20px hsl(var(--accent) / 0.5);
}

.glow-hover:hover {
  box-shadow: 0 0 30px hsl(var(--accent) / 0.7);
}
```

### Smooth Transitions

```tsx
// Standard transition
className = 'transition-all duration-200'

// Specific transitions
className = 'transition-colors duration-200'
className = 'transition-opacity duration-200'

// Hover effects
className = 'hover:border-accent/50'
className = 'hover:text-foreground'
className = 'hover:opacity-95'
```

---

## 7. RESPONSIVE DESIGN PATTERNS

### Breakpoints (Tailwind Standard)

- `sm`: 640px (tablets)
- `md`: 768px (small desktops)
- `lg`: 1024px (desktops)
- `xl`: 1280px (large desktops)

### Mobile-First Approach

```tsx
// Text sizing - starts small, grows
className = 'text-4xl sm:text-5xl lg:text-6xl'

// Padding - starts tight, grows
className = 'px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'

// Grid - stacks on mobile, spreads on desktop
className = 'grid grid-cols-1 gap-6 md:grid-cols-3'

// Flex direction
className = 'flex flex-col items-center justify-center gap-4 sm:flex-row'

// Display
className = 'hidden lg:flex' // Hidden on mobile, shown on lg+
className = 'lg:hidden' // Shown on mobile, hidden on lg+
```

### Content Max-Widths

```tsx
max-w-2xl  // ~672px - narrower content
max-w-3xl  // ~768px - comfortable text width
max-w-4xl  // ~896px - wide content
max-w-5xl  // ~1024px
max-w-6xl  // ~1152px - 3-column grid container
max-w-7xl  // ~1280px - section default (from Section.tsx)
```

---

## 8. TRANSLATION STRUCTURE (i18n)

All public pages use **react-i18next** for translations.

### Translation File Location

`/public/locales/en/translation.json` (English example)

### Usage Pattern

```tsx
import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation()

  return (
    <h1>{t('section.key')}</h1>
    <p>{t('section.subkey')}</p>
  )
}
```

### Translation Namespace Structure

```json
{
  "nav": { "items": { "features": "...", "pricing": "..." } },
  "footer": { "columns": { ... } },
  "cta": { "login": "...", "signup": "..." },
  "landing": { "hero": { "headline": "..." }, "values": [...] },
  "pricingPage": { "header": { ... }, "plans": [...] },
  "aboutPage": { "header": { ... }, "problem": { ... } },
  "featuresPage": { "header": { ... }, "features": [...] }
}
```

### Safe Array Extraction Pattern

Used when fetching array data from translations:

```tsx
const safeArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? value : []
}

const items = safeArray<{ id: string; name: string }>(
  t('section.items', { returnObjects: true }),
)
```

---

## 9. EXISTING PUBLIC PAGES REFERENCE

### Landing Page (`src/app/page.tsx`)

Composition:

1. HeroSection (headline + 2 CTAs)
2. ValuePropositionSection (4-column value cards)
3. HowItWorksSection (3-step flow with icons)
4. SocialProofSection (3 testimonials)
5. FAQSection (4 FAQs with accordion)
6. BottomCTASection (call-to-action footer)

### Pricing Page (`src/app/pricing/page.tsx`)

Composition:

1. Header (title + billing toggle)
2. PricingCard grid (3 plans)
3. FeatureComparisonTable (detailed comparison)
4. FAQSection (pricing FAQs)

### Features Page (`src/app/features/page.tsx`)

Composition:

1. PageHeader (eyebrow + title + reassurance)
2. FeatureToc (table of contents)
3. Multiple FeatureSection components (alternating left/right)
4. PrivacyCallout (info box with checkmarks)
5. BottomCTASection

### About Page (`src/app/about/page.tsx`)

Composition:

1. Header section (eyebrow + title + subtitle)
2. Problem section (narrative text)
3. Vision section (narrative text)
4. Values section (2-column value cards)
5. Final CTA section (headline + 2 buttons)

### Blog Page (`src/app/blog/page.tsx`)

Uses BlogPostCard components in a grid

### Legal Pages (`src/app/legal/*/page.tsx`)

Uses LegalPageLayout and LegalDocument components

---

## 10. QUICK IMPLEMENTATION CHECKLIST

When creating a new public page:

- [ ] Wrap in `PublicLayout` component
- [ ] Add page-level SEO (useEffect + setDocumentMeta)
- [ ] Use i18n (`useTranslation()` hook)
- [ ] Structure content in `Section` components
- [ ] Use 3-step grid pattern (1 column mobile → responsive)
- [ ] Apply color scheme: primary buttons, accent icons, muted-foreground text
- [ ] Include 2-4 CTAs across the page
- [ ] End with BottomCTASection
- [ ] Test responsive design (mobile first)
- [ ] Add translations to `/public/locales/en/translation.json`
- [ ] Ensure all images/visuals have proper alt text or aria-hidden

---

## 11. COMMON COMPONENT IMPORTS

```tsx
// UI Components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Section } from '@/components/ui/Section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Layout
import { PublicLayout } from '@/components/layout/PublicLayout'
import { BottomCTASection } from '@/components/landing/BottomCTASection'

// Icons (Lucide React)
import {
  Target,
  TrendingUp,
  FileText,
  Activity,
  CheckCircle2,
  Quote,
} from 'lucide-react'

// i18n & Navigation
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Utilities
import { cn } from '@/lib/utils'
```

---

## 12. DESIGN PRINCIPLES OBSERVED

1. **Hierarchy**: Size, weight, and color create visual hierarchy
2. **Whitespace**: Generous spacing between sections (py-12-20)
3. **Consistency**: Repeating patterns (cards, grids, typography)
4. **Contrast**: Accent color (bright cyan-blue) against neutral backgrounds
5. **Accessibility**: Semantic HTML, ARIA labels, focus states, color-blind safe
6. **Performance**: No heavy animations, backdrop blur fallback for older browsers
7. **Scalability**: Component-based, translation-ready, responsive-first
8. **Subtlety**: Soft shadows, subtle borders, smooth transitions (no jarring effects)

---

## 13. FILE STRUCTURE FOR NEW PAGES

```
src/
├── app/
│   └── your-page/
│       └── page.tsx              // Main page component
├── components/
│   ├── your-page/
│   │   ├── Section1.tsx          // Reusable subsections
│   │   ├── Section2.tsx
│   │   └── ...
│   └── ui/                       // Shared UI components
└── lib/
    └── seo.ts                    // SEO helper functions

public/
└── locales/
    └── en/
        └── translation.json      // Add your translations here
```

---

## Ready to Build

You now have the complete design system. Use this document as a reference while creating your two new public pages. The patterns are battle-tested across landing, pricing, features, and about pages—replicate them for consistency.

**Key files to reference:**

- `/src/components/ui/Section.tsx` - Base container
- `/src/app/globals.css` - All color tokens & effects
- `/src/components/landing/` - Section component patterns
- `/src/app/page.tsx` - Landing page structure
- `/tailwind.config.ts` - Tailwind configuration

Happy building!
