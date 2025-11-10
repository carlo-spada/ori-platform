# Design System Quick Reference - Copy/Paste Ready

## 1. PAGE BOILERPLATE

```tsx
'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { setDocumentMeta } from '@/lib/seo'

export default function YourPage() {
  const { t } = useTranslation()

  useEffect(() => {
    setDocumentMeta({
      title: t('yourPage.title'),
      description: t('yourPage.description'),
    })
  }, [t])

  return <PublicLayout>{/* Your sections here */}</PublicLayout>
}
```

---

## 2. HERO SECTION (Minimal)

```tsx
<Section className="relative flex min-h-[600px] items-center justify-center">
  <div className="relative z-10 mx-auto max-w-4xl text-center">
    <p className="mb-4 text-sm font-medium uppercase tracking-wide text-accent">
      Eyebrow
    </p>
    <h1 className="mb-6 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
      Main Headline
    </h1>
    <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
      Subheadline goes here with details about your offering.
    </p>

    <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg" className="w-full sm:w-auto">
        Primary Action
      </Button>
      <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
        <a href="#section">Secondary Action</a>
      </Button>
    </div>

    <p className="text-sm text-muted-foreground">Reassurance or trust signal</p>
  </div>
</Section>
```

---

## 3. SECTION WITH TITLE & GRID

```tsx
<Section className="bg-surface/50">
  <div className="mb-12 text-center">
    <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
      Section Title
    </h2>
    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
      Section subtitle explaining what's below
    </p>
  </div>

  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    {/* Cards or items go here */}
  </div>
</Section>
```

---

## 4. FEATURE CARD

```tsx
<Card className="border-border bg-card p-6 transition-colors duration-200 hover:border-accent/50">
  <div
    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10"
    aria-hidden="true"
  >
    <IconComponent className="h-6 w-6 text-accent" />
  </div>
  <h3 className="mb-2 text-lg font-semibold text-foreground">Card Title</h3>
  <p className="text-sm leading-relaxed text-muted-foreground">
    Card description
  </p>
</Card>
```

---

## 5. TWO-COLUMN LAYOUT (Text + Image)

```tsx
<Section>
  <div className="grid grid-cols-1 items-center gap-12 lg:gap-16 xl:grid-cols-2">
    {/* Text Column */}
    <div className="space-y-6">
      <p className="text-sm font-medium uppercase tracking-wider text-accent">
        Eyebrow
      </p>
      <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        Feature Title
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground">
        Feature description and benefits
      </p>
      <ul className="space-y-3">
        <li className="flex items-start gap-3 text-muted-foreground">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-accent"
            aria-hidden="true"
          />
          <span>Benefit point 1</span>
        </li>
        <li className="flex items-start gap-3 text-muted-foreground">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-accent"
            aria-hidden="true"
          />
          <span>Benefit point 2</span>
        </li>
      </ul>
    </div>

    {/* Image Column */}
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted/5 shadow-md"
      aria-hidden="true"
    >
      {/* Image or visual placeholder */}
    </div>
  </div>
</Section>
```

---

## 6. TESTIMONIAL/QUOTE CARD

```tsx
<Card className="border-border bg-card p-6 transition-colors duration-200 hover:border-accent/50">
  <Quote className="mb-4 h-8 w-8 text-accent/30" aria-hidden="true" />
  <blockquote className="mb-4 text-base leading-relaxed text-foreground">
    &quot;This is the testimonial quote that shows social proof and builds
    trust.&quot;
  </blockquote>
  <div className="mt-4 border-t border-border pt-4">
    <cite className="not-italic">
      <p className="font-medium text-foreground">Author Name</p>
      <p className="text-sm text-muted-foreground">Job Title / Company</p>
    </cite>
  </div>
</Card>
```

---

## 7. VALUE/BENEFIT CARD (Simple)

```tsx
<div className="rounded-xl border border-border bg-card/50 p-6 transition-all duration-200 hover:border-accent/50 hover:shadow-md">
  <h3 className="mb-3 text-xl font-semibold text-foreground">Value Title</h3>
  <p className="leading-relaxed text-muted-foreground">
    Brief description of the value proposition
  </p>
</div>
```

---

## 8. STEP-BY-STEP PROCESS (3 Steps)

```tsx
<Section>
  <div className="mb-12 text-center">
    <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
      How It Works
    </h2>
    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
      Three simple steps to get started
    </p>
  </div>

  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
    {[1, 2, 3].map((step, index) => (
      <div key={step} className="relative text-center">
        {/* Connector line (hidden on mobile) */}
        {index < 2 && (
          <div
            className="absolute left-[60%] top-12 hidden h-px w-[80%] bg-border md:block"
            aria-hidden="true"
          />
        )}

        {/* Step circle */}
        <div
          className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent/20 bg-accent/10"
          aria-hidden="true"
        >
          <StepIcon className="h-10 w-10 text-accent" />
        </div>

        <h3 className="mb-3 text-xl font-semibold text-foreground">
          {step}. Step Title
        </h3>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
          Description of what happens in this step
        </p>
      </div>
    ))}
  </div>
</Section>
```

---

## 9. FAQ/ACCORDION SECTION

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
;<Section>
  <div className="mb-12 text-center">
    <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
      Frequently Asked Questions
    </h2>
    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
      Common questions and answers
    </p>
  </div>

  <div className="mx-auto max-w-3xl">
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`faq-${index}`}>
          <AccordionTrigger className="text-left text-base font-medium text-foreground hover:text-accent">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
