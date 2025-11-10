'use client'

import { useState, useRef } from 'react'
import { Upload, Linkedin, FileText, Loader2, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { OnboardingData } from '@/lib/types/onboarding'

interface ImportProfileDialogProps {
  onImport: (data: Partial<OnboardingData>) => void
}

export function ImportProfileDialog({ onImport }: ImportProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle CV upload
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploading(true)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)

      // TODO: Upload to backend for parsing
      // const response = await fetch('/api/v1/onboarding/import-cv', {
      //   method: 'POST',
      //   body: formData,
      // })
      // const parsed = await response.json()

      // Simulate parsing (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock parsed data
      const mockParsedData: Partial<OnboardingData> = {
        identity: {
          fullName: 'John Smith',
          preferredName: 'John',
        },
        context: {
          currentStatus: 'professional',
          yearsExperience: 5,
          location: 'San Francisco, CA',
          isRemoteOpen: true,
        },
        expertise: {
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
        },
        import: {
          cvUrl: URL.createObjectURL(file),
        },
      }

      // Update form with parsed data
      onImport(mockParsedData)

      toast.success('CV imported successfully!')
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to parse CV:', error)
      toast.error('Failed to parse CV. Please fill in the details manually.')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle LinkedIn import
  const handleLinkedInImport = async () => {
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      toast.error('Please enter a valid LinkedIn URL')
      return
    }

    setIsUploading(true)

    try {
      // TODO: Call backend to scrape LinkedIn
      // const response = await fetch('/api/v1/onboarding/import-linkedin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ url: linkedinUrl }),
      // })
      // const parsed = await response.json()

      // Simulate parsing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock parsed data
      const mockParsedData: Partial<OnboardingData> = {
        identity: {
          fullName: 'Jane Doe',
          preferredName: 'Jane',
        },
        context: {
          currentStatus: 'professional',
          yearsExperience: 8,
          location: 'New York, NY',
          isRemoteOpen: true,
        },
        expertise: {
          skills: ['Product Management', 'Agile', 'Data Analysis', 'Strategy', 'Leadership'],
        },
        aspirations: {
          dreamRole: 'VP of Product',
          targetRoles: ['Senior Product Manager', 'Director of Product'],
        },
        import: {
          linkedinUrl,
        },
      }

      // Update form with parsed data
      onImport(mockParsedData)

      toast.success('LinkedIn profile imported successfully!')
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to import LinkedIn:', error)
      toast.error('Failed to import LinkedIn profile. Please fill in the details manually.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Import Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Your Profile</DialogTitle>
          <DialogDescription>
            Save time by importing from your CV or LinkedIn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* CV Upload */}
          <div className="space-y-3">
            <Label>Upload CV/Resume</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed rounded-lg p-6 hover:border-primary/50 cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center text-center space-y-2">
                <FileText className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Click to upload CV</p>
                  <p className="text-xs text-muted-foreground">PDF or Word (max 10MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* LinkedIn Import */}
          <div className="space-y-3">
            <Label htmlFor="linkedin">Import from LinkedIn</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/yourprofile"
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleLinkedInImport}
                disabled={!linkedinUrl || isUploading}
                size="default"
              >
                Import
              </Button>
            </div>
          </div>

          {/* Loading state */}
          {isUploading && (
            <div className="flex items-center justify-center p-4 rounded-lg bg-muted/50">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <p className="text-sm">Parsing your profile...</p>
            </div>
          )}

          {/* Privacy note */}
          <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <p>
              <strong>Privacy:</strong> Your data is processed securely and never shared
              without your permission.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}