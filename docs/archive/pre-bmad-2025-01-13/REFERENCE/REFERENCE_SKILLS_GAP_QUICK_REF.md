---
type: reference-doc
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: reference, skills, quick, ref.md, analysis, what, does
priority: medium
quick-read-time: 1min
deep-dive-time: 2min
---

# Skills Gap Analysis - Quick Reference

**Status:** ✅ Production Ready (v1.0.1)
**Next:** Accessibility fixes (15 min) + UI review

---

## What It Does

Shows users which skills they have vs. need for each job recommendation.

**User Value:**

- Instant qualification check
- Clear learning path
- Motivational feedback

---

## Architecture

```
Frontend (Next.js) → Core API (Express) → AI Engine (FastAPI)
                                            ↓
                                    Calculate missing skills
                                    (set difference algorithm)
```

**Endpoint:** `POST /api/v1/skill-gap`

**Response:**

```json
{
  "userSkills": ["React", "TypeScript"],
  "requiredSkills": ["React", "TypeScript", "Node.js"],
  "missingSkills": ["Node.js"]
}
```

---

## Component

**File:** `src/components/recommendations/SkillsGapDisplay.tsx`

**Visual Design:**

- ✅ Matched skills: Green badges with CheckCircle
- ❌ Missing skills: Red badges with XCircle
- Summary: "X of Y matched"

---

## Pending Work

### Task C: Accessibility (15 min) ⏳

```tsx
// Add ARIA labels
<div role="region" aria-label="Skills gap analysis">
  <div role="listitem" aria-label={`Matched skill: ${skill}`}>
    {/* ... */}
  </div>
</div>
```

### Task D: Gemini Review

- End-to-end verification
- Final polish sign-off

---

## Future Enhancements

**Quick Wins:**

1. Progress bar (20 min)
2. Perfect match celebration (15 min)
3. Truncate long lists (25 min)

**Later:**

- Learning resource links
- Collapsible sections
- Loading skeletons

---

## Error Handling

**AI Engine Down:** Graceful degradation (job recommendations still show, no skillsGap data)
**No Data:** Component returns null (no render)
**Empty Arrays:** Handled safely

---

**Full Technical Docs:** `docs/archive/skills-gap-analysis-detailed.md`
