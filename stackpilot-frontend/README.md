# StackPilot Frontend Documentation

Please `ctrl+shift+v` to preview this README in VS Code.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Routing & Pages](#routing--pages)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling & Theming](#styling--theming)
- [Development Guide](#development-guide)
- [Build & Deployment](#build--deployment)
- [Testing](#testing)

---

## 🎯 Overview

StackPilot Frontend is a modern, responsive web application built with Next.js 15 and React 19. It provides an intuitive interface for developers to upload resumes, get ATS scores, discover job matches, and manage their job search process.

### Key Highlights

- ⚡ **Next.js 15** with App Router for optimal performance
- 🎨 **Tailwind CSS v4** for modern, utility-first styling
- 📊 **Recharts** for beautiful data visualizations
- 🔐 **JWT Authentication** with secure token management
- 📱 **Fully Responsive** design for all devices
- ♿ **Accessible** components following WCAG guidelines
- 🎭 **Animated UI** with Lordicon integration
- 🌙 **Dark Mode** support (ready for implementation)

---

## 🛠 Technology Stack

### Core Framework

- **Next.js**: 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x (Strict mode)

### UI & Styling

- **Tailwind CSS**: v4 (Latest)
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Lordicon**: Animated icons
- **class-variance-authority**: Component variants
- **tailwind-merge**: Utility class merging
- **clsx**: Conditional class names

### Data Management

- **TanStack Query**: v5.90.21 (React Query)
- **Zustand**: v5.0.11 (Lightweight state management)
- **Axios**: HTTP client

### Forms & Validation

- **React Hook Form**: v7.71.1
- **Zod**: v4.3.6 (Schema validation)
- **@hookform/resolvers**: Form validation integration

### Data Visualization

- **Recharts**: v3.7.0 (Charts and graphs)

### Utilities

- **date-fns**: v4.1.0 (Date manipulation)
- **react-dropzone**: v15.0.0 (File uploads)
- **react-intersection-observer**: v10.0.2 (Lazy loading)

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+
- npm v9+
- Backend API running (see backend README)

### Installation

```bash
# Navigate to frontend directory
cd stackpilot-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

---

## 📁 Project Structure

```
stackpilot-frontend/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Authentication routes (grouped)
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   └── register/
│   │       └── page.tsx              # Registration page
│   │
│   ├── (dashboard)/                  # Protected dashboard routes
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── jobs/
│   │   │   ├── page.tsx              # Job listings
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Job details
│   │   ├── matches/
│   │   │   └── page.tsx              # Job matches
│   │   ├── resumes/
│   │   │   ├── page.tsx              # Resume list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Resume details
│   │   │   └── upload/
│   │   │       └── page.tsx          # Resume upload
│   │   ├── profile/
│   │   │   └── page.tsx              # User profile
│   │   └── settings/
│   │       └── page.tsx              # User settings
│   │
│   ├── admin/                        # Admin panel (role-protected)
│   │   ├── layout.tsx                # Admin layout
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── users/
│   │   │   └── page.tsx              # User management
│   │   ├── jobs/
│   │   │   └── page.tsx              # Job management
│   │   └── analytics/
│   │       └── page.tsx              # Analytics dashboard
│   │
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
│
├── components/                       # Reusable components
│   ├── ui/                           # Base UI components (Shadcn-style)
│   │   ├── button.tsx                # Button component
│   │   ├── card.tsx                  # Card component
│   │   ├── input.tsx                 # Input component
│   │   ├── select.tsx                # Select dropdown
│   │   ├── dialog.tsx                # Modal dialog
│   │   ├── tabs.tsx                  # Tabs component
│   │   ├── badge.tsx                 # Badge component
│   │   ├── progress.tsx              # Progress bar
│   │   ├── checkbox.tsx              # Checkbox
│   │   ├── switch.tsx                # Toggle switch
│   │   ├── slider.tsx                # Range slider
│   │   ├── separator.tsx             # Divider
│   │   ├── label.tsx                 # Form label
│   │   ├── avatar.tsx                # User avatar
│   │   ├── sheet.tsx                 # Side sheet
│   │   ├── table.tsx                 # Data table
│   │   ├── alert-dialog.tsx          # Confirmation dialog
│   │   └── use-toast.tsx             # Toast notifications
│   │
│   ├── layout/                       # Layout components
│   │   ├── header.tsx                # Dashboard header
│   │   └── sidebar.tsx               # Dashboard sidebar
│   │
│   ├── landing/                      # Landing page components
│   │   ├── header.tsx                # Landing header
│   │   ├── hero.tsx                  # Hero section
│   │   ├── features.tsx              # Features section
│   │   └── footer.tsx                # Footer
│   │
│   ├── jobs/                         # Job-related components
│   │   ├── job-card.tsx              # Job listing card
│   │   ├── job-list.tsx              # Job list view
│   │   └── job-filters.tsx           # Job filter sidebar
│   │
│   ├── matches/                      # Match-related components
│   │   ├── match-card.tsx            # Match result card
│   │   ├── match-filters.tsx         # Match filters
│   │   ├── match-stats.tsx           # Match statistics
│   │   └── learning-recommendations.tsx  # Skill recommendations
│   │
│   ├── resumes/                      # Resume components
│   │   └── resume-uploader.tsx       # Drag & drop uploader
│   │
│   ├── profile/                      # Profile components
│   │   ├── stats-cards.tsx           # Profile statistics
│   │   ├── activity-chart.tsx        # Activity visualization
│   │   ├── change-password-form.tsx  # Password change
│   │   ├── notification-preferences.tsx  # Notification settings
│   │   └── danger-zone.tsx           # Account deletion
│   │
│   ├── saved/                        # Saved jobs components
│   │   └── saved-job-card.tsx        # Saved job card
│   │
│   ├── shared/                       # Shared components
│   │   ├── lordicon-wrapper.tsx      # Animated icon wrapper
│   │   └── logo.tsx                  # App logo
│   │
│   └── providers/                    # Context providers
│       ├── query-provider.tsx        # React Query provider
│       └── theme-provider.tsx        # Theme provider
│
├── lib/                              # Utilities and configurations
│   ├── api/
│   │   └── client.ts                 # Axios instance with interceptors
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-auth.ts               # Authentication hook
│   │   ├── use-resumes.ts            # Resume operations
│   │   ├── use-jobs.ts               # Job operations
│   │   ├── use-matches.ts            # Match operations
│   │   ├── use-saved-jobs.ts         # Saved jobs operations
│   │   ├── use-profile.ts            # Profile operations
│   │   ├── use-admin.ts              # Admin operations
│   │   └── use-debounce.ts           # Debounce utility
│   │
│   ├── store/                        # Zustand stores
│   │   ├── auth-store.ts             # Auth state
│   │   ├── job-filters-store.ts      # Job filter state
│   │   └── matches-store.ts          # Match filter state
│   │
│   ├── types/
│   │   └── api.ts                    # TypeScript interfaces
│   │
│   └── utils.ts                      # Utility functions (cn, etc.)
│
├── public/                           # Static assets
│   ├── images/
│   │   └── stackpilot_logo.svg       # App logo
│   └── icons/
│       └── lordicon/                 # Animated icons
│           └── index.ts              # Icon exports
│
├── tailwind.config.js                # Tailwind configuration
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.mjs                 # ESLint configuration
├── postcss.config.mjs                # PostCSS configuration
└── package.json                      # Dependencies
```

---

## ✨ Key Features

### 1. Authentication System

- **JWT-based authentication** with secure token storage
- **Protected routes** with automatic redirects
- **Role-based access control** (User/Admin)
- **Persistent sessions** across page reloads

**Files:**

- `lib/hooks/use-auth.ts` - Authentication logic
- `lib/api/client.ts` - Token interceptors
- `app/(auth)/` - Auth pages

### 2. Resume Management

- **Drag & drop PDF upload** with react-dropzone
- **Real-time ATS scoring** with visual breakdown
- **Multiple resume versions** support
- **Primary resume selection**
- **Structured data extraction** display

**Files:**

- `app/(dashboard)/resumes/` - Resume pages
- `components/resumes/resume-uploader.tsx` - Upload UI
- `lib/hooks/use-resumes.ts` - Resume operations

### 3. Job Discovery

- **Advanced filtering** (country, role, date, salary)
- **Real-time search** with debouncing
- **Pagination** support
- **Job details** with company info
- **External application** links

**Files:**

- `app/(dashboard)/jobs/` - Job pages
- `components/jobs/` - Job components
- `lib/hooks/use-jobs.ts` - Job operations

### 4. Intelligent Matching

- **AI-powered job matching** algorithm
- **Skill gap analysis** with recommendations
- **Match score breakdown** visualization
- **Filter by match score** range
- **Learning recommendations** for missing skills

**Files:**

- `app/(dashboard)/matches/` - Match pages
- `components/matches/` - Match components
- `lib/hooks/use-matches.ts` - Match operations

### 5. Saved Jobs Tracker

- **Save jobs** for later review
- **Add notes** and tags
- **Track application status**
- **Filter saved jobs** by status/tags
- **Statistics dashboard**

**Files:**

- `components/saved/saved-job-card.tsx` - Saved job UI
- `lib/hooks/use-saved-jobs.ts` - Saved job operations

### 6. User Dashboard

- **Activity statistics** with charts
- **Usage tracking** (scans, searches)
- **Profile management**
- **Notification preferences**
- **Account settings**

**Files:**

- `app/(dashboard)/page.tsx` - Dashboard home
- `app/(dashboard)/profile/` - Profile pages
- `components/profile/` - Profile components

### 7. Admin Panel

- **User management** with role assignment
- **Job statistics** and analytics
- **Usage monitoring** across users
- **Manual job sync** trigger
- **System health** dashboard

**Files:**

- `app/admin/` - Admin pages
- `lib/hooks/use-admin.ts` - Admin operations

---

## 🗺️ Routing & Pages

### Public Routes

| Route       | File                           | Description       |
| ----------- | ------------------------------ | ----------------- |
| `/`         | `app/page.tsx`                 | Landing page      |
| `/login`    | `app/(auth)/login/page.tsx`    | Login page        |
| `/register` | `app/(auth)/register/page.tsx` | Registration page |

### Protected Routes (Requires Authentication)

| Route             | File                                      | Description    |
| ----------------- | ----------------------------------------- | -------------- |
| `/dashboard`      | `app/(dashboard)/page.tsx`                | User dashboard |
| `/jobs`           | `app/(dashboard)/jobs/page.tsx`           | Job listings   |
| `/jobs/:id`       | `app/(dashboard)/jobs/[id]/page.tsx`      | Job details    |
| `/matches`        | `app/(dashboard)/matches/page.tsx`        | Job matches    |
| `/resumes`        | `app/(dashboard)/resumes/page.tsx`        | Resume list    |
| `/resumes/:id`    | `app/(dashboard)/resumes/[id]/page.tsx`   | Resume details |
| `/resumes/upload` | `app/(dashboard)/resumes/upload/page.tsx` | Upload resume  |
| `/profile`        | `app/(dashboard)/profile/page.tsx`        | User profile   |
| `/settings`       | `app/(dashboard)/settings/page.tsx`       | User settings  |

### Admin Routes (Requires Admin Role)

| Route              | File                           | Description     |
| ------------------ | ------------------------------ | --------------- |
| `/admin`           | `app/admin/page.tsx`           | Admin dashboard |
| `/admin/users`     | `app/admin/users/page.tsx`     | User management |
| `/admin/jobs`      | `app/admin/jobs/page.tsx`      | Job management  |
| `/admin/analytics` | `app/admin/analytics/page.tsx` | Analytics       |

---

## 🧩 Component Architecture

### UI Components (Shadcn-style)

All UI components follow a consistent pattern:

```typescript
// Example: Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
```

**Key Features:**

- TypeScript with proper typing
- Forwarded refs for accessibility
- Variant-based styling with CVA
- Composable with `cn()` utility
- Accessible by default

### Custom Hooks Pattern

```typescript
// Example: useResumes hook
export function useResumes() {
  const query = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const response = await apiClient.get<Resume[]>("/resumes");
      return response.data;
    },
  });

  const resumes = query.data || [];
  const primaryResume = resumes.find((r) => r.isPrimary) || null;

  return {
    ...query,
    resumes,
    primaryResume,
  };
}
```

**Benefits:**

- Encapsulated API logic
- Automatic caching with React Query
- Type-safe responses
- Reusable across components

---

## 🔄 State Management

### 1. React Query (TanStack Query)

Used for **server state** management:

```typescript
// Queries (GET requests)
const { data, isLoading, error } = useQuery({
  queryKey: ["jobs"],
  queryFn: fetchJobs,
});

// Mutations (POST/PUT/DELETE)
const mutation = useMutation({
  mutationFn: createResume,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["resumes"] });
  },
});
```

**Configuration:** `components/providers/query-provider.tsx`

### 2. Zustand

Used for **client state** management:

```typescript
// Example: Job filters store
export const useJobFiltersStore = create<JobFiltersState>((set) => ({
  filters: {
    country: "us",
    role: "",
    days: 30,
  },
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
```

**Stores:**

- `lib/store/auth-store.ts` - Authentication state
- `lib/store/job-filters-store.ts` - Job filter preferences
- `lib/store/matches-store.ts` - Match filter preferences

### 3. React Context

Used for **theme** and **global providers**:

```typescript
// Theme provider
<ThemeProvider attribute="class" defaultTheme="light">
  {children}
</ThemeProvider>
```

---

## 🌐 API Integration

### Axios Client Configuration

**File:** `lib/api/client.ts`

```typescript
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

### API Hooks

All API operations are wrapped in custom hooks:

```typescript
// lib/hooks/use-jobs.ts
export function useJobs(filters: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const response = await apiClient.get("/jobs", { params: filters });
      return response.data;
    },
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiClient.post(`/jobs/saved/${jobId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });
}
```

---

## 🎨 Styling & Theming

### Tailwind CSS v4

**Configuration:** `tailwind.config.js`

```javascript
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1929",
          light: "#1E2F47",
          dark: "#051220",
        },
        orange: {
          DEFAULT: "#FF6B35",
          light: "#FF8B5C",
          dark: "#E54C1E",
        },
      },
    },
  },
};
```

### Global Styles

**File:** `app/globals.css`

```css
@import "tailwindcss";

