import { CheckCircle, XCircle } from 'lucide-react'
import { Skill, SkillsGap } from '@/lib/types'

interface SkillsGapDisplayProps {
  skills?: Skill[] // Legacy format from skills_analysis
  skillsGap?: SkillsGap // New format from AI Engine
}

export function SkillsGapDisplay({ skills, skillsGap }: SkillsGapDisplayProps) {
  // Handle new skillsGap format (prioritize this if available)
  if (skillsGap && skillsGap.requiredSkills.length > 0) {
    const matchedSkillsList = skillsGap.userSkills.filter((skill) =>
      skillsGap.requiredSkills.some(
        (req) => req.toLowerCase() === skill.toLowerCase(),
      ),
    )
    const missingSkillsList = skillsGap.missingSkills

    return (
      <div className="space-y-3">
        {/* Skill Match Summary Header */}
        <div className="border-border/50 flex items-center justify-between border-b pb-1">
          <span className="text-foreground text-sm font-medium">
            Skills Analysis
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            {matchedSkillsList.length} of {skillsGap.requiredSkills.length}{' '}
            matched
          </span>
        </div>
        {matchedSkillsList.length > 0 && (
          <div>
            <h4 className="text-muted-foreground mb-2 text-xs font-medium">
              Your Matching Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {matchedSkillsList.map((skill, index) => (
                <div
                  key={`matched-${skill}-${index}`}
                  className="flex items-center gap-1.5 rounded-md border border-green-500/20 bg-green-500/10 px-2.5 py-1"
                >
                  <CheckCircle
                    className="h-3.5 w-3.5 text-green-500"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {missingSkillsList.length > 0 && (
          <div>
            <h4 className="text-muted-foreground mb-2 text-xs font-medium">
              Skills to Develop
            </h4>
            <div className="flex flex-wrap gap-2">
              {missingSkillsList.map((skill, index) => (
                <div
                  key={`missing-${skill}-${index}`}
                  className="flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1"
                >
                  <XCircle
                    className="h-3.5 w-3.5 text-red-500"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Fallback to legacy skills format
  if (!skills || skills.length === 0) {
    return null
  }

  const matchedSkills = skills.filter((skill) => skill.status === 'matched')
  const missingSkills = skills.filter((skill) => skill.status === 'missing')

  return (
    <div className="space-y-3">
      {matchedSkills.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 text-xs font-medium">
            Matched Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="flex items-center gap-1.5 rounded-md border border-green-500/20 bg-green-500/10 px-2.5 py-1"
              >
                <CheckCircle
                  className="h-3.5 w-3.5 text-green-500"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 text-xs font-medium">
            Skills to Develop
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1"
              >
                <XCircle
                  className="h-3.5 w-3.5 text-red-500"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
