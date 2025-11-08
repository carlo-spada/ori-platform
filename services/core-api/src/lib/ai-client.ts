/**
 * AI Engine client for core-api.
 * Provides typed interface for communicating with the AI matching service.
 */

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:3002'

interface UserProfile {
  user_id: string
  skills: string[]
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
  years_of_experience?: number
  roles?: string[]
  work_style?: 'remote' | 'hybrid' | 'onsite' | 'flexible'
  industries?: string[]
  location?: string
  willing_to_relocate?: boolean
  salary_min?: number
  salary_max?: number
  goal?: string
  cv_text?: string
}

interface Job {
  job_id: string
  title: string
  company: string
  description: string
  requirements: string[]
  location?: string
  work_type?: 'remote' | 'hybrid' | 'onsite' | 'flexible'
  salary_min?: number
  salary_max?: number
  tags?: string[]
  posted_date?: string
}

interface MatchResult {
  job_id: string
  match_score: number
  semantic_score: number
  skill_match_score: number
  experience_score: number
  location_score: number
  reasoning: string
  key_matches: string[]
  missing_skills: string[]
}

interface MatchRequest {
  profile: UserProfile
  jobs: Job[]
  limit?: number
}

interface SkillGapRequest {
  user_skills: string[]
  required_skills: string[]
}

interface SkillGapResponse {
  user_skills: string[]
  required_skills: string[]
  missing_skills: string[]
}

interface SkillAnalysisResult {
  user_id: string
  target_role?: string
  current_skills: string[]
  skill_gaps: Array<{
    skill: string
    importance: 'critical' | 'important' | 'nice-to-have'
    current_level?: number
    target_level: number
    learning_resources: string[]
    estimated_learning_time?: string
  }>
  strengths: string[]
  recommendations: string[]
  overall_readiness: number
}

// Conversational AI interfaces
interface UserProfileContext {
  skills: string[]
  target_roles: string[]
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AIRequest {
  user_profile: UserProfileContext
  message_history: ChatMessage[]
  new_message: string
}

interface AIResponse {
  content: string
}

export class AIClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || AI_ENGINE_URL
  }

  /**
   * Check if AI engine is healthy and ready.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (!response.ok) return false

      const data = (await response.json()) as { status: string }
      return data.status === 'healthy' || data.status === 'degraded'
    } catch (error) {
      console.error('AI Engine health check failed:', error)
      return false
    }
  }

  /**
   * Generate intelligent job matches for a user.
   */
  async generateMatches(request: MatchRequest): Promise<MatchResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(30000), // 30 second timeout for matching
      })

      if (!response.ok) {
        const error = (await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))) as { error?: string }
        throw new Error(
          `AI matching failed: ${error.error || response.statusText}`,
        )
      }

      return (await response.json()) as MatchResult[]
    } catch (error) {
      console.error('AI matching request failed:', error)
      throw error
    }
  }

  /**
   * Calculate simple skill gap between user skills and required skills.
   * Returns which required skills the user is missing.
   */
  async getSkillGap(
    userSkills: string[],
    requiredSkills: string[],
  ): Promise<SkillGapResponse | null> {
    try {
      const request: SkillGapRequest = {
        user_skills: userSkills,
        required_skills: requiredSkills,
      }

      const response = await fetch(`${this.baseUrl}/api/v1/skill-gap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        const error = (await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))) as { error?: string }
        throw new Error(
          `Skill gap analysis failed: ${error.error || response.statusText}`,
        )
      }

      return (await response.json()) as SkillGapResponse
    } catch (error) {
      console.error('Skill gap request failed:', error)
      // Return null on error - graceful degradation
      return null
    }
  }

  /**
   * Analyze skill gaps for a user profile against target jobs.
   */
  async analyzeSkills(
    profile: UserProfile,
    targetJobs: Job[],
  ): Promise<SkillAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/analyze-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, target_jobs: targetJobs }),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const error = (await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))) as { error?: string }
        throw new Error(
          `Skill analysis failed: ${error.error || response.statusText}`,
        )
      }

      return (await response.json()) as SkillAnalysisResult
    } catch (error) {
      console.error('Skill analysis request failed:', error)
      throw error
    }
  }

  /**
   * Get learning path recommendations.
   */
  async getLearningPaths(
    profile: UserProfile,
    targetJobs: Job[],
    maxPaths: number = 5,
  ): Promise<unknown[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/learning-paths`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          target_jobs: targetJobs,
          max_paths: maxPaths,
        }),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const error = (await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))) as { error?: string }
        throw new Error(
          `Learning path generation failed: ${error.error || response.statusText}`,
        )
      }

      return (await response.json()) as unknown[]
    } catch (error) {
      console.error('Learning paths request failed:', error)
      throw error
    }
  }

  /**
   * Get role recommendations based on profile.
   */
  async recommendRoles(profile: UserProfile): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/recommend-roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        const error = (await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))) as { error?: string }
        throw new Error(
          `Role recommendation failed: ${error.error || response.statusText}`,
        )
      }

      const data = (await response.json()) as { suggested_roles?: string[] }
      return data.suggested_roles || []
    } catch (error) {
      console.error('Role recommendation request failed:', error)
      throw error
    }
  }

  /**
   * Generate context-aware conversational AI response.
   *
   * Sends user profile context and conversation history to the AI engine
   * to generate intelligent, personalized responses.
   */
  async generateResponse(
    userProfile: UserProfileContext,
    messageHistory: ChatMessage[],
    newMessage: string,
  ): Promise<AIResponse> {
    try {
      const request: AIRequest = {
        user_profile: userProfile,
        message_history: messageHistory,
        new_message: newMessage,
      }

      const response = await fetch(`${this.baseUrl}/api/v1/generate_response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(30000), // 30 second timeout for AI generation
      })

      if (!response.ok) {
        const error = (await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))) as { error?: string }
        throw new Error(
          `AI response generation failed: ${error.error || response.statusText}`,
        )
      }

      return (await response.json()) as AIResponse
    } catch (error) {
      console.error('AI response generation request failed:', error)
      throw error
    }
  }
}

// Singleton instance
export const aiClient = new AIClient()
