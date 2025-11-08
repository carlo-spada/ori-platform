import { fetchSkillsGapForJob } from '../jobs.js'
import { aiClient } from '../../lib/ai-client.js'

describe('fetchSkillsGapForJob', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('formats AI response data', async () => {
    jest.spyOn(aiClient, 'getSkillGap').mockResolvedValue({
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
    jest.spyOn(aiClient, 'getSkillGap').mockResolvedValue(null)

    const result = await fetchSkillsGapForJob(['React'], ['TypeScript'])

    expect(result).toBeUndefined()
  })

  it('skips AI call when no requirements are provided', async () => {
    const mockGetSkillGap = jest.spyOn(aiClient, 'getSkillGap')

    const result = await fetchSkillsGapForJob(['React'], [])

    expect(mockGetSkillGap).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})
