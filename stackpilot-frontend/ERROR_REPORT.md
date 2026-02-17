# StackPilot Frontend Error Report

## Summary

- **Total Errors**: 56 TypeScript errors + 7 ESLint errors = **63 total errors**
- **Files with Errors**: 20 files

---

## ESLint Errors (7 errors in 5 files)

### 1. `app/(dashboard)/layout.tsx` - 1 warning

- **Line 17**: Unused variable `requireAuth`

### 2. `components/shared/lordicon-wrapper.tsx` - 1 error

- **Line 3**: Using `any` type instead of proper typing

### 3. `components/ui/alert-dialog.tsx` - 1 error

- **Line 48**: Using `any` type in React.cloneElement

### 4. `lib/hooks/use-auth.ts` - 2 errors

- **Line 20**: Calling setState synchronously within useEffect (performance issue)
- **Line 21**: Unused variable `err`

### 5. `lib/types/api.ts` - 3 errors

- **Lines 37-39**: Using `any` type for structuredData fields (skills, experience, projects, education)

### 6. `tailwind.config.js` - 1 error

- **Line 82**: Using `require()` instead of ES6 import

---

## TypeScript Errors (56 errors in 17 files)

### 1. `app/(dashboard)/matches/page.tsx` - 3 errors

- **Line 29**: `resumes` property doesn't exist on UseQueryResult
- **Line 29**: `primaryResume` property doesn't exist on UseQueryResult
- **Line 173**: Parameter `resume` has implicit `any` type

### 2. `app/(dashboard)/resumes/[id]/page.tsx` - 13 errors

- **Lines 90-100**: `scoreBreakdown` property doesn't exist on Resume type
- **Lines 243, 255, 294**: Implicit `any` types for map parameters

### 3. `app/(dashboard)/resumes/upload/page.tsx` - 1 error

- **Line 66**: `animations.save` doesn't exist

### 4. `app/(dashboard)/settings/page.tsx` - 1 error

- **Line 57**: `animations.theme` doesn't exist

### 5. `app/admin/analytics/page.tsx` - 1 error

- **Line 141**: `animations.download` doesn't exist

### 6. `app/admin/jobs/page.tsx` - 1 error

- **Line 160**: `percent` is possibly undefined

### 7. `app/admin/page.tsx` - 4 errors

- **Line 147**: `animations.scan` doesn't exist
- **Line 169**: `animations.revenue` doesn't exist
- **Lines 204, 243**: `percent` is possibly undefined

### 8. `components/jobs/job-card.tsx` - 2 errors

- **Line 237**: `source` property doesn't exist on Job type

### 9. `components/jobs/job-filters.tsx` - 2 errors

- **Line 78**: `animations.chevronUp` and `animations.chevronDown` don't exist

### 10. `components/jobs/job-list.tsx` - 2 errors

- **Line 236**: `source` property doesn't exist on Job type

### 11. `components/landing/features.tsx` - 1 error

- **Line 26**: `animations.save` doesn't exist

### 12. `components/matches/learning-recommendations.tsx` - 2 errors

- **Line 155**: `animations.learning` doesn't exist
- **Line 214**: `animations.arrowRight` doesn't exist

### 13. `components/profile/danger-zone.tsx` - 2 errors

- **Line 68**: `animations.warning` doesn't exist
- **Line 88**: `variant="destructive"` not valid for Button component

### 14. `components/profile/notification-preferences.tsx` - 1 error

- **Line 183**: `animations.bell` doesn't exist

### 15. `components/profile/stats-cards.tsx` - 4 errors

- **Line 19**: `animations.scan` doesn't exist
- **Line 33**: `animations.save` doesn't exist
- **Line 40**: `animations.apply` doesn't exist
- **Line 86**: Type mismatch for ReactNode

### 16. `components/saved/saved-job-card.tsx` - 15 errors

- **Lines 56-175**: Multiple properties don't exist on SavedJob type:
  - `applied`
  - `tags`
  - `createdAt`
  - `appliedAt`
- Multiple implicit `any` types for map parameters

### 17. `lib/hooks/use-saved-jobs.ts` - 1 error

- **Line 3**: `UpdateSavedJobRequest` not exported from api types

---

## Error Categories

### Type Definition Issues (35 errors)

- Missing properties on Resume, Job, SavedJob types
- Missing animation definitions
- Missing exported types

### Type Safety Issues (15 errors)

- Implicit `any` types
- Possibly undefined values
- Type mismatches

### Code Quality Issues (13 errors)

- Unused variables
- setState in useEffect
- require() instead of import
- Wrong variant values

---

## Priority Fixes

### High Priority (Breaking Errors)

1. Fix Resume type - add `scoreBreakdown` property
2. Fix SavedJob type - add `applied`, `tags`, `createdAt`, `appliedAt`
3. Fix Job type - add `source` property
4. Add missing animation definitions
5. Export `UpdateSavedJobRequest` type
6. Fix useResumes hook return type

### Medium Priority (Type Safety)

1. Replace `any` types with proper interfaces
2. Add null checks for possibly undefined values
3. Type map function parameters

### Low Priority (Code Quality)

1. Remove unused variables
2. Fix setState in useEffect pattern
3. Convert require() to import
4. Fix Button variant type
