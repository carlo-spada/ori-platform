# Onboarding Implementation - Issues Quick Reference

**Date**: 2025-11-10  
**Document Purpose**: Highlight specific bugs/gaps found during code review

---

## CRITICAL ISSUES

### Issue #1: Error Handler Returns to Wrong Step ⚠️ HIGH PRIORITY

**Location**: `/src/app/onboarding/page.tsx` line ~145

**Current Code**:

```typescript
onError: (error) => {
  console.error('Onboarding submission failed:', error)
  toast.error('Failed to save your profile. Please try again.')
  // Return user to previous step (goals) and preserve data
  setCurrentStepIndex(currentStepIndex)  // ❌ BUG
},
```

**Problem**:

- When on goals step (index 3), `handleNext()` increments to finalizing (index 4)
- Then calls `submitOnboarding()`
- If error occurs, code does `setCurrentStepIndex(currentStepIndex)` where `currentStepIndex` is still 4
- Sets index to 4 again (no change) → user stays on broken finalizing screen
- User cannot interact or go back

**Expected Behavior**:

- Return to goals step (index 3) to fix data and retry

**Fix**:

```typescript
onError: (error) => {
  console.error('Onboarding submission failed:', error)
  toast.error('Failed to save your profile. Please try again.')
  // Return to previous step
  setCurrentStepIndex(currentStepIndex - 1)  // ✅ CORRECT
},
```

**Impact**: User stuck on error screen after submission fails (network, validation, Stripe, etc.)

---

### Issue #2: Missing "Full Name" in Onboarding Form ⚠️ MEDIUM PRIORITY

**Location**: BasicInfoStep component

**Current Implementation**:

- Only captures: `headline`, `location`
- Missing: `full_name` field

**Evidence**:

1. Backend accepts `full_name` in request (profile.ts line 98)
2. Backend validates string length: max 200 chars (profile.ts line 81)
3. Database schema has `full_name` column in user_profiles
4. TypeScript types show `full_name` as optional on UserProfile
5. Profile page shows "Full Name" input in profileForm section
6. But onboarding **never** captures it

**Data Flow**:

```
User signs up → Onboarding → No full_name sent → Backend receives null/undefined
→ user_profiles.full_name stays empty
```

**Consequences**:

- User's name missing from profile after onboarding
- Need to manually fill in on profile page later
- Poor UX for core identifying information

**Fix**: Add to BasicInfoStep

```typescript
interface BasicInfoStepProps {
  value: OnboardingData['basicInfo'] & { fullName?: string }
  // Add input for fullName
}

// Also update frontend OnboardingData type:
export interface OnboardingData {
  basicInfo: {
    fullName: string // ← ADD THIS
    headline: string
    location: string
  }
  // ...
}

// Transform in page.tsx when submitting:
const profileData = {
  full_name: data.basicInfo.fullName, // ← ADD THIS
  headline: data.basicInfo.headline,
  location: data.basicInfo.location,
  // ...
}
```

---

### Issue #3: Stripe Customer Creation Error Tolerance

**Location**: `/services/core-api/src/routes/profile.ts` line ~110

**Current Code**:

```typescript
// Ensure user has a Stripe customer
const userEmail = await getUserEmail(req.user.id)
await ensureStripeCustomer(req.user.id, userEmail, full_name)  // ← No try-catch

// Then update profile
const { data: profile, error } = await supabase
  .from('user_profiles')
  .update(updateData)
  ...
```

**Problem**:

- If Stripe customer creation fails, entire onboarding fails
- No error handling or fallback
- User sees "Failed to save your profile" but actual error is Stripe-related
- Stripe errors (invalid email, API quota, network) block profile setup

**Current Error Handling**:

```typescript
} catch (error) {
  console.error('Unexpected error updating profile:', error)
  return res.status(500).json({ error: 'Internal server error' })
}
```

**Issue**: Generic 500 error, doesn't tell frontend what failed (Stripe vs database)

**Recommendation**:

```typescript
try {
  // Ensure Stripe customer, but don't fail onboarding if it fails
  const userEmail = await getUserEmail(req.user.id)
  try {
    await ensureStripeCustomer(req.user.id, userEmail, full_name)
  } catch (stripeError) {
    console.error('Warning: Stripe customer creation failed:', stripeError)
    // Continue anyway - Stripe setup can be retried later
  }

  // Now safe to update profile
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    ...
} catch (error) {
  // ...
}
```

**Impact**: Stripe failures shouldn't block user onboarding

---

## MEDIUM PRIORITY ISSUES

### Issue #4: Progress Calculation Unclear

**Location**: `/src/app/onboarding/page.tsx` line ~48

**Current Code**:

