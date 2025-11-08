'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setDocumentMeta } from '@/lib/seo'
import { ProfileTabs, ProfileTabKey } from '@/components/profile/ProfileTabs'
import { ProfileForm, ProfileFormValue } from '@/components/profile/ProfileForm'
import {
  QualificationsSection,
  Skill,
  Experience as LocalExperience,
  Education as LocalEducation,
} from '@/components/profile/QualificationsSection'
import { ExperienceFormData } from '@/components/profile/ExperienceForm'
import { EducationFormData } from '@/components/profile/EducationForm'
import { GoalsSection, GoalsValue } from '@/components/profile/GoalsSection'
import {
  useProfile,
  useUpdateProfile,
  useExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  useEducation,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '@/hooks/useProfile'
import type { Experience, Education } from '@ori/types'
import { toast } from 'sonner'

export default function Profile() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('profile')

  // Fetch data with React Query
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: experiencesData = [], isLoading: experiencesLoading } = useExperiences()
  const { data: educationData = [], isLoading: educationLoading } = useEducation()

  // Mutations
  const updateProfileMutation = useUpdateProfile()
  const createExperienceMutation = useCreateExperience()
  const updateExperienceMutation = useUpdateExperience()
  const deleteExperienceMutation = useDeleteExperience()
  const createEducationMutation = useCreateEducation()
  const updateEducationMutation = useUpdateEducation()
  const deleteEducationMutation = useDeleteEducation()

  // Local state for forms
  const [profileData, setProfileData] = useState<ProfileFormValue>({
    fullName: '',
    email: '',
    headline: '',
    location: '',
    about: '',
  })

  const [skills, setSkills] = useState<Skill[]>([])
  const [goalsData, setGoalsData] = useState<GoalsValue>({
    longTermVision: '',
    targetRoles: [],
    milestones: [],
  })

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.full_name || '',
        email: '', // Email comes from auth, not profile
        headline: profile.headline || '',
        location: profile.location || '',
        about: profile.about || '',
      })

      // Initialize skills from profile
      if (profile.skills) {
        setSkills(
          profile.skills.map((skill, index) => ({
            id: `${index}`,
            name: skill,
          }))
        )
      }

      // Initialize goals
      setGoalsData({
        longTermVision: profile.long_term_vision || '',
        targetRoles: profile.target_roles || [],
        milestones: [], // Not in database yet
      })
    }
  }, [profile])

  useEffect(() => {
    setDocumentMeta({
      title: 'Profile & Goals - Ori',
      description: 'Manage your profile, career goals, and preferences.',
    })
  }, [])

  // Convert backend Experience/Education to component format
  const experiences: LocalExperience[] = experiencesData.map((exp: Experience) => ({
    id: exp.id,
    company: exp.company,
    role: exp.role,
    startDate: exp.start_date,
    endDate: exp.end_date || undefined,
    isCurrent: exp.is_current,
    description: exp.description || undefined,
  }))

  const education: LocalEducation[] = educationData.map((edu: Education) => ({
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree,
    startDate: edu.start_date,
    endDate: edu.end_date || undefined,
    isCurrent: edu.is_current,
    description: edu.description || undefined,
  }))

  // Handlers
  const handleProfileSubmit = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        full_name: profileData.fullName,
        headline: profileData.headline,
        location: profileData.location,
        about: profileData.about,
        skills: skills.map((s) => s.name),
      })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    }
  }

  const handleAddSkill = (name: string) => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name,
    }
    setSkills([...skills, newSkill])
  }

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id))
  }

  const handleSaveExperience = async (id: string | null, data: ExperienceFormData) => {
    try {
      if (id) {
        // Update existing
        await updateExperienceMutation.mutateAsync({
          id,
          data: {
            company: data.company,
            role: data.role,
            start_date: data.startDate,
            end_date: data.endDate || null,
            is_current: data.isCurrent || false,
            description: data.description || null,
          },
        })
        toast.success('Experience updated')
      } else {
        // Create new
        await createExperienceMutation.mutateAsync({
          company: data.company,
          role: data.role,
          start_date: data.startDate,
          end_date: data.endDate || null,
          is_current: data.isCurrent || false,
          description: data.description || null,
        })
        toast.success('Experience added')
      }
    } catch (error) {
      toast.error('Failed to save experience')
      console.error(error)
    }
  }

  const handleRemoveExperience = async (id: string) => {
    try {
      await deleteExperienceMutation.mutateAsync(id)
      toast.success('Experience removed')
    } catch (error) {
      toast.error('Failed to remove experience')
      console.error(error)
    }
  }

  const handleSaveEducation = async (id: string | null, data: EducationFormData) => {
    try {
      if (id) {
        // Update existing
        await updateEducationMutation.mutateAsync({
          id,
          data: {
            institution: data.institution,
            degree: data.degree,
            field_of_study: null, // Not in form yet
            start_date: data.startDate,
            end_date: data.endDate || null,
            is_current: data.isCurrent || false,
            description: data.description || null,
          },
        })
        toast.success('Education updated')
      } else {
        // Create new
        await createEducationMutation.mutateAsync({
          institution: data.institution,
          degree: data.degree,
          field_of_study: null,
          start_date: data.startDate,
          end_date: data.endDate || null,
          is_current: data.isCurrent || false,
          description: data.description || null,
        })
        toast.success('Education added')
      }
    } catch (error) {
      toast.error('Failed to save education')
      console.error(error)
    }
  }

  const handleRemoveEducation = async (id: string) => {
    try {
      await deleteEducationMutation.mutateAsync(id)
      toast.success('Education removed')
    } catch (error) {
      toast.error('Failed to remove education')
      console.error(error)
    }
  }

  const handleGoalsSubmit = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        long_term_vision: goalsData.longTermVision,
        target_roles: goalsData.targetRoles,
      })
      toast.success('Goals updated successfully')
    } catch (error) {
      toast.error('Failed to update goals')
      console.error(error)
    }
  }

  // Loading state
  if (profileLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4" data-testid="profile-page">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t('profilePage.header.title')}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {t('profilePage.header.subtitle')}
        </p>
      </header>

      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        labels={{
          profile: t('profilePage.tabs.profile'),
          qualifications: t('profilePage.tabs.qualifications'),
          goals: t('profilePage.tabs.goals'),
        }}
      />

      <div
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={`${activeTab}-tab`}
        className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm sm:p-6"
      >
        {activeTab === 'profile' && (
          <ProfileForm
            value={profileData}
            labels={{
              fullName: t('profilePage.profileForm.fullNameLabel'),
              fullNamePlaceholder: t('profilePage.profileForm.fullNamePlaceholder'),
              email: t('profilePage.profileForm.emailLabel'),
              headline: t('profilePage.profileForm.headlineLabel'),
              headlinePlaceholder: t('profilePage.profileForm.headlinePlaceholder'),
              location: t('profilePage.profileForm.locationLabel'),
              locationPlaceholder: t('profilePage.profileForm.locationPlaceholder'),
              about: t('profilePage.profileForm.aboutLabel'),
              aboutPlaceholder: t('profilePage.profileForm.aboutPlaceholder'),
              saveButton: t('profilePage.profileForm.saveButton'),
            }}
            onChange={setProfileData}
            onSubmit={handleProfileSubmit}
          />
        )}

        {activeTab === 'qualifications' && (
          <QualificationsSection
            skills={skills}
            experiences={experiences}
            education={education}
            labels={{
              heading: t('profilePage.qualifications.heading'),
              skillsHeading: t('profilePage.qualifications.skillsHeading'),
              skillsHelper: t('profilePage.qualifications.skillsHelper'),
              addSkillPlaceholder: t('profilePage.qualifications.addSkillPlaceholder'),
              addSkillButton: t('profilePage.qualifications.addSkillButton'),
              experienceHeading: t('profilePage.qualifications.experienceHeading'),
              experienceHelper: t('profilePage.qualifications.experienceHelper'),
              addExperienceButton: t('profilePage.qualifications.addExperienceButton'),
              educationHeading: t('profilePage.qualifications.educationHeading'),
              educationHelper: t('profilePage.qualifications.educationHelper'),
              addEducationButton: t('profilePage.qualifications.addEducationButton'),
              editLabel: t('profilePage.qualifications.editLabel'),
              removeLabel: t('profilePage.qualifications.removeLabel'),
              emptySkills: t('profilePage.qualifications.emptySkills'),
              emptyExperience: t('profilePage.qualifications.emptyExperience'),
              emptyEducation: t('profilePage.qualifications.emptyEducation'),
            }}
            experienceModalLabels={{
              addTitle: t('profilePage.qualifications.experienceModal.addTitle'),
              editTitle: t('profilePage.qualifications.experienceModal.editTitle'),
              companyLabel: t('profilePage.qualifications.experienceModal.companyLabel'),
              companyPlaceholder: t(
                'profilePage.qualifications.experienceModal.companyPlaceholder'
              ),
              roleLabel: t('profilePage.qualifications.experienceModal.roleLabel'),
              rolePlaceholder: t('profilePage.qualifications.experienceModal.rolePlaceholder'),
              startDateLabel: t('profilePage.qualifications.experienceModal.startDateLabel'),
              endDateLabel: t('profilePage.qualifications.experienceModal.endDateLabel'),
              isCurrentLabel: t('profilePage.qualifications.experienceModal.isCurrentLabel'),
              descriptionLabel: t('profilePage.qualifications.experienceModal.descriptionLabel'),
              descriptionPlaceholder: t(
                'profilePage.qualifications.experienceModal.descriptionPlaceholder'
              ),
              saveButton: t('profilePage.qualifications.experienceModal.saveButton'),
              cancelButton: t('profilePage.qualifications.experienceModal.cancelButton'),
            }}
            educationModalLabels={{
              addTitle: t('profilePage.qualifications.educationModal.addTitle'),
              editTitle: t('profilePage.qualifications.educationModal.editTitle'),
              institutionLabel: t('profilePage.qualifications.educationModal.institutionLabel'),
              institutionPlaceholder: t(
                'profilePage.qualifications.educationModal.institutionPlaceholder'
              ),
              degreeLabel: t('profilePage.qualifications.educationModal.degreeLabel'),
              degreePlaceholder: t('profilePage.qualifications.educationModal.degreePlaceholder'),
              startDateLabel: t('profilePage.qualifications.educationModal.startDateLabel'),
              endDateLabel: t('profilePage.qualifications.educationModal.endDateLabel'),
              isCurrentLabel: t('profilePage.qualifications.educationModal.isCurrentLabel'),
              descriptionLabel: t('profilePage.qualifications.educationModal.descriptionLabel'),
              descriptionPlaceholder: t(
                'profilePage.qualifications.educationModal.descriptionPlaceholder'
              ),
              saveButton: t('profilePage.qualifications.educationModal.saveButton'),
              cancelButton: t('profilePage.qualifications.educationModal.cancelButton'),
            }}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            onSaveExperience={handleSaveExperience}
            onRemoveExperience={handleRemoveExperience}
            onSaveEducation={handleSaveEducation}
            onRemoveEducation={handleRemoveEducation}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsSection
            value={goalsData}
            labels={{
              heading: t('profilePage.goals.heading'),
              longTermVisionLabel: t('profilePage.goals.longTermVisionLabel'),
              longTermVisionPlaceholder: t('profilePage.goals.longTermVisionPlaceholder'),
              longTermVisionHelper: t('profilePage.goals.longTermVisionHelper'),
              targetRolesLabel: t('profilePage.goals.targetRolesLabel'),
              targetRolesHelper: t('profilePage.goals.targetRolesHelper'),
              addTargetRolePlaceholder: t('profilePage.goals.addTargetRolePlaceholder'),
              addTargetRoleButton: t('profilePage.goals.addTargetRoleButton'),
              removeTargetRoleLabel: t('profilePage.goals.removeTargetRoleLabel'),
              milestonesLabel: t('profilePage.goals.milestonesLabel'),
              addMilestonePlaceholder: t('profilePage.goals.addMilestonePlaceholder'),
              addMilestoneButton: t('profilePage.goals.addMilestoneButton'),
              milestonesHelper: t('profilePage.goals.milestonesHelper'),
              saveButton: t('profilePage.goals.saveButton'),
              emptyTargetRoles: t('profilePage.goals.emptyTargetRoles'),
              emptyMilestones: t('profilePage.goals.emptyMilestones'),
            }}
            onChange={setGoalsData}
            onSubmit={handleGoalsSubmit}
          />
        )}
      </div>
    </div>
  )
}
