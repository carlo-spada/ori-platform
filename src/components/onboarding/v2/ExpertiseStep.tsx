'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, X, Sparkles, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { StepComponentProps } from '@/lib/types/onboarding'

// AI-suggested skills based on role and experience
const getSkillSuggestions = (
  currentStatus?: string,
  yearsExperience?: number,
  existingSkills?: string[]
): string[] => {
  const existing = existingSkills?.map(s => s.toLowerCase()) || []

  let suggestions: string[] = []

  if (currentStatus === 'student') {
    suggestions = ['Python', 'JavaScript', 'Git', 'Problem Solving', 'Team Collaboration', 'SQL', 'React', 'Communication']
  } else if (yearsExperience && yearsExperience < 3) {
    suggestions = ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Git', 'Agile', 'REST APIs', 'TypeScript']
  } else if (yearsExperience && yearsExperience < 7) {
    suggestions = ['TypeScript', 'System Design', 'Docker', 'AWS', 'Testing', 'CI/CD', 'Leadership', 'Microservices']
  } else {
    suggestions = ['Architecture', 'Strategic Planning', 'Team Leadership', 'Mentoring', 'Cloud Architecture', 'DevOps', 'Product Strategy', 'Stakeholder Management']
  }

  // Filter out already added skills
  return suggestions.filter(s => !existing.includes(s.toLowerCase()))
}

export function ExpertiseStep({ data, onChange, errors = {} }: StepComponentProps) {
  const [skills, setSkills] = useState<string[]>(data.expertise?.skills || [])
  const [currentSkill, setCurrentSkill] = useState('')
  const [hiddenTalents, setHiddenTalents] = useState<string[]>(
    data.expertise?.hiddenTalents || []
  )
  const [currentTalent, setCurrentTalent] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Get AI suggestions based on context
  const suggestions = getSkillSuggestions(
    data.context?.currentStatus,
    data.context?.yearsExperience,
    skills
  )

  // Update parent on changes
  useEffect(() => {
    onChange({
      expertise: {
        skills,
        hiddenTalents: hiddenTalents.length > 0 ? hiddenTalents : undefined,
        skillLevels: undefined, // We'll add skill levels in a future iteration
      },
    })
  }, [skills, hiddenTalents, onChange])

  // Add skill
  const addSkill = useCallback((skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills(prev => [...prev, trimmed])
      setCurrentSkill('')
    }
  }, [skills])

  // Remove skill
  const removeSkill = useCallback((index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Add hidden talent
  const addTalent = useCallback((talent: string) => {
    const trimmed = talent.trim()
    if (trimmed && !hiddenTalents.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      setHiddenTalents(prev => [...prev, trimmed])
      setCurrentTalent('')
    }
  }, [hiddenTalents])

  // Remove talent
  const removeTalent = useCallback((index: number) => {
    setHiddenTalents(prev => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">What makes you exceptional?</h2>
        <p className="text-muted-foreground text-lg">
          Your skills help us match you with the right opportunities
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Core Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">
              Core skills *
              <span className="text-sm text-muted-foreground ml-2">
                (Add at least 3)
              </span>
            </Label>
            {skills.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {skills.length} added
              </span>
            )}
          </div>

          {/* Skill Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill(currentSkill)
                }
              }}
              placeholder="Type a skill and press Enter"
              className="h-11"
            />
            <Button
              type="button"
              onClick={() => addSkill(currentSkill)}
              disabled={!currentSkill.trim()}
              size="default"
              className="px-6"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Added Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-1">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="pl-3 pr-1 py-1.5 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 p-0.5 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* AI Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Suggested skills based on your profile
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 6).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addSkill(suggestion)}
                    className="px-3 py-1.5 text-sm rounded-full border border-primary/30 hover:bg-primary/10 transition-colors"
                  >
                    {suggestion}
                    <ChevronRight className="inline-block h-3 w-3 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {errors.skills && (
            <p className="text-sm text-destructive">{errors.skills}</p>
          )}

          {skills.length > 0 && skills.length < 3 && (
            <p className="text-sm text-amber-600">
              Add {3 - skills.length} more skill{3 - skills.length > 1 ? 's' : ''} to continue
            </p>
          )}
        </div>

        {/* Hidden Talents (Optional) */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <Label className="text-base">
              Hidden talents
              <span className="text-sm text-muted-foreground ml-2">
                (Optional - what else makes you unique?)
              </span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Photography, public speaking, writing, languages, etc.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              value={currentTalent}
              onChange={(e) => setCurrentTalent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTalent(currentTalent)
                }
              }}
              placeholder="Add a hidden talent"
              className="h-11"
            />
            <Button
              type="button"
              onClick={() => addTalent(currentTalent)}
              disabled={!currentTalent.trim()}
              variant="outline"
              size="default"
              className="px-6"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Added Talents */}
          {hiddenTalents.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-1">
              {hiddenTalents.map((talent, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="pl-3 pr-1 py-1.5 text-sm"
                >
                  {talent}
                  <button
                    type="button"
                    onClick={() => removeTalent(index)}
                    className="ml-2 p-0.5 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Progress hint */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Great! Your skills help us understand your expertise level
          </p>
        </div>
      </div>
    </div>
  )
}