import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchSkillsGapForJob } from '../jobs.js'
import { aiClient } from '../../lib/ai-client.js'

test('fetchSkillsGapForJob formats AI response data', async () => {
  const original = aiClient.getSkillGap
  ;(aiClient as any).getSkillGap = async () => ({
    user_skills: ['React'],
    required_skills: ['React', 'TypeScript'],
    missing_skills: ['TypeScript'],
  })

  try {
    const result = await fetchSkillsGapForJob(
      ['React'],
      ['React', 'TypeScript'],
    )
    assert.deepEqual(result, {
      userSkills: ['React'],
      requiredSkills: ['React', 'TypeScript'],
      missingSkills: ['TypeScript'],
    })
  } finally {
    ;(aiClient as any).getSkillGap = original
  }
})

test('fetchSkillsGapForJob returns undefined when AI response is null', async () => {
  const original = aiClient.getSkillGap
  ;(aiClient as any).getSkillGap = async () => null

  try {
    const result = await fetchSkillsGapForJob(['React'], ['TypeScript'])
    assert.equal(result, undefined)
  } finally {
    ;(aiClient as any).getSkillGap = original
  }
})

test('fetchSkillsGapForJob skips AI call when no requirements are provided', async () => {
  const original = aiClient.getSkillGap
  let callCount = 0
  ;(aiClient as any).getSkillGap = async () => {
    callCount += 1
    return null
  }

  try {
    const result = await fetchSkillsGapForJob(['React'], [])
    assert.equal(callCount, 0)
    assert.equal(result, undefined)
  } finally {
    ;(aiClient as any).getSkillGap = original
  }
})
