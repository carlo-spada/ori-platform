import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export interface ProfileFormValue {
  fullName: string
  email: string
  headline?: string
  location?: string
  about?: string
}

export interface ProfileFormProps {
  value: ProfileFormValue
  labels: {
    fullName: string
    fullNamePlaceholder: string
    email: string
    headline: string
    headlinePlaceholder: string
    location: string
    locationPlaceholder: string
    about: string
    aboutPlaceholder: string
    saveButton: string
  }
  onChange?: (value: ProfileFormValue) => void
  onSubmit?: () => void
  isSubmitting?: boolean
}

/**
 * Personal profile information form.
 * Displays editable user details with validation.
 */
export function ProfileForm({
  value,
  labels,
  onChange,
  onSubmit,
  isSubmitting = false,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormValue>(value)

  const handleChange = (field: keyof ProfileFormValue, newValue: string) => {
    const updated = { ...formData, [field]: newValue }
    setFormData(updated)
    onChange?.(updated)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="text-foreground mb-2 block text-sm font-medium"
        >
          {labels.fullName}
        </label>
        <input
          type="text"
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder={labels.fullNamePlaceholder}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-accent w-full rounded-xl border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
          required
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <label
          htmlFor="email"
          className="text-foreground mb-2 block text-sm font-medium"
        >
          {labels.email}
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          readOnly
          className="border-border bg-muted/30 text-muted-foreground w-full cursor-not-allowed rounded-xl border px-4 py-2.5"
        />
      </div>

      {/* Headline */}
      <div>
        <label
          htmlFor="headline"
          className="text-foreground mb-2 block text-sm font-medium"
        >
          {labels.headline}
        </label>
        <input
          type="text"
          id="headline"
          value={formData.headline || ''}
          onChange={(e) => handleChange('headline', e.target.value)}
          placeholder={labels.headlinePlaceholder}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-accent w-full rounded-xl border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="text-foreground mb-2 block text-sm font-medium"
        >
          {labels.location}
        </label>
        <input
          type="text"
          id="location"
          value={formData.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder={labels.locationPlaceholder}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-accent w-full rounded-xl border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
        />
      </div>

      {/* About */}
      <div>
        <label
          htmlFor="about"
          className="text-foreground mb-2 block text-sm font-medium"
        >
          {labels.about}
        </label>
        <textarea
          id="about"
          value={formData.about || ''}
          onChange={(e) => handleChange('about', e.target.value)}
          placeholder={labels.aboutPlaceholder}
          rows={5}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-accent w-full resize-none rounded-xl border px-4 py-2.5 transition-all focus:ring-2 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <div className="border-border flex justify-end border-t pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Saving...
            </>
          ) : (
            labels.saveButton
          )}
        </Button>
      </div>
    </form>
  )
}
