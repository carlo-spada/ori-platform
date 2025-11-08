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
  Experience,
  Education,
} from '@/components/profile/QualificationsSection'
import { ExperienceFormData } from '@/components/profile/ExperienceForm'
import { EducationFormData } from '@/components/profile/EducationForm'
import { GoalsSection, GoalsValue } from '@/components/profile/GoalsSection'

export default function Profile() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('profile')

  const [profileData, setProfileData] = useState<ProfileFormValue>({
    fullName: 'User',
    email: 'user@example.com',
    headline: '',
    location: '',
    about: '',
  })

  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])

  const [goalsData, setGoalsData] = useState<GoalsValue>({
    longTermVision: '',
    targetRoles: [],
    milestones: [],
  })

  useEffect(() => {
    setDocumentMeta({
      title: 'Profile & Goals - Ori',
      description: 'Manage your profile, career goals, and preferences.',
    })
  }, [])

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

  const handleSaveExperience = (
    id: string | null,
    data: ExperienceFormData,
  ) => {
    if (id) {
      setExperiences(
        experiences.map((exp) => (exp.id === id ? { ...exp, ...data } : exp)),
      )
    } else {
      const newExperience: Experience = {
        id: Date.now().toString(),
        ...data,
      }
      setExperiences([...experiences, newExperience])
    }
  }

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id))
  }

  const handleSaveEducation = (id: string | null, data: EducationFormData) => {
    if (id) {
      setEducation(
        education.map((edu) => (edu.id === id ? { ...edu, ...data } : edu)),
      )
    } else {
      const newEducation: Education = {
        id: Date.now().toString(),
        ...data,
      }
      setEducation([...education, newEducation])
    }
  }

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter((e) => e.id !== id))
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
              fullNamePlaceholder: t(
                'profilePage.profileForm.fullNamePlaceholder',
              ),
              email: t('profilePage.profileForm.emailLabel'),
              headline: t('profilePage.profileForm.headlineLabel'),
              headlinePlaceholder: t(
                'profilePage.profileForm.headlinePlaceholder',
              ),
              location: t('profilePage.profileForm.locationLabel'),
              locationPlaceholder: t(
                'profilePage.profileForm.locationPlaceholder',
              ),
              about: t('profilePage.profileForm.aboutLabel'),
              aboutPlaceholder: t('profilePage.profileForm.aboutPlaceholder'),
              saveButton: t('profilePage.profileForm.saveButton'),
            }}
            onChange={setProfileData}
            onSubmit={() => console.log('Saving profile:', profileData)}
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
              addSkillPlaceholder: t(
                'profilePage.qualifications.addSkillPlaceholder',
              ),
              addSkillButton: t('profilePage.qualifications.addSkillButton'),
              experienceHeading: t(
                'profilePage.qualifications.experienceHeading',
              ),
              experienceHelper: t(
                'profilePage.qualifications.experienceHelper',
              ),
              addExperienceButton: t(
                'profilePage.qualifications.addExperienceButton',
              ),
              educationHeading: t(
                'profilePage.qualifications.educationHeading',
              ),
              educationHelper: t('profilePage.qualifications.educationHelper'),
              addEducationButton: t(
                'profilePage.qualifications.addEducationButton',
              ),
              editLabel: t('profilePage.qualifications.editLabel'),
              removeLabel: t('profilePage.qualifications.removeLabel'),
              emptySkills: t('profilePage.qualifications.emptySkills'),
              emptyExperience: t('profilePage.qualifications.emptyExperience'),
              emptyEducation: t('profilePage.qualifications.emptyEducation'),
            }}
            experienceModalLabels={{
              addTitle: t(
                'profilePage.qualifications.experienceModal.addTitle',
              ),
              editTitle: t(
                'profilePage.qualifications.experienceModal.editTitle',
              ),
              companyLabel: t(
                'profilePage.qualifications.experienceModal.companyLabel',
              ),
              companyPlaceholder: t(
                'profilePage.qualifications.experienceModal.companyPlaceholder',
              ),
              roleLabel: t(
                'profilePage.qualifications.experienceModal.roleLabel',
              ),
              rolePlaceholder: t(
                'profilePage.qualifications.experienceModal.rolePlaceholder',
              ),
              startDateLabel: t(
                'profilePage.qualifications.experienceModal.startDateLabel',
              ),
              endDateLabel: t(
                'profilePage.qualifications.experienceModal.endDateLabel',
              ),
              isCurrentLabel: t(
                'profilePage.qualifications.experienceModal.isCurrentLabel',
              ),
              descriptionLabel: t(
                'profilePage.qualifications.experienceModal.descriptionLabel',
              ),
              descriptionPlaceholder: t(
                'profilePage.qualifications.experienceModal.descriptionPlaceholder',
              ),
              saveButton: t(
                'profilePage.qualifications.experienceModal.saveButton',
              ),
              cancelButton: t(
                'profilePage.qualifications.experienceModal.cancelButton',
              ),
            }}
            educationModalLabels={{
              addTitle: t('profilePage.qualifications.educationModal.addTitle'),
              editTitle: t(
                'profilePage.qualifications.educationModal.editTitle',
              ),
              institutionLabel: t(
                'profilePage.qualifications.educationModal.institutionLabel',
              ),
              institutionPlaceholder: t(
                'profilePage.qualifications.educationModal.institutionPlaceholder',
              ),
              degreeLabel: t(
                'profilePage.qualifications.educationModal.degreeLabel',
              ),
              degreePlaceholder: t(
                'profilePage.qualifications.educationModal.degreePlaceholder',
              ),
              startDateLabel: t(
                'profilePage.qualifications.educationModal.startDateLabel',
              ),
              endDateLabel: t(
                'profilePage.qualifications.educationModal.endDateLabel',
              ),
              isCurrentLabel: t(
                'profilePage.qualifications.educationModal.isCurrentLabel',
              ),
              descriptionLabel: t(
                'profilePage.qualifications.educationModal.descriptionLabel',
              ),
              descriptionPlaceholder: t(
                'profilePage.qualifications.educationModal.descriptionPlaceholder',
              ),
              saveButton: t(
                'profilePage.qualifications.educationModal.saveButton',
              ),
              cancelButton: t(
                'profilePage.qualifications.educationModal.cancelButton',
              ),
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
              longTermVisionPlaceholder: t(
                'profilePage.goals.longTermVisionPlaceholder',
              ),
              longTermVisionHelper: t('profilePage.goals.longTermVisionHelper'),
              targetRolesLabel: t('profilePage.goals.targetRolesLabel'),
              targetRolesHelper: t('profilePage.goals.targetRolesHelper'),
              addTargetRolePlaceholder: t(
                'profilePage.goals.addTargetRolePlaceholder',
              ),
              addTargetRoleButton: t('profilePage.goals.addTargetRoleButton'),
              removeTargetRoleLabel: t(
                'profilePage.goals.removeTargetRoleLabel',
              ),
              milestonesLabel: t('profilePage.goals.milestonesLabel'),
              addMilestonePlaceholder: t(
                'profilePage.goals.addMilestonePlaceholder',
              ),
              addMilestoneButton: t('profilePage.goals.addMilestoneButton'),
              milestonesHelper: t('profilePage.goals.milestonesHelper'),
              saveButton: t('profilePage.goals.saveButton'),
              emptyTargetRoles: t('profilePage.goals.emptyTargetRoles'),
              emptyMilestones: t('profilePage.goals.emptyMilestones'),
            }}
            onChange={setGoalsData}
            onSubmit={() => console.log('Saving goals:', goalsData)}
          />
        )}
      </div>
    </div>
  )
}
