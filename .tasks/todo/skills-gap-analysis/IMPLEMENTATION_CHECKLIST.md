# Skills Gap Analysis - Polish Implementation Checklist

Quick reference for implementing the remaining polish items from POLISH_ROADMAP.md

---

## ✅ Tier 1 - Completed

- [x] **Skill Match Summary Header** - Shows "X of Y matched" at top of component
  - File: `src/components/recommendations/SkillsGapDisplay.tsx:19-25`
  - Commit: TBD
  - Time: 5 min

---

## ⏳ Tier 1 - Pending (Pre-PR to Main)

### Accessibility Quick Fixes (10 min)

**File:** `src/components/recommendations/SkillsGapDisplay.tsx`

**Changes:**
```diff
  return (
-   <div className="space-y-3">
+   <div
+     className="space-y-3"
+     role="region"
+     aria-label="Skills gap analysis for this job"
+   >
      {/* Skill Match Summary */}
      {/* ... */}

      {matchedSkillsList.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            Your Matching Skills
          </h4>
-         <div className="flex flex-wrap gap-2">
+         <div className="flex flex-wrap gap-2" role="list">
            {matchedSkillsList.map((skill, index) => (
              <div
                key={`matched-${skill}-${index}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20"
+               role="listitem"
+               aria-label={`Matched skill: ${skill}`}
              >
-               <CheckCircle className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
+               <CheckCircle className="w-3.5 h-3.5 text-green-500" aria-label="Matched" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Same pattern for missing skills section */}
    </div>
  );
```

**Test:**
- [ ] Run with VoiceOver (Mac): `Cmd+F5` to toggle
- [ ] Verify screen reader announces "Skills gap analysis for this job" when entering region
- [ ] Verify each skill is announced with its status ("Matched skill: Python")
- [ ] Tab through skills, verify focus is visible

---

### Visual Hierarchy Container (5 min)

**File:** `src/components/recommendations/SkillsGapDisplay.tsx`

**Changes:**
```diff
  return (
+   <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
      <div
        className="space-y-3"
        role="region"
        aria-label="Skills gap analysis for this job"
      >
        {/* Existing content */}
      </div>
+   </div>
  );
```

**Visual Check:**
- [ ] Skills section has subtle background
- [ ] Clear separation from job description text
- [ ] Consistent with card design language
- [ ] Works in both light and dark mode

---

## 📦 Tier 2 - Post-Merge (v1.1)

### Progress Bar Indicator (20 min)

**File:** `src/components/recommendations/SkillsGapDisplay.tsx`

**Steps:**
1. Calculate match percentage:
   ```tsx
   const matchPercentage = Math.round(
     (matchedSkillsList.length / skillsGap.requiredSkills.length) * 100
   );
   ```

2. Add color threshold logic:
   ```tsx
   const getMatchColor = (percentage: number) => {
     if (percentage >= 71) return 'from-green-500 to-emerald-500';
     if (percentage >= 41) return 'from-yellow-500 to-amber-500';
     return 'from-red-500 to-rose-500';
   };
   ```

3. Insert progress bar before skill sections:
   ```tsx
   <div className="space-y-1 mb-3">
     <div className="flex justify-between text-xs">
       <span className="font-medium">Skill Match</span>
       <span className="text-muted-foreground">{matchPercentage}%</span>
     </div>
     <div className="h-2 bg-muted rounded-full overflow-hidden">
       <div
         className={`h-full bg-gradient-to-r ${getMatchColor(matchPercentage)} transition-all duration-500`}
         style={{ width: `${matchPercentage}%` }}
       />
     </div>
   </div>
   ```

**Test:**
- [ ] 100% match: Green bar, full width
- [ ] 50% match: Yellow bar, half width
- [ ] 25% match: Red bar, quarter width
- [ ] Smooth animation when data changes

---

### Perfect Match State (15 min)

**File:** `src/components/recommendations/SkillsGapDisplay.tsx`

**Steps:**
1. Add check at top of component:
   ```tsx
   if (skillsGap && skillsGap.requiredSkills.length > 0) {
     const matchedSkillsList = skillsGap.userSkills.filter(skill =>
       skillsGap.requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
     );
     const missingSkillsList = skillsGap.missingSkills;

     // Perfect match state
     if (missingSkillsList.length === 0 && matchedSkillsList.length > 0) {
       return (
         <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
           <div className="flex items-start gap-3">
             <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
             <div>
               <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                 Perfect Match! 🎉
               </h4>
               <p className="text-xs text-muted-foreground">
                 You have all {skillsGap.requiredSkills.length} required skills for this role.
                 You're well-qualified to apply!
               </p>
             </div>
           </div>
         </div>
       );
     }

     // Continue with normal rendering...
   }
   ```

**Test:**
- [ ] Shows when user has all required skills
- [ ] Doesn't show when even 1 skill is missing
- [ ] Celebratory tone in copy
- [ ] Green color scheme consistent with matched skills

---

### Truncate Long Skill Lists (25 min)

**File:** `src/components/recommendations/SkillsGapDisplay.tsx`

**Steps:**
1. Add state:
   ```tsx
   import { useState } from 'react';

   const MAX_VISIBLE_SKILLS = 5;
   const [showAllMissing, setShowAllMissing] = useState(false);
   ```

2. Calculate visible skills:
   ```tsx
   const visibleMissingSkills = showAllMissing
     ? missingSkillsList
     : missingSkillsList.slice(0, MAX_VISIBLE_SKILLS);

   const hiddenCount = Math.max(0, missingSkillsList.length - MAX_VISIBLE_SKILLS);
   ```

3. Render with expand button:
   ```tsx
   {visibleMissingSkills.map((skill, index) => (
     // Skill badge
   ))}

   {hiddenCount > 0 && !showAllMissing && (
     <button
       onClick={() => setShowAllMissing(true)}
       className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
     >
       + {hiddenCount} more skill{hiddenCount > 1 ? 's' : ''}
     </button>
   )}

   {showAllMissing && missingSkillsList.length > MAX_VISIBLE_SKILLS && (
     <button
       onClick={() => setShowAllMissing(false)}
       className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
     >
       Show less
     </button>
   )}
   ```

**Test:**
- [ ] Shows first 5 missing skills by default
- [ ] Shows "+ X more skills" button if > 5
- [ ] Expands to show all on click
- [ ] Shows "Show less" after expanding
- [ ] All matched skills always visible (not truncated)

---

## 🔧 Tier 3 - Future Enhancements

### Loading Skeleton (30 min)

**Create:** `src/components/recommendations/SkillsGapSkeleton.tsx`

```tsx
export function SkillsGapSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-label="Loading skills analysis">
      <div className="h-6 bg-muted rounded w-1/3" />
      <div className="flex gap-2">
        <div className="h-7 bg-muted rounded-md w-20" />
        <div className="h-7 bg-muted rounded-md w-24" />
        <div className="h-7 bg-muted rounded-md w-16" />
      </div>
      <div className="flex gap-2">
        <div className="h-7 bg-muted rounded-md w-24" />
        <div className="h-7 bg-muted rounded-md w-20" />
      </div>
    </div>
  );
}
```

**Usage in JobRecommendationCard:**
```tsx
import { SkillsGapSkeleton } from './SkillsGapSkeleton';

