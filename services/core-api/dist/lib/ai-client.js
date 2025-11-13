"use strict";
/**
 * AI Engine client for core-api.
 * Provides typed interface for communicating with the AI matching service.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiClient = exports.AIClient = void 0;
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:3002';
class AIClient {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl || AI_ENGINE_URL;
    }
    /**
     * Check if AI engine is healthy and ready.
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });
            if (!response.ok)
                return false;
            const data = (await response.json());
            return data.status === 'healthy' || data.status === 'degraded';
        }
        catch (error) {
            console.error('AI Engine health check failed:', error);
            return false;
        }
    }
    /**
     * Generate intelligent job matches for a user.
     */
    async generateMatches(request) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
                signal: AbortSignal.timeout(30000), // 30 second timeout for matching
            });
            if (!response.ok) {
                const error = (await response
                    .json()
                    .catch(() => ({ error: 'Unknown error' })));
                throw new Error(`AI matching failed: ${error.error || response.statusText}`);
            }
            return (await response.json());
        }
        catch (error) {
            console.error('AI matching request failed:', error);
            throw error;
        }
    }
    /**
     * Calculate simple skill gap between user skills and required skills.
     * Returns which required skills the user is missing.
     */
    async getSkillGap(userSkills, requiredSkills) {
        try {
            const request = {
                user_skills: userSkills,
                required_skills: requiredSkills,
            };
            const response = await fetch(`${this.baseUrl}/api/v1/skill-gap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
                signal: AbortSignal.timeout(10000), // 10 second timeout
            });
            if (!response.ok) {
                const error = (await response
                    .json()
                    .catch(() => ({ error: 'Unknown error' })));
                throw new Error(`Skill gap analysis failed: ${error.error || response.statusText}`);
            }
            return (await response.json());
        }
        catch (error) {
            console.error('Skill gap request failed:', error);
            // Return null on error - graceful degradation
            return null;
        }
    }
    /**
     * Analyze skill gaps for a user profile against target jobs.
     */
    async analyzeSkills(profile, targetJobs) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/analyze-skills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profile, target_jobs: targetJobs }),
                signal: AbortSignal.timeout(30000),
            });
            if (!response.ok) {
                const error = (await response
                    .json()
                    .catch(() => ({ error: 'Unknown error' })));
                throw new Error(`Skill analysis failed: ${error.error || response.statusText}`);
            }
            return (await response.json());
        }
        catch (error) {
            console.error('Skill analysis request failed:', error);
            throw error;
        }
    }
    /**
     * Get learning path recommendations.
     */
    async getLearningPaths(profile, targetJobs, maxPaths = 5) {
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
            });
            if (!response.ok) {
                const error = (await response
                    .json()
                    .catch(() => ({ error: 'Unknown error' })));
                throw new Error(`Learning path generation failed: ${error.error || response.statusText}`);
            }
            return (await response.json());
        }
        catch (error) {
            console.error('Learning paths request failed:', error);
            throw error;
        }
    }
    /**
     * Get role recommendations based on profile.
     */
    async recommendRoles(profile) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/recommend-roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
                signal: AbortSignal.timeout(15000),
            });
            if (!response.ok) {
                const error = (await response
                    .json()
                    .catch(() => ({ error: 'Unknown error' })));
                throw new Error(`Role recommendation failed: ${error.error || response.statusText}`);
            }
            const data = (await response.json());
            return data.suggested_roles || [];
        }
        catch (error) {
            console.error('Role recommendation request failed:', error);
            throw error;
        }
    }
    /**
     * Generate context-aware conversational AI response.
     *
     * Sends user profile context and conversation history to the AI engine
     * to generate intelligent, personalized responses.
     */
    async generateResponse(userProfile, messageHistory, newMessage) {
        try {
            const request = {
                user_profile: userProfile,
                message_history: messageHistory,
                new_message: newMessage,
            };
            const response = await fetch(`${this.baseUrl}/api/v1/generate_response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
                signal: AbortSignal.timeout(30000), // 30 second timeout for AI generation
            });
            if (!response.ok) {
                const error = (await response
                    .json()
                    .catch(() => ({ error: 'Unknown error' })));
                throw new Error(`AI response generation failed: ${error.error || response.statusText}`);
            }
            return (await response.json());
        }
        catch (error) {
            console.error('AI response generation request failed:', error);
            throw error;
        }
    }
}
exports.AIClient = AIClient;
// Singleton instance
exports.aiClient = new AIClient();
//# sourceMappingURL=ai-client.js.map