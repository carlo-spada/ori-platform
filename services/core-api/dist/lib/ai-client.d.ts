/**
 * AI Engine client for core-api.
 * Provides typed interface for communicating with the AI matching service.
 */
interface UserProfile {
    user_id: string;
    skills: string[];
    experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
    years_of_experience?: number;
    roles?: string[];
    work_style?: 'remote' | 'hybrid' | 'onsite' | 'flexible';
    industries?: string[];
    location?: string;
    willing_to_relocate?: boolean;
    salary_min?: number;
    salary_max?: number;
    goal?: string;
    cv_text?: string;
}
interface Job {
    job_id: string;
    title: string;
    company: string;
    description: string;
    requirements: string[];
    location?: string;
    work_type?: 'remote' | 'hybrid' | 'onsite' | 'flexible';
    salary_min?: number;
    salary_max?: number;
    tags?: string[];
    posted_date?: string;
}
interface MatchResult {
    job_id: string;
    match_score: number;
    semantic_score: number;
    skill_match_score: number;
    experience_score: number;
    location_score: number;
    reasoning: string;
    key_matches: string[];
    missing_skills: string[];
}
interface MatchRequest {
    profile: UserProfile;
    jobs: Job[];
    limit?: number;
}
interface SkillGapResponse {
    user_skills: string[];
    required_skills: string[];
    missing_skills: string[];
}
interface SkillAnalysisResult {
    user_id: string;
    target_role?: string;
    current_skills: string[];
    skill_gaps: Array<{
        skill: string;
        importance: 'critical' | 'important' | 'nice-to-have';
        current_level?: number;
        target_level: number;
        learning_resources: string[];
        estimated_learning_time?: string;
    }>;
    strengths: string[];
    recommendations: string[];
    overall_readiness: number;
}
interface UserProfileContext {
    skills: string[];
    target_roles: string[];
}
interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
interface AIResponse {
    content: string;
}
export declare class AIClient {
    private baseUrl;
    constructor(baseUrl?: string);
    /**
     * Check if AI engine is healthy and ready.
     */
    healthCheck(): Promise<boolean>;
    /**
     * Generate intelligent job matches for a user.
     */
    generateMatches(request: MatchRequest): Promise<MatchResult[]>;
    /**
     * Calculate simple skill gap between user skills and required skills.
     * Returns which required skills the user is missing.
     */
    getSkillGap(userSkills: string[], requiredSkills: string[]): Promise<SkillGapResponse | null>;
    /**
     * Analyze skill gaps for a user profile against target jobs.
     */
    analyzeSkills(profile: UserProfile, targetJobs: Job[]): Promise<SkillAnalysisResult>;
    /**
     * Get learning path recommendations.
     */
    getLearningPaths(profile: UserProfile, targetJobs: Job[], maxPaths?: number): Promise<unknown[]>;
    /**
     * Get role recommendations based on profile.
     */
    recommendRoles(profile: UserProfile): Promise<string[]>;
    /**
     * Generate context-aware conversational AI response.
     *
     * Sends user profile context and conversation history to the AI engine
     * to generate intelligent, personalized responses.
     */
    generateResponse(userProfile: UserProfileContext, messageHistory: ChatMessage[], newMessage: string): Promise<AIResponse>;
}
export declare const aiClient: AIClient;
export {};
//# sourceMappingURL=ai-client.d.ts.map