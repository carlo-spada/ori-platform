'use client'

import { useState, useEffect } from 'react'
import {
  Home,
  Users,
  Zap,
  Target,
  Heart,
  Shield,
  Plus,
  X,
  GripVertical,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { StepComponentProps, WorkStyles } from '@/lib/types/onboarding'

const WORK_STYLE_OPTIONS = [
  {
    key: 'remote',
    label: 'Remote First',
    icon: Home,
    description: 'Work from anywhere',
  },
  {
    key: 'collaborative',
    label: 'Collaborative',
    icon: Users,
    description: 'Team-oriented',
  },
  {
    key: 'async',
    label: 'Async Communication',
    icon: Zap,
    description: 'Flexible hours',
  },
  {
    key: 'structured',
    label: 'Structured',
    icon: Target,
    description: 'Clear processes',
  },
]

const CULTURE_VALUES = [
  'Innovation',
  'Work-Life Balance',
  'Growth Opportunities',
  'Diversity & Inclusion',
  'Transparency',
  'Impact-Driven',
  'Learning Culture',
  'Autonomy',
  'Sustainability',
  'Fast-Paced',
  'Mission-Driven',
  'Collaborative',
]

export function PreferencesStep({
  data,
  onChange,
  onSkip,
}: StepComponentProps) {
  const [workStyles, setWorkStyles] = useState<WorkStyles>(
    data.preferences?.workStyles || {},
  )
  const [cultureValues, setCultureValues] = useState<string[]>(
    data.preferences?.cultureValues || [],
  )
  const [dealBreakers, setDealBreakers] = useState<string[]>(
    data.preferences?.dealBreakers || [],
  )
  const [currentDealBreaker, setCurrentDealBreaker] = useState('')

  // Update parent on changes
  useEffect(() => {
    onChange({
      preferences: {
        workStyles: Object.keys(workStyles).length > 0 ? workStyles : undefined,
        cultureValues: cultureValues.length > 0 ? cultureValues : undefined,
        dealBreakers: dealBreakers.length > 0 ? dealBreakers : undefined,
        industries: undefined, // We'll add industry selection in a future iteration
      },
    })
  }, [workStyles, cultureValues, dealBreakers, onChange])

  // Toggle work style preference
  const toggleWorkStyle = (key: string) => {
    setWorkStyles((prev) => {
      const updated = { ...prev }
      if (updated[key as keyof WorkStyles]) {
        delete updated[key as keyof WorkStyles]
      } else {
        updated[key as keyof WorkStyles] = 8 // Default importance level
      }
      return updated
    })
  }

  // Toggle culture value
  const toggleCultureValue = (value: string) => {
    setCultureValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      if (prev.length < 5) {
        // Limit to 5 values
        return [...prev, value]
      }
      return prev
    })
  }

  // Add deal breaker
  const addDealBreaker = (dealBreaker: string) => {
    const trimmed = dealBreaker.trim()
    if (trimmed && !dealBreakers.includes(trimmed)) {
      setDealBreakers((prev) => [...prev, trimmed])
      setCurrentDealBreaker('')
    }
  }

  // Remove deal breaker
  const removeDealBreaker = (index: number) => {
    setDealBreakers((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="mb-3 text-3xl font-bold">What matters most to you?</h2>
        <p className="text-lg text-muted-foreground">
          Help us understand your ideal work environment (optional)
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-8">
        {/* Work Style Preferences */}
        <div className="space-y-4">
          <Label className="text-base">
            Work style preferences
            <span className="ml-2 text-sm text-muted-foreground">
              (Select what resonates)
            </span>
          </Label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WORK_STYLE_OPTIONS.map((option) => {
              const Icon = option.icon
              const isSelected = !!workStyles[option.key as keyof WorkStyles]

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => toggleWorkStyle(option.key)}
                  className={`relative flex items-start rounded-lg border p-4 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  } `}
                >
                  <Icon
                    className={`mr-3 mt-0.5 h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'} `}
                  />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{option.label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute right-2 top-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Culture & Values */}
        <div className="space-y-4">
          <Label className="text-base">
            Company culture & values
            <span className="ml-2 text-sm text-muted-foreground">
              (Choose up to 5)
            </span>
          </Label>

          <div className="flex flex-wrap gap-2">
            {CULTURE_VALUES.map((value) => {
              const isSelected = cultureValues.includes(value)
              const isDisabled = !isSelected && cultureValues.length >= 5

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleCultureValue(value)}
                  disabled={isDisabled}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isDisabled
                        ? 'cursor-not-allowed border-border text-muted-foreground opacity-50'
                        : 'border-border hover:border-primary/50'
                  } `}
                >
                  {value}
                </button>
              )
            })}
          </div>

          {cultureValues.length > 0 && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-muted-foreground">
                Your priorities:{' '}
                <span className="font-medium text-foreground">
                  {cultureValues.join(', ')}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Deal Breakers */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-destructive" />
            Deal breakers
            <span className="text-sm text-muted-foreground">
              (Things you want to avoid)
            </span>
          </Label>

          <div className="flex gap-2">
            <Input
              type="text"
              value={currentDealBreaker}
              onChange={(e) => setCurrentDealBreaker(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addDealBreaker(currentDealBreaker)
                }
              }}
              placeholder="e.g., No remote work, Excessive travel"
              className="h-11"
            />
            <Button
              type="button"
              onClick={() => addDealBreaker(currentDealBreaker)}
              disabled={!currentDealBreaker.trim()}
              variant="outline"
              size="default"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>

          {dealBreakers.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-1">
              {dealBreakers.map((dealBreaker, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="py-1.5 pl-3 pr-1 text-sm"
                >
                  {dealBreaker}
                  <button
                    type="button"
                    onClick={() => removeDealBreaker(index)}
                    className="ml-2 rounded p-0.5 transition-colors hover:bg-background/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Skip reminder */}
        <div className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            This step is optional. You can{' '}
            <button
              type="button"
              onClick={onSkip}
              className="text-primary hover:underline"
            >
              skip it
            </button>{' '}
            or complete your profile later.
          </p>
        </div>
      </div>
    </div>
  )
}
