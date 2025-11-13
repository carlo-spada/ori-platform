import { type Router as RouterType } from 'express';
declare const router: RouterType;
export interface FormattedSkillGap {
    userSkills: string[];
    requiredSkills: string[];
    missingSkills: string[];
}
export declare function fetchSkillsGapForJob(userSkills?: string[], jobRequirements?: string[]): Promise<FormattedSkillGap | undefined>;
export { router as jobRoutes };
//# sourceMappingURL=jobs.d.ts.map