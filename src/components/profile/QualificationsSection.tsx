import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import { ExperienceForm, ExperienceFormData } from './ExperienceForm';
import { EducationForm, EducationFormData } from './EducationForm';

export interface Skill {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface QualificationsSectionProps {
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  labels: {
    heading: string;
    skillsHeading: string;
    skillsHelper: string;
    addSkillPlaceholder: string;
    addSkillButton: string;
    experienceHeading: string;
    experienceHelper: string;
    addExperienceButton: string;
    educationHeading: string;
    educationHelper: string;
    addEducationButton: string;
    editLabel: string;
    removeLabel: string;
    emptySkills: string;
    emptyExperience: string;
    emptyEducation: string;
  };
  experienceModalLabels: {
    addTitle: string;
    editTitle: string;
    companyLabel: string;
    companyPlaceholder: string;
    roleLabel: string;
    rolePlaceholder: string;
    startDateLabel: string;
    endDateLabel: string;
    isCurrentLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    saveButton: string;
    cancelButton: string;
  };
  educationModalLabels: {
    addTitle: string;
    editTitle: string;
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
  onAddSkill?: (name: string) => void;
  onRemoveSkill?: (id: string) => void;
  onSaveExperience?: (id: string | null, data: ExperienceFormData) => void;
  onRemoveExperience?: (id: string) => void;
  onSaveEducation?: (id: string | null, data: EducationFormData) => void;
  onRemoveEducation?: (id: string) => void;
}

/**
 * Qualifications section for managing skills, experience, and education.
 */
export function QualificationsSection({
  skills,
  experiences,
  education,
  labels,
  experienceModalLabels,
  educationModalLabels,
  onAddSkill,
  onRemoveSkill,
  onSaveExperience,
  onRemoveExperience,
  onSaveEducation,
  onRemoveEducation,
}: QualificationsSectionProps) {
  const [newSkill, setNewSkill] = useState('');
  
  // Experience modal state
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  
  // Education modal state
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && onAddSkill) {
      onAddSkill(trimmed);
      setNewSkill('');
    }
  };

  const formatDateRange = (start: string, end?: string) => {
    const startYear = new Date(start).getFullYear();
    const endYear = end ? new Date(end).getFullYear() : 'Present';
    return `${startYear} - ${endYear}`;
  };

  // Experience modal handlers
  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = (data: ExperienceFormData) => {
    if (onSaveExperience) {
      onSaveExperience(editingExperience?.id || null, data);
    }
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
  };

  const handleCloseExperienceModal = () => {
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
  };

  // Education modal handlers
  const handleAddEducation = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = (data: EducationFormData) => {
    if (onSaveEducation) {
      onSaveEducation(editingEducation?.id || null, data);
    }
    setIsEducationModalOpen(false);
    setEditingEducation(null);
  };

  const handleCloseEducationModal = () => {
    setIsEducationModalOpen(false);
    setEditingEducation(null);
  };

  return (
    <div className="space-y-8">
      {/* Skills */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {labels.skillsHeading}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {labels.skillsHelper}
          </p>
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm border border-accent/20"
              >
                {skill.name}
                {onRemoveSkill && (
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(skill.id)}
                    aria-label={`${labels.removeLabel} ${skill.name}`}
                    className="hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">{labels.emptySkills}</p>
        )}

        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={labels.addSkillPlaceholder}
            className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          />
          <Button type="submit" variant="outline" disabled={!newSkill.trim()}>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {labels.addSkillButton}
          </Button>
        </form>
      </section>

      {/* Work Experience */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {labels.experienceHeading}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {labels.experienceHelper}
          </p>
        </div>

        {experiences.length > 0 ? (
          <div className="space-y-3 mb-4">
            {experiences.map((exp) => (
              <article
                key={exp.id}
                className="p-4 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{exp.role}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditExperience(exp)}
                      aria-label={`${labels.editLabel} ${exp.role}`}
                    >
                      {labels.editLabel}
                    </Button>
                    {onRemoveExperience && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveExperience(exp.id)}
                        aria-label={`${labels.removeLabel} ${exp.role}`}
                        className="text-destructive hover:text-destructive"
                      >
                        {labels.removeLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            {labels.emptyExperience}
          </p>
        )}

        <Button variant="outline" onClick={handleAddExperience} className="w-full">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {labels.addExperienceButton}
        </Button>
      </section>

      {/* Education */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {labels.educationHeading}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {labels.educationHelper}
          </p>
        </div>

        {education.length > 0 ? (
          <div className="space-y-3 mb-4">
            {education.map((edu) => (
              <article
                key={edu.id}
                className="p-4 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <GraduationCap
                      className="h-5 w-5 text-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEducation(edu)}
                      aria-label={`${labels.editLabel} ${edu.degree}`}
                    >
                      {labels.editLabel}
                    </Button>
                    {onRemoveEducation && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveEducation(edu.id)}
                        aria-label={`${labels.removeLabel} ${edu.degree}`}
                        className="text-destructive hover:text-destructive"
                      >
                        {labels.removeLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            {labels.emptyEducation}
          </p>
        )}

        <Button variant="outline" onClick={handleAddEducation} className="w-full">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {labels.addEducationButton}
        </Button>
      </section>

      {/* Experience Modal */}
      <Modal
        isOpen={isExperienceModalOpen}
        onClose={handleCloseExperienceModal}
        title={editingExperience ? experienceModalLabels.editTitle : experienceModalLabels.addTitle}
      >
        <ExperienceForm
          initialValues={editingExperience ? {
            company: editingExperience.company,
            role: editingExperience.role,
            startDate: editingExperience.startDate,
            endDate: editingExperience.endDate,
            description: editingExperience.description,
            isCurrent: !editingExperience.endDate,
          } : undefined}
          onSave={handleSaveExperience}
          onCancel={handleCloseExperienceModal}
          labels={experienceModalLabels}
        />
      </Modal>

      {/* Education Modal */}
      <Modal
        isOpen={isEducationModalOpen}
        onClose={handleCloseEducationModal}
        title={editingEducation ? educationModalLabels.editTitle : educationModalLabels.addTitle}
      >
        <EducationForm
          initialValues={editingEducation ? {
            institution: editingEducation.institution,
            degree: editingEducation.degree,
            startDate: editingEducation.startDate,
            endDate: editingEducation.endDate,
            description: editingEducation.description,
            isCurrent: !editingEducation.endDate,
          } : undefined}
          onSave={handleSaveEducation}
          onCancel={handleCloseEducationModal}
          labels={educationModalLabels}
        />
      </Modal>
    </div>
  );
}
