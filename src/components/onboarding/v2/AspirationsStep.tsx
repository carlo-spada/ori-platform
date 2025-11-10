'use client'

import { useState, useEffect } from 'react'
import { Target, Calendar, TrendingUp, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import type { StepComponentProps, TimelineMonths } from '@/lib/types/onboarding'

const TIMELINE_OPTIONS: Array<{ value: TimelineMonths; label: string; description: string }> = [
  { value: 6, label: '6 months', description: 'Short-term focus' },
  { value: 12, label: '1 year', description: 'Near-term goals' },
  { value: 24, label: '2 years', description: 'Medium-term vision' },
  { value: 36, label: '3 years', description: 'Strategic growth' },
  { value: 60, label: '5 years', description: 'Long-term ambition' },
]

export function AspirationsStep({ data, onChange, onSkip }: StepComponentProps) {
  const [dreamRole, setDreamRole] = useState(data.aspirations?.dreamRole || '')
  const [timelineMonths, setTimelineMonths] = useState<TimelineMonths>(
    data.aspirations?.timelineMonths || 24
  )
  const [longTermVision, setLongTermVision] = useState(
    data.aspirations?.longTermVision || ''
  )
  const [targetRoles, setTargetRoles] = useState<string[]>(
    data.aspirations?.targetRoles || []
  )
  const [currentRole, setCurrentRole] = useState('')

  // Update parent on changes
  useEffect(() => {
    onChange({
      aspirations: {
        dreamRole: dreamRole || undefined,
        timelineMonths,
        longTermVision: longTermVision || undefined,
        targetRoles: targetRoles.length > 0 ? targetRoles : undefined,
        successMetrics: undefined, // We'll add this in a future iteration
      },
    })
  }, [dreamRole, timelineMonths, longTermVision, targetRoles, onChange])

  // Add target role
  const addTargetRole = (role: string) => {
    const trimmed = role.trim()
    if (trimmed && !targetRoles.some(r => r.toLowerCase() === trimmed.toLowerCase())) {
      setTargetRoles(prev => [...prev, trimmed])
      setCurrentRole('')
    }
  }

  // Remove target role
  const removeTargetRole = (index: number) => {
    setTargetRoles(prev => prev.filter((_, i) => i !== index))
  }

  // Get timeline label
  const getTimelineLabel = () => {
    const option = TIMELINE_OPTIONS.find(o => o.value === timelineMonths)
    return option ? `${option.label} - ${option.description}` : ''
  }

  // Calculate progress position for visual timeline
  const getProgressPosition = () => {
    const index = TIMELINE_OPTIONS.findIndex(o => o.value === timelineMonths)
    return (index / (TIMELINE_OPTIONS.length - 1)) * 100
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Where do you want to be?</h2>
        <p className="text-muted-foreground text-lg">
          Share your career aspirations (optional but valuable)
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Dream Role */}
        <div className="space-y-3">
          <Label htmlFor="dreamRole" className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Dream role
            <span className="text-sm text-muted-foreground">
              (What's your ideal position?)
            </span>
          </Label>
          <Input
            id="dreamRole"
            type="text"
            value={dreamRole}
            onChange={(e) => setDreamRole(e.target.value)}
            placeholder="e.g., VP of Engineering, Lead Product Designer, Data Science Manager"
            className="h-11"
          />
        </div>

        {/* Visual Timeline */}
        <div className="space-y-4">
          <Label className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Timeline to get there
            <span className="text-sm text-muted-foreground ml-auto">
              {getTimelineLabel()}
            </span>
          </Label>

          {/* Custom Timeline Visualization */}
          <div className="relative py-8">
            {/* Track */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-border rounded-full" />

            {/* Progress */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 bg-primary rounded-full transition-all duration-300"
              style={{
                left: 0,
                width: `${getProgressPosition()}%`
              }}
            />

            {/* Markers */}
            <div className="relative flex justify-between">
              {TIMELINE_OPTIONS.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTimelineMonths(option.value)}
                  className="group relative flex flex-col items-center"
                >
                  <div
                    className={`
                      h-4 w-4 rounded-full border-2 transition-all
                      ${
                        timelineMonths === option.value
                          ? 'bg-primary border-primary scale-125'
                          : timelineMonths > option.value
                          ? 'bg-primary border-primary'
                          : 'bg-background border-border group-hover:border-primary/50'
                      }
                    `}
                  />
                  <span
                    className={`
                      absolute top-6 text-xs whitespace-nowrap transition-opacity
                      ${timelineMonths === option.value ? 'opacity-100 font-medium' : 'opacity-60'}
                    `}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Roles */}
        <div className="space-y-3">
          <Label className="text-base">
            Target roles along the way
            <span className="text-sm text-muted-foreground ml-2">
              (Stepping stones to your dream role)
            </span>
          </Label>

          <div className="flex gap-2">
            <Input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTargetRole(currentRole)
                }
              }}
              placeholder="e.g., Senior Engineer, Team Lead"
              className="h-11"
            />
            <Button
              type="button"
              onClick={() => addTargetRole(currentRole)}
              disabled={!currentRole.trim()}
              variant="outline"
              size="default"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {targetRoles.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-1">
              {targetRoles.map((role, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="pl-3 pr-1 py-1.5 text-sm"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => removeTargetRole(index)}
                    className="ml-2 p-0.5 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Long-term Vision */}
        <div className="space-y-3">
          <Label htmlFor="vision" className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Long-term vision
            <span className="text-sm text-muted-foreground">
              (Optional)
            </span>
          </Label>
          <Textarea
            id="vision"
            value={longTermVision}
            onChange={(e) => setLongTermVision(e.target.value)}
            placeholder="Describe the kind of work and impact you'd like to have in the future..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {longTermVision.length}/500 characters
          </p>
        </div>

        {/* Skip reminder */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            This step is optional. You can {' '}
            <button
              type="button"
              onClick={onSkip}
              className="text-primary hover:underline"
            >
              skip it
            </button>
            {' '} and add these details later.
          </p>
        </div>
      </div>
    </div>
  )
}