// In render:
{isLoadingSkillsGap ? (
  <SkillsGapSkeleton />
) : (job.skillsGap || job.skills_analysis) && (
  <SkillsGapDisplay skillsGap={job.skillsGap} skills={job.skills_analysis} />
)}
```

---

### Collapsible Sections (45 min)

**Add to SkillsGapDisplay:**
```tsx
import { ChevronDown, ChevronUp } from 'lucide-react';

const [isExpanded, setIsExpanded] = useState(
  matchedSkillsList.length + missingSkillsList.length <= 12
);

// In header:
<div className="flex items-center justify-between pb-1 border-b border-border/50">
  <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-foreground/80"
  >
    Skills Analysis
    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
  </button>
  <span className="text-xs font-medium text-muted-foreground">
    {matchedSkillsList.length} of {skillsGap.requiredSkills.length} matched
  </span>
</div>

{isExpanded && (
  <div className="space-y-3">
    {/* Skill sections */}
  </div>
)}
```

---

### Learning Resource Links (60+ min)

**Requires:**
- Backend integration with AI Engine `/api/v1/learning-paths`
- Or curated link database

**Implementation:**
```tsx
<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 group">
  <XCircle className="w-3.5 h-3.5 text-red-500" />
  <span className="text-xs font-medium text-red-600 dark:text-red-400">
    {skill}
  </span>
  <a
    href={`/app/learning/${encodeURIComponent(skill)}`}
    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
    aria-label={`Learn ${skill}`}
  >
    <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-foreground" />
  </a>
</div>
```

---

## Testing Checklist

Before marking any item complete:

### Visual Regression
- [ ] Test mobile: 320px, 375px, 428px
- [ ] Test tablet: 768px, 1024px
- [ ] Test desktop: 1280px, 1920px
- [ ] Test dark mode
- [ ] Test with 0, 3, 10, 20+ skills

### Functionality
- [ ] Component renders without errors
- [ ] Data flows from API correctly
- [ ] Error states handled gracefully
- [ ] Loading states smooth

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Performance
- [ ] No layout shift
- [ ] Animations smooth (<16ms)
- [ ] No unnecessary re-renders

---

## Commit Message Templates

```bash
# For accessibility fixes
git commit -m "a11y: add ARIA labels and roles to SkillsGapDisplay

- Add role='region' and aria-label to container
- Add aria-label to skill badges for screen readers
- Replace aria-hidden with descriptive aria-label on icons
- Add role='list' and role='listitem' for semantic structure

Improves WCAG 2.1 AA compliance for skills gap analysis feature"

# For visual hierarchy
git commit -m "ui: add visual container to SkillsGapDisplay

- Wrap component in subtle background container
- Add border to create clear visual separation
- Improves visual hierarchy on job recommendation cards

Part of Skills Gap Analysis polish (Tier 1)"

# For progress bar
git commit -m "feat: add skill match progress bar to SkillsGapDisplay

- Calculate and display match percentage (0-100%)
- Color-coded gradient: red (0-40%), yellow (41-70%), green (71-100%)
- Smooth animation on data changes
- Provides instant visual feedback on qualification level

Part of Skills Gap Analysis polish (Tier 2)"
```

---

**Last Updated:** 2025-11-07
**Maintained By:** Claude (Implementer & Builder)
