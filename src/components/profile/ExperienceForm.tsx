import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export interface ExperienceFormData {
  company: string
  role: string
  startDate: string
  endDate?: string
  description?: string
  isCurrent?: boolean
}

export interface ExperienceFormProps {
  initialValues?: ExperienceFormData
  onSave: (values: ExperienceFormData) => void
  onCancel: () => void
  labels: {
    companyLabel: string
    companyPlaceholder: string
    roleLabel: string
    rolePlaceholder: string
    startDateLabel: string
    endDateLabel: string
    isCurrentLabel: string
    descriptionLabel: string
    descriptionPlaceholder: string
    saveButton: string
    cancelButton: string
  }
}

export function ExperienceForm({
  initialValues,
  onSave,
  onCancel,
  labels,
}: ExperienceFormProps) {
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: initialValues?.company || '',
    role: initialValues?.role || '',
    startDate: initialValues?.startDate || '',
    endDate: initialValues?.endDate || '',
    description: initialValues?.description || '',
    isCurrent: initialValues?.isCurrent || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.role.trim()) newErrors.role = 'Role is required'
    if (!formData.startDate.trim())
      newErrors.startDate = 'Start date is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear end date if current position
    const submitData = { ...formData }
    if (formData.isCurrent) {
      submitData.endDate = undefined
    }

    onSave(submitData)
  }

  const handleChange = (
    field: keyof ExperienceFormData,
    value: string | boolean,
  ) => {
    setFormData({ ...formData, [field]: value })
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="company">{labels.companyLabel}</Label>
        <Input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder={labels.companyPlaceholder}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? 'company-error' : undefined}
        />
        {errors.company && (
          <p id="company-error" className="text-sm text-destructive">
            {errors.company}
          </p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">{labels.roleLabel}</Label>
        <Input
          id="role"
          type="text"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder={labels.rolePlaceholder}
          aria-invalid={!!errors.role}
          aria-describedby={errors.role ? 'role-error' : undefined}
        />
        {errors.role && (
          <p id="role-error" className="text-sm text-destructive">
            {errors.role}
          </p>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate">{labels.startDateLabel}</Label>
        <Input
          id="startDate"
          type="month"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          aria-invalid={!!errors.startDate}
          aria-describedby={errors.startDate ? 'startDate-error' : undefined}
        />
        {errors.startDate && (
          <p id="startDate-error" className="text-sm text-destructive">
            {errors.startDate}
          </p>
        )}
      </div>

      {/* Current Position Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isCurrent"
          checked={formData.isCurrent}
          onCheckedChange={(checked) =>
            handleChange('isCurrent', checked as boolean)
          }
        />
        <Label
          htmlFor="isCurrent"
          className="cursor-pointer text-sm font-normal"
        >
          {labels.isCurrentLabel}
        </Label>
      </div>

      {/* End Date (disabled if current) */}
      {!formData.isCurrent && (
        <div className="space-y-2">
          <Label htmlFor="endDate">{labels.endDateLabel}</Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{labels.descriptionLabel}</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder={labels.descriptionPlaceholder}
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {labels.saveButton}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          {labels.cancelButton}
        </Button>
      </div>
    </form>
  )
}
