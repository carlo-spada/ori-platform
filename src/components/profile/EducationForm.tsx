import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export interface EducationFormData {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrent?: boolean;
}

export interface EducationFormProps {
  initialValues?: EducationFormData;
  onSave: (values: EducationFormData) => void;
  onCancel: () => void;
  labels: {
    institutionLabel: string;
    institutionPlaceholder: string;
    degreeLabel: string;
    degreePlaceholder: string;
    startDateLabel: string;
    endDateLabel: string;
    isCurrentLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    saveButton: string;
    cancelButton: string;
  };
}

export function EducationForm({ initialValues, onSave, onCancel, labels }: EducationFormProps) {
  const [formData, setFormData] = useState<EducationFormData>({
    institution: initialValues?.institution || '',
    degree: initialValues?.degree || '',
    startDate: initialValues?.startDate || '',
    endDate: initialValues?.endDate || '',
    description: initialValues?.description || '',
    isCurrent: initialValues?.isCurrent || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
    if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
    if (!formData.startDate.trim()) newErrors.startDate = 'Start date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear end date if currently enrolled
    const submitData = { ...formData };
    if (formData.isCurrent) {
      submitData.endDate = undefined;
    }

    onSave(submitData);
  };

  const handleChange = (field: keyof EducationFormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Institution */}
      <div className="space-y-2">
        <Label htmlFor="institution">{labels.institutionLabel}</Label>
        <Input
          id="institution"
          type="text"
          value={formData.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          placeholder={labels.institutionPlaceholder}
          aria-invalid={!!errors.institution}
          aria-describedby={errors.institution ? 'institution-error' : undefined}
        />
        {errors.institution && (
          <p id="institution-error" className="text-sm text-destructive">
            {errors.institution}
          </p>
        )}
      </div>

      {/* Degree */}
      <div className="space-y-2">
        <Label htmlFor="degree">{labels.degreeLabel}</Label>
        <Input
          id="degree"
          type="text"
          value={formData.degree}
          onChange={(e) => handleChange('degree', e.target.value)}
          placeholder={labels.degreePlaceholder}
          aria-invalid={!!errors.degree}
          aria-describedby={errors.degree ? 'degree-error' : undefined}
        />
        {errors.degree && (
          <p id="degree-error" className="text-sm text-destructive">
            {errors.degree}
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

      {/* Currently Enrolled Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isCurrent"
          checked={formData.isCurrent}
          onCheckedChange={(checked) => handleChange('isCurrent', checked as boolean)}
        />
        <Label
          htmlFor="isCurrent"
          className="text-sm font-normal cursor-pointer"
        >
          {labels.isCurrentLabel}
        </Label>
      </div>

      {/* End Date (disabled if currently enrolled) */}
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
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          {labels.cancelButton}
        </Button>
      </div>
    </form>
  );
}