```typescript
const totalSteps = STEPS.length - 1 // Don't count finalizing in progress
const progressPercent = (currentStepIndex / totalSteps) * 100

// STEPS array has 5 elements [0,1,2,3,4]
// totalSteps = 4
// currentStepIndex = 0 → 0% (welcome)
// currentStepIndex = 1 → 25% (basicInfo)
// currentStepIndex = 2 → 50% (skills)
// currentStepIndex = 3 → 75% (goals)
// currentStepIndex = 4 → 100% (finalizing - not shown)
```

**Issue**:

- Math is correct but confusing
- Comment says "don't count finalizing" but still includes it in division
- Progress jumps from 75% to 100% to being hidden

**Minor Improvement**:

```typescript
// More explicit
const INTERACTIVE_STEPS = ['welcome', 'basicInfo', 'skills', 'goals']
const progressPercent = (currentStepIndex / INTERACTIVE_STEPS.length) * 100
```

**Impact**: Low - works correctly, just slightly confusing

---

### Issue #5: Skills Array GIN Index Asymmetry

**Location**: `/supabase/migrations/20251108020018_*.sql`

**Current**:

```sql
CREATE INDEX idx_user_profiles_target_roles
  ON public.user_profiles USING GIN (target_roles);
```

**Observation**:

- `target_roles` has GIN index
- `skills` array does NOT have index
- Both are arrays, both used for matching

**Question**: Will need performance testing when scale increases

**Potential Fix** (if needed later):

```sql
CREATE INDEX idx_user_profiles_skills
  ON public.user_profiles USING GIN (skills);
```

**Impact**: Low - not urgent unless search/filter performance degrades

---

## LOW PRIORITY / DESIGN NOTES

### Note #1: Data Loss on Page Navigation

**Location**: Component state only

**Current**: Form data stored ONLY in component state

```typescript
const [data, setData] = useState<OnboardingData>({...})
```

**Risk**:

- Close browser tab → data lost
- Page refresh → data lost
- Browser crash → data lost
- User must restart entire onboarding

**Trade-off**:

- ✅ Simpler code, less API calls
- ❌ Poor UX if user interrupted

**Not Critical**: Expected behavior for most onboarding flows, but could improve with:

- Auto-save to localStorage per step
- Or backend draft state

---

### Note #2: Skip Functionality

**Current**: Welcome step has no "Skip" option
**Expected**: Some flows allow skipping optional steps

**Not Implemented**: All steps are required

- Headline + location: Required
- Skills: Required (3+ minimum)
- Goals: Required (vision OR roles)

**This is fine** - if business logic says all required, current implementation is correct

---

### Note #3: No Rate Limiting on Submission

**Location**: Frontend form only

**Current**: No rate limiting on API calls

```typescript
<Button
  disabled={!isStepValid() || isSubmitting}  // Only disables during submission
/>
```

**Risk**: User could spam "Finish" button (unlikely with UI, but possible with console)

**Consideration**: Backend could add rate limiting headers/429 responses

**Not Critical**: Low priority given UI restrictions

---

## SUMMARY: ISSUES BY SEVERITY

| #   | Issue                               | Severity   | Type         | File              | Status         |
| --- | ----------------------------------- | ---------- | ------------ | ----------------- | -------------- |
| 1   | Error handler sets wrong index      | **HIGH**   | Bug          | page.tsx:145      | Needs Fix      |
| 2   | Missing full_name field             | **MEDIUM** | Gap          | BasicInfoStep.tsx | Needs Addition |
| 3   | Stripe error not handled gracefully | **MEDIUM** | Risk         | profile.ts:110    | Review         |
| 4   | Progress calculation confusing      | **LOW**    | Code Quality | page.tsx:48       | Optional       |
| 5   | Skills array missing index          | **LOW**    | Perf         | migration.sql     | Future         |
| 6   | No data persistence                 | **LOW**    | UX           | page.tsx          | Design Choice  |
| 7   | No skip functionality               | **LOW**    | Feature      | page.tsx          | By Design      |
| 8   | No rate limiting                    | **LOW**    | Security     | page.tsx          | Minor          |

---

## RECOMMENDED FIX ORDER

1. **First**: Fix #1 (Error handler) - Critical user-facing bug
2. **Second**: Fix #2 (Full name) - Important data gap
3. **Third**: Review #3 (Stripe handling) - Risk mitigation
4. **Later**: Improve #4-#8 - Nice-to-haves

---

## TESTING CHECKLIST

After fixes:

- [ ] Submit onboarding successfully
- [ ] Trigger network error on submit (browser DevTools) → should return to goals step
- [ ] Verify full_name is captured and saved to profile
- [ ] Check profile page shows name after onboarding
- [ ] Verify Stripe customer is created
- [ ] Test with various input lengths (especially headline)
- [ ] Test back button preserves data
- [ ] Test redirect on completion

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Status**: Ready for implementation
