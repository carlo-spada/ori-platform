import { CheckCircle, XCircle } from 'lucide-react';
import { Skill } from '@/lib/types';

interface SkillsGapDisplayProps {
  skills: Skill[];
}

export function SkillsGapDisplay({ skills }: SkillsGapDisplayProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  const matchedSkills = skills.filter(skill => skill.status === 'matched');
  const missingSkills = skills.filter(skill => skill.status === 'missing');

  return (
    <div className="space-y-3">
      {matchedSkills.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            Matched Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20"
              >
                <CheckCircle className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
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
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            Skills to Develop
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20"
              >
                <XCircle className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
