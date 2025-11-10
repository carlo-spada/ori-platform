'use client'

import { useState, useEffect } from 'react'
import { MapPin, Home, Briefcase, GraduationCap, Shuffle, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { StepComponentProps, UserStatus } from '@/lib/types/onboarding'

const STATUS_OPTIONS: Array<{
  value: UserStatus
  label: string
  icon: React.ReactNode
  description: string
}> = [
  {
    value: 'student',
    label: 'Student',
    icon: <GraduationCap className="h-5 w-5" />,
    description: "I'm currently studying and exploring opportunities",
  },
  {
    value: 'professional',
    label: 'Professional',
    icon: <Briefcase className="h-5 w-5" />,
    description: "I'm working and looking to grow my career",
  },
  {
    value: 'transitioning',
    label: 'Career Transition',
    icon: <Shuffle className="h-5 w-5" />,
    description: "I'm switching careers or industries",
  },
  {
    value: 'exploring',
    label: 'Exploring',
    icon: <Search className="h-5 w-5" />,
    description: "I'm exploring what's next for me",
  },
]

export function ContextStep({ data, onChange, errors = {} }: StepComponentProps) {
  const [currentStatus, setCurrentStatus] = useState<UserStatus | ''>(
    data.context?.currentStatus || ''
  )
  const [yearsExperience, setYearsExperience] = useState(
    data.context?.yearsExperience ?? 0
  )
  const [location, setLocation] = useState(data.context?.location || '')
  const [isRemoteOpen, setIsRemoteOpen] = useState(
    data.context?.isRemoteOpen ?? true
  )

  // Update parent on changes
  useEffect(() => {
    if (currentStatus) {
      onChange({
        context: {
          currentStatus: currentStatus as UserStatus,
          yearsExperience,
          location,
          isRemoteOpen,
        },
      })
    }
  }, [currentStatus, yearsExperience, location, isRemoteOpen, onChange])

  // Get experience label based on years
  const getExperienceLabel = () => {
    if (yearsExperience === 0) return 'Just starting'
    if (yearsExperience === 1) return '1 year'
    if (yearsExperience < 5) return `${yearsExperience} years`
    if (yearsExperience < 10) return `${yearsExperience} years (Mid-level)`
    if (yearsExperience < 20) return `${yearsExperience} years (Senior)`
    return `${yearsExperience} years (Executive)`
  }

  // Adjust experience range based on status
  const getExperienceMax = () => {
    if (currentStatus === 'student') return 5
    if (currentStatus === 'exploring') return 15
    return 30
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Where are you in your journey?</h2>
        <p className="text-muted-foreground text-lg">
          This helps us tailor opportunities to your situation
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Current Status */}
        <div className="space-y-3">
          <Label className="text-base">Current status *</Label>
          <RadioGroup
            value={currentStatus}
            onValueChange={(value) => setCurrentStatus(value as UserStatus)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`
                    relative flex cursor-pointer rounded-lg border p-4
                    transition-all hover:border-primary/50
                    ${
                      currentStatus === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }
                  `}
                >
                  <RadioGroupItem
                    value={option.value}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div
                      className={`
                        mt-0.5 text-muted-foreground
                        ${currentStatus === option.value ? 'text-primary' : ''}
                      `}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>
          {errors.currentStatus && (
            <p className="text-sm text-destructive">{errors.currentStatus}</p>
          )}
        </div>

        {/* Years of Experience - Show only if not a student */}
        {currentStatus && currentStatus !== 'student' && (
          <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
            <Label className="text-base">
              Years of experience *
              <span className="text-sm text-muted-foreground ml-2">
                ({getExperienceLabel()})
              </span>
            </Label>
            <div className="space-y-4">
              <Slider
                value={[yearsExperience]}
                onValueChange={([value]) => setYearsExperience(value)}
                min={0}
                max={getExperienceMax()}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Just starting</span>
                <span>{getExperienceMax()}+ years</span>
              </div>
            </div>
            {errors.yearsExperience && (
              <p className="text-sm text-destructive">{errors.yearsExperience}</p>
            )}
          </div>
        )}

        {/* Location */}
        <div className="space-y-3">
          <Label htmlFor="location" className="text-base">
            Location *
            <span className="text-sm text-muted-foreground ml-2">
              (City, State/Country)
            </span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
              className={`h-12 text-base pl-10 ${errors.location ? 'border-destructive' : ''}`}
              autoComplete="locality"
            />
          </div>
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location}</p>
          )}
        </div>

        {/* Remote Preference */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="space-y-0.5">
            <Label htmlFor="remote" className="text-base font-normal cursor-pointer">
              Open to remote opportunities
            </Label>
            <p className="text-sm text-muted-foreground">
              See jobs from anywhere, not just your location
            </p>
          </div>
          <Switch
            id="remote"
            checked={isRemoteOpen}
            onCheckedChange={setIsRemoteOpen}
          />
        </div>

        {/* Context-aware hint */}
        {currentStatus === 'student' && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-primary">
              <strong>Pro tip:</strong> We'll focus on internships, entry-level roles,
              and learning opportunities that match your academic journey.
            </p>
          </div>
        )}

        {currentStatus === 'transitioning' && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-primary">
              <strong>Career change?</strong> We'll highlight transferable skills and
              opportunities that value diverse backgrounds.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}