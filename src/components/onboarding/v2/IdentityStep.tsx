'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Camera } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { StepComponentProps } from '@/lib/types/onboarding'

export function IdentityStep({ data, onChange, errors = {} }: StepComponentProps) {
  const [fullName, setFullName] = useState(data.identity?.fullName || '')
  const [preferredName, setPreferredName] = useState(data.identity?.preferredName || '')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(data.identity?.profilePhotoUrl || '')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Smart name parsing - suggest preferred name from full name
  useEffect(() => {
    if (fullName && !preferredName) {
      // Extract first name intelligently
      const firstName = fullName.split(' ')[0]
      if (firstName && firstName.length > 1) {
        setPreferredName(firstName)
      }
    }
  }, [fullName, preferredName])

  // Update parent on changes
  useEffect(() => {
    onChange({
      identity: {
        fullName,
        preferredName,
        profilePhotoUrl,
      },
    })
  }, [fullName, preferredName, profilePhotoUrl, onChange])

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!fullName) return ''
    const parts = fullName.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return fullName[0]?.toUpperCase() || ''
  }

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return
    }

    setIsUploading(true)

    try {
      // For now, create a local URL
      // In production, upload to Supabase storage
      const localUrl = URL.createObjectURL(file)
      setProfilePhotoUrl(localUrl)

      // TODO: Upload to Supabase
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload(`${user.id}/${file.name}`, file)
    } catch (error) {
      console.error('Failed to upload photo:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Let's start with you</h2>
        <p className="text-muted-foreground text-lg">
          Tell us how you'd like to be addressed
        </p>
      </div>

      {/* Profile Photo */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-border">
            {profilePhotoUrl ? (
              <AvatarImage src={profilePhotoUrl} alt={fullName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-2xl">
                {getInitials() || <User className="h-10 w-10 text-muted-foreground" />}
              </AvatarFallback>
            )}
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full border-2 border-background hover:bg-primary/90 transition-colors"
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Optional: Add a photo to personalize your profile
        </p>
      </div>

      {/* Name Fields */}
      <div className="space-y-6 max-w-md mx-auto">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-base">
            Full name *
          </Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Smith"
            className={`h-12 text-base ${errors.fullName ? 'border-destructive' : ''}`}
            autoFocus
            autoComplete="name"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Preferred Name */}
        <div className="space-y-2">
          <Label htmlFor="preferredName" className="text-base">
            Preferred name *
            <span className="text-sm text-muted-foreground ml-2">
              (How should we address you?)
            </span>
          </Label>
          <Input
            id="preferredName"
            type="text"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            placeholder="Jane"
            className={`h-12 text-base ${errors.preferredName ? 'border-destructive' : ''}`}
            autoComplete="given-name"
          />
          {errors.preferredName && (
            <p className="text-sm text-destructive">{errors.preferredName}</p>
          )}
          {preferredName && preferredName !== fullName?.split(' ')[0] && (
            <p className="text-sm text-muted-foreground">
              We'll use "{preferredName}" throughout the app
            </p>
          )}
        </div>
      </div>

      {/* Visual hint about progress */}
      <div className="pt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Takes about 3-4 minutes • Your progress is saved automatically
        </p>
      </div>
    </div>
  )
}