@layer base {
  :root {
    --color-navy: #0a1929;
    --color-orange: #ff6b35;
    /* ... more custom properties */
  }
}

@layer components {
  .shimmer {
    /* Custom loading animation */
  }

  .glass {
    /* Glass morphism effect */
  }

  .gradient-text {
    /* Gradient text effect */
  }
}
```

### Component Styling Pattern

```typescript
// Using cn() utility for conditional classes
<div className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  isActive && "active-classes",
  className // Allow override
)} />
```

---

## 💻 Development Guide

### Running the Development Server

```bash
npm run dev
```

Access at: `http://localhost:3000`

### Code Quality Tools

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Format code (if configured)
npm run format
```

### Adding a New Page

1. Create page file in `app/` directory:

```typescript
// app/(dashboard)/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

2. Add to navigation (if needed):

```typescript
// components/layout/sidebar.tsx
const navItems = [
  // ... existing items
  { href: "/new-page", label: "New Page", icon: "..." },
];
```

### Adding a New Component

1. Create component file:

```typescript
// components/feature/new-component.tsx
interface NewComponentProps {
  // props
}

export function NewComponent({ ...props }: NewComponentProps) {
  return <div>Component</div>;
}
```

2. Export from index (if creating a component library):

```typescript
// components/feature/index.ts
export { NewComponent } from "./new-component";
```

