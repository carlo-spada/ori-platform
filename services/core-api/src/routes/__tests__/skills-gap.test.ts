import { fetchSkillsGapForJob } from '../jobs.js'
import { aiClient } from '../../lib/ai-client.js'

describe('fetchSkillsGapForJob', () => {
  let originalGetSkillGap: typeof aiClient.getSkillGap

  beforeEach(() => {
    originalGetSkillGap = aiClient.getSkillGap
  })

  afterEach(() => {
    ;(aiClient as any).getSkillGap = originalGetSkillGap
  })

  it('formats AI response data', async () => {
    ;(aiClient as any).getSkillGap = jest.fn().mockResolvedValue({
      user_skills: ['React'],
      required_skills: ['React', 'TypeScript'],
      missing_skills: ['TypeScript'],
    })

    const result = await fetchSkillsGapForJob(
      ['React'],
      ['React', 'TypeScript'],
    )

    expect(result).toEqual({
      userSkills: ['React'],
      requiredSkills: ['React', 'TypeScript'],
      missingSkills: ['TypeScript'],
    })
  })

  it('returns undefined when AI response is null', async () => {
    ;(aiClient as any).getSkillGap = jest.fn().mockResolvedValue(null)

    const result = await fetchSkillsGapForJob(['React'], ['TypeScript'])

    expect(result).toBeUndefined()
  })

  it('skips AI call when no requirements are provided', async () => {
    const mockGetSkillGap = jest.fn()
    ;(aiClient as any).getSkillGap = mockGetSkillGap

    const result = await fetchSkillsGapForJob(['React'], [])

    expect(mockGetSkillGap).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})
