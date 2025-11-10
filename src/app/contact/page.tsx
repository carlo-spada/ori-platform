'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Section } from '@/components/ui/Section'
import { toast } from 'sonner'

export default function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API endpoint
      // For now, simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSuccess(true)
      toast.success(t('contactPage.form.successTitle'), {
        description: t('contactPage.form.successDescription'),
      })

      // Reset form
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Contact form submission failed:', error)
      toast.error(t('contactPage.form.errorTitle'), {
        description: t('contactPage.form.errorDescription'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <Section className="pt-20 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">
            {t('contactPage.hero.eyebrow')}
          </p>
          <h1 className="mb-6 text-4xl font-semibold sm:text-5xl lg:text-6xl">
            {t('contactPage.hero.headline')}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t('contactPage.hero.subheadline')}
          </p>
        </div>
      </Section>

      {/* Contact Content */}
      <Section>
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">
                {t('contactPage.contactInfo.title')}
              </h2>

              {/* Email Card */}
              <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {t('contactPage.contactInfo.email.label')}
                </h3>
                <a
                  href={`mailto:${t('contactPage.contactInfo.email.value')}`}
                  className="mb-2 block text-lg text-accent transition-colors hover:text-accent/80"
                >
                  {t('contactPage.contactInfo.email.value')}
                </a>
                <p className="text-sm text-muted-foreground">
                  {t('contactPage.contactInfo.email.description')}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground">
              {t('contactPage.contactInfo.note')}
            </p>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {t('contactPage.form.successTitle')}
                </h3>
                <p className="mb-6 text-muted-foreground">
                  {t('contactPage.form.successDescription')}
                </p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="min-w-[160px]"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="mb-6 text-2xl font-semibold">
                  {t('contactPage.form.title')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t('contactPage.form.nameLabel')}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('contactPage.form.namePlaceholder')}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {t('contactPage.form.emailLabel')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('contactPage.form.emailPlaceholder')}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t('contactPage.form.messageLabel')}
                    </Label>
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder={t('contactPage.form.messagePlaceholder')}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {t('contactPage.form.submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t('contactPage.form.submitButton')}
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}
