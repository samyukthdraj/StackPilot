# 🎯 Page Modularization Prompt

Use this prompt to modularize any page in your codebase:

---

## Prompt Template

```
I want to modularize the [PAGE_NAME] page by splitting it into reusable section components.

Requirements:
1. Analyze the current [PAGE_PATH] file and identify all major sections
2. Create separate component files for each section in the appropriate folder (e.g., components/[feature-name]/)
3. Each section component should:
   - Be a client component ("use client") if it has interactivity
   - Have proper TypeScript interfaces for props
   - Accept callback functions as props for any actions (onClick handlers, etc.)
   - Be self-contained with its own data/constants when possible
   - Follow the existing design system and styling patterns
4. Update the main page file to:
   - Import all the new section components
   - Replace the inline sections with component calls
   - Pass necessary props (callbacks, data) to each section
   - Keep only the page-level logic (state management, data fetching, etc.)
5. Ensure:
   - Zero TypeScript errors
   - Zero ESLint warnings
   - All functionality remains the same
   - Clean, readable code structure
   - Proper component naming (e.g., HeroSection, StatsSection, etc.)

Folder structure should be:
components/[feature-name]/
├── section-1.tsx
├── section-2.tsx
├── section-3.tsx
└── ...

Main page should look like:
import { Section1 } from "@/components/[feature-name]/section-1";
import { Section2 } from "@/components/[feature-name]/section-2";

export default function Page() {
  // Page-level logic here

  return (
    <div>
      <Section1 prop1={...} onAction={...} />
      <Section2 prop2={...} />
      ...
    </div>
  );
}
```

---

## Example Usage

### For Dashboard Page:

```
I want to modularize the dashboard page by splitting it into reusable section components.

Requirements:
[Use the template above, replacing [PAGE_NAME] with "dashboard" and [PAGE_PATH] with "app/(dashboard)/page.tsx"]

Folder structure should be:
components/dashboard/
├── stats-overview.tsx
├── recent-activity.tsx
├── quick-actions.tsx
└── ...
```

### For Settings Page:

```
I want to modularize the settings page by splitting it into reusable section components.

Requirements:
[Use the template above, replacing [PAGE_NAME] with "settings" and [PAGE_PATH] with "app/(dashboard)/settings/page.tsx"]

Folder structure should be:
components/settings/
├── profile-section.tsx
├── preferences-section.tsx
├── security-section.tsx
└── ...
```

### For Job Listing Page:

```
I want to modularize the jobs page by splitting it into reusable section components.

Requirements:
[Use the template above, replacing [PAGE_NAME] with "jobs" and [PAGE_PATH] with "app/(dashboard)/jobs/page.tsx"]

Folder structure should be:
components/jobs/
├── filters-section.tsx
├── job-list-section.tsx
├── pagination-section.tsx
└── ...
```

---

## Quick Reference

### Component Naming Convention

- Use descriptive names ending with "Section" or describing the component's purpose
- Examples: `HeroSection`, `StatsCards`, `FilterBar`, `JobList`

### Props Pattern

```tsx
interface SectionProps {
  // Data props
  data?: SomeType;

  // Callback props (for actions)
  onAction?: () => void;
  onSubmit?: (data: FormData) => void;

  // Optional styling
  className?: string;
}

export function Section({ data, onAction, className }: SectionProps) {
  return <section className={className}>...</section>;
}
```

### Import Pattern in Main Page

```tsx
// Group imports by feature
import { Section1, Section2 } from "@/components/feature-name/...";

// Or individual imports
import { Section1 } from "@/components/feature-name/section-1";
import { Section2 } from "@/components/feature-name/section-2";
```

---

## Benefits of This Approach

✅ **Maintainability**: Each section is isolated and easy to update
✅ **Reusability**: Sections can be used in multiple pages
✅ **Testability**: Test components independently
✅ **Readability**: Main page file is clean and focused
✅ **Scalability**: Easy to add/remove/reorder sections
✅ **Collaboration**: Multiple developers can work on different sections

---

## Checklist After Modularization

- [ ] All sections extracted to separate files
- [ ] Main page imports all section components
- [ ] All props properly typed with TypeScript interfaces
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] All functionality works the same as before
- [ ] Components follow naming conventions
- [ ] Clean folder structure
- [ ] No duplicate code
- [ ] Proper "use client" directives where needed

---

## Copy-Paste Ready Prompt

```
I want to modularize the [PAGE_NAME] page (located at [PAGE_PATH]) by splitting it into reusable section components.

Please:
1. Analyze the page and identify all major sections
2. Create separate component files in components/[feature-name]/ for each section
3. Each component should have proper TypeScript interfaces and accept callbacks as props
4. Update the main page to import and use these components
5. Ensure zero TypeScript/ESLint errors and maintain all functionality

The main page should be clean with just imports and component calls, while all section logic lives in the individual component files.
```

---

## Notes

- Always backup the original file before modularizing
- Test thoroughly after modularization
- Consider creating a components/[feature]/index.ts for cleaner imports
- Keep related components together in the same folder
- Use consistent naming across your application
