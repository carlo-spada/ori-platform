import { Section } from '@/components/ui/Section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useTranslation } from 'react-i18next'

export function FAQSection() {
  const { t } = useTranslation()

  const faqs = [
    { q: t('landing.faqs.0.q'), a: t('landing.faqs.0.a') },
    { q: t('landing.faqs.1.q'), a: t('landing.faqs.1.a') },
    { q: t('landing.faqs.2.q'), a: t('landing.faqs.2.a') },
    { q: t('landing.faqs.3.q'), a: t('landing.faqs.3.a') },
  ]

  return (
    <Section data-testid="faq">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
          {t('landing.faqTitle')}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t('landing.faqSubtitle')}
        </p>
      </div>

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
  )
}
