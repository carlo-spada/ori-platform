import { Section } from '@/components/ui/Section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';

export function FAQSection() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('landing.faqs.0.q'), a: t('landing.faqs.0.a') },
    { q: t('landing.faqs.1.q'), a: t('landing.faqs.1.a') },
    { q: t('landing.faqs.2.q'), a: t('landing.faqs.2.a') },
    { q: t('landing.faqs.3.q'), a: t('landing.faqs.3.a') },
  ];

  return (
    <Section data-testid="faq">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          {t('landing.faqTitle')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('landing.faqSubtitle')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:text-accent">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
