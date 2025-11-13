"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jobs_js_1 = require("../jobs.js");
const ai_client_js_1 = require("../../lib/ai-client.js");
describe('fetchSkillsGapForJob', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('formats AI response data', async () => {
        jest.spyOn(ai_client_js_1.aiClient, 'getSkillGap').mockResolvedValue({
            user_skills: ['React'],
            required_skills: ['React', 'TypeScript'],
            missing_skills: ['TypeScript'],
        });
        const result = await (0, jobs_js_1.fetchSkillsGapForJob)(['React'], ['React', 'TypeScript']);
        expect(result).toEqual({
            userSkills: ['React'],
            requiredSkills: ['React', 'TypeScript'],
            missingSkills: ['TypeScript'],
        });
    });
    it('returns undefined when AI response is null', async () => {
        jest.spyOn(ai_client_js_1.aiClient, 'getSkillGap').mockResolvedValue(null);
        const result = await (0, jobs_js_1.fetchSkillsGapForJob)(['React'], ['TypeScript']);
        expect(result).toBeUndefined();
    });
    it('skips AI call when no requirements are provided', async () => {
        const mockGetSkillGap = jest.spyOn(ai_client_js_1.aiClient, 'getSkillGap');
        const result = await (0, jobs_js_1.fetchSkillsGapForJob)(['React'], []);
        expect(mockGetSkillGap).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });
});
//# sourceMappingURL=skills-gap.test.js.map