### Adding a New API Hook

```typescript
// lib/hooks/use-feature.ts
export function useFeature() {
  return useQuery({
    queryKey: ["feature"],
    queryFn: async () => {
      const response = await apiClient.get("/feature");
      return response.data;
    },
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FeatureData) => {
      const response = await apiClient.post("/feature", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature"] });
    },
  });
}
```

---

## 🏗️ Build & Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.stackpilot.com
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

#### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing

### Unit Tests (To be implemented)

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### E2E Tests (To be implemented)

```bash
# Run Playwright tests
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Authentication flow (login/register/logout)
- [ ] Resume upload and parsing
- [ ] Job search and filtering
- [ ] Job matching algorithm
- [ ] Saved jobs functionality
- [ ] Profile management
- [ ] Admin panel (if admin user)
- [ ] Responsive design on mobile
- [ ] Dark mode toggle (if enabled)

---

## 📚 Key Files Reference

### Configuration Files

| File                 | Purpose                    |
| -------------------- | -------------------------- |
| `next.config.ts`     | Next.js configuration      |
| `tailwind.config.js` | Tailwind CSS configuration |
| `tsconfig.json`      | TypeScript configuration   |
| `eslint.config.mjs`  | ESLint rules               |
| `postcss.config.mjs` | PostCSS plugins            |

### Core Application Files

| File                         | Purpose                          |
| ---------------------------- | -------------------------------- |
| `app/layout.tsx`             | Root layout with providers       |
| `app/page.tsx`               | Landing page                     |
| `app/(dashboard)/layout.tsx` | Dashboard layout with auth       |
| `lib/api/client.ts`          | Axios instance with interceptors |
| `lib/hooks/use-auth.ts`      | Authentication logic             |
| `lib/types/api.ts`           | TypeScript interfaces            |
| `lib/utils.ts`               | Utility functions                |

---

## 🎯 Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Using Next.js `<Image>` component
3. **Lazy Loading**: Components loaded on demand
4. **React Query Caching**: Reduces API calls
5. **Debounced Search**: Prevents excessive API requests
6. **Memoization**: Using `useMemo` and `useCallback` where needed

---

## 🔒 Security Best Practices

1. **JWT Token Storage**: Stored in localStorage with httpOnly consideration
2. **CSRF Protection**: Implemented via backend
3. **XSS Prevention**: React's built-in escaping
4. **Input Validation**: Zod schemas for all forms
5. **Role-Based Access**: Protected routes and components
6. **Secure API Calls**: HTTPS in production

---

## 🚀 Quick Start Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npx tsc --noEmit         # Type check

# Useful during development
npm run dev -- --turbo   # Use Turbopack (faster)
```

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Radix UI](https://www.radix-ui.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**StackPilot Frontend** - Modern UI for Career Intelligence 🎨