</Section>
```

---

## 10. BOTTOM CTA SECTION

```tsx
<Section className="bg-surface/50">
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
      Ready to get started?
    </h2>
    <p className="mb-8 text-lg text-muted-foreground">
      Brief description of next steps
    </p>

    <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg" className="w-full sm:w-auto">
        Sign Up
      </Button>
      <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
        <a href="#learn">Learn More</a>
      </Button>
    </div>

    <p className="text-sm italic text-muted-foreground">
      Optional tagline or reassurance
    </p>
  </div>
</Section>
```

---

## 11. COLOR QUICK REFERENCE

```tsx
// Primary action (fill button)
className = 'bg-primary text-primary-foreground'

// Secondary/outline button
className = 'border border-input bg-background hover:bg-accent'

// Ghost button (text only)
className = 'hover:bg-accent hover:text-accent-foreground'

// Accent icon container
className = 'bg-accent/10'
className = 'text-accent'

// Card hover effect
className = 'border-border hover:border-accent/50'

// Section background (subtle)
className = 'bg-surface/50'

// Main text
className = 'text-foreground'

// Secondary text
className = 'text-muted-foreground'

// Borders
className = 'border-border'

// Subtle text (metadata)
className = 'text-sm text-muted-foreground'

// Gradient button (special)
className = 'gradient-primary'
```

---

## 12. RESPONSIVE SIZING EXAMPLES

```tsx
// Headings scale
className = 'text-4xl sm:text-5xl lg:text-6xl' // h1 variant

// Section padding scales
className = 'py-12 sm:py-16 lg:py-20'

// Grid responsive
className = 'grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'

// Button width mobile to desktop
className = 'w-full sm:w-auto'

// Flex direction
className = 'flex flex-col items-center gap-4 sm:flex-row'

// Hidden/shown responsive
className = 'hidden lg:flex' // Hidden mobile, shown lg+
className = 'lg:hidden' // Shown mobile, hidden lg+

// Text sizing
className = 'text-sm' // Small text (metadata)
className = 'text-base' // Normal body text
className = 'text-lg' // Larger body text
className = 'text-xl' // Large text

// Max widths (for content)
className = 'mx-auto max-w-2xl' // Narrow (672px)
className = 'mx-auto max-w-3xl' // Comfortable (768px)
className = 'mx-auto max-w-6xl' // Wide grid (1152px)
```

---

## 13. i18n TRANSLATION PATTERN

In your page component:

```tsx
const { t } = useTranslation()

// Single key
<h1>{t('yourPage.hero.title')}</h1>

// Namespace with returnObjects for arrays
const items = safeArray<{ id: string; title: string }>(
  t('yourPage.items', { returnObjects: true })
)

// Safe array helper
const safeArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? value : []
}
```

In `/public/locales/en/translation.json`:

```json
{
  "yourPage": {
    "title": "Page Title",
    "description": "Meta description",
    "hero": {
      "title": "Hero headline",
      "subtitle": "Hero subheadline"
    },
    "items": [
      { "id": "1", "title": "Item 1" },
      { "id": "2", "title": "Item 2" }
    ]
  }
}
```

---

## 14. ICON USAGE PATTERNS

```tsx
import { CheckCircle2, Quote, Target, TrendingUp } from 'lucide-react'

// Icon in container
<div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
  <CheckCircle2 className="h-6 w-6 text-accent" />
</div>

// Larger icon circle
<div className="inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent/20 bg-accent/10">
  <Icon className="h-10 w-10 text-accent" />
</div>

// Icon in list item
<li className="flex items-start gap-3">
  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
  <span>List item text</span>
</li>

// Quote icon (testimonials)
<Quote className="mb-4 h-8 w-8 text-accent/30" />

// Icon dimensions
h-4 w-4   // xs (12px)
h-5 w-5   // sm (20px)
h-6 w-6   // md (24px)
h-8 w-8   // lg (32px)
h-10 w-10 // xl (40px)
```

---

## 15. COMMON PATTERNS CHECKLIST

- [ ] Page wrapped in `<PublicLayout>`
- [ ] useEffect with setDocumentMeta() for SEO
- [ ] useTranslation() for i18n
- [ ] Sections use `<Section>` wrapper component
- [ ] Hero section with eyebrow + h1 + subheadline
- [ ] Section headers centered with title + subtitle
- [ ] Grids use responsive columns (1 → md-cols-2 → xl-cols-3/4)
- [ ] Cards have hover effect (border accent, shadow)
- [ ] Icons in accent color containers (bg-accent/10 + text-accent)
- [ ] CTAs use size="lg" buttons
- [ ] Spacing: mb-4 (after eyebrow), mb-6-8 (after headings), mb-12 (after full headers)
- [ ] Text colors: foreground (main), muted-foreground (secondary)
- [ ] Section background option: bg-surface/50 (subtle)
- [ ] Ends with BottomCTASection
- [ ] Tested on mobile (3 breakpoints: default, sm, lg)

---

## Quick File Reference

| What         | Where                                    | Import                       |
| ------------ | ---------------------------------------- | ---------------------------- |
| Colors       | `src/app/globals.css`                    | CSS variables                |
| Button       | `src/components/ui/button.tsx`           | `import { Button }`          |
| Card         | `src/components/ui/card.tsx`             | `import { Card }`            |
| Section      | `src/components/ui/Section.tsx`          | `import { Section }`         |
| Layout       | `src/components/layout/PublicLayout.tsx` | `import { PublicLayout }`    |
| SEO          | `src/lib/seo.ts`                         | `import { setDocumentMeta }` |
| i18n         | `react-i18next`                          | `import { useTranslation }`  |
| Translations | `public/locales/en/translation.json`     | Edit for copy                |

Ready to build! 🚀
