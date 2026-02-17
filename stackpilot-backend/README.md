# StackPilot Backend API Documentation

Please `ctrl+shift+v` to preview this README in VS Code.

## 📋 Table of Contents

- [Current Status](#current-status)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Resume Management](#resume-management)
  - [Jobs & Matching](#jobs--matching)
  - [Saved Jobs](#saved-jobs)
  - [Admin Dashboard](#admin-dashboard)
  - [Email Notifications](#email-notifications)
  - [Usage & Limits](#usage--limits)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Testing the API](#testing-the-api)
- [Next Steps](#next-steps)

---

## ✅ Current Status

| Feature             | Status      | Description                                                           |
| ------------------- | ----------- | --------------------------------------------------------------------- |
| Authentication      | ✅ Complete | JWT-based auth with register/login                                    |
| Resume Upload       | ✅ Complete | PDF parsing and text extraction                                       |
| ATS Scoring         | ✅ Complete | Deterministic scoring algorithm                                       |
| Resume Management   | ✅ Complete | CRUD operations for resumes                                           |
| Job Integration     | ✅ Complete | Adzuna API integration with cron sync                                 |
| Job Search          | ✅ Complete | Filter jobs by country, role, date                                    |
| Job Matching        | ✅ Complete | Match resumes with jobs (60% skill, 25% keyword, 10% exp, 5% recency) |
| Saved Jobs          | ✅ Complete | Save, tag, and track job applications                                 |
| Usage Limits        | ✅ Complete | Free tier tracking (3 scans/day, 5 searches/day)                      |
| Usage Analytics     | ✅ Complete | Track user actions and limits                                         |
| Admin Dashboard     | ✅ Complete | User management, job stats, usage analytics                           |
| Email Notifications | ✅ Complete | Welcome emails, job matches, daily digest, limit warnings             |

---

## 🛠 Technology Stack

- **Framework**: NestJS v10
- **Language**: TypeScript (Strict mode)
- **Database**: PostgreSQL (Supabase)
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **Validation**: class-validator
- **PDF Parsing**: pdf-parse
- **HTTP Client**: @nestjs/axios
- **Email**: Nodemailer with Handlebars templates
- **Scheduled Jobs**: @nestjs/schedule

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+
- npm v9+
- Supabase account (or any PostgreSQL database)
- Adzuna API credentials (free tier)
- Gmail account (for email notifications)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stackpilot-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run start:dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@db.supabase.co:6543/postgres?sslmode=require

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Adzuna API (free tier)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Server
PORT=3000
```

**Note for Gmail**: You need to use an [App Password](https://support.google.com/accounts/answer/185833) not your regular password.

---

## 📡 API Endpoints

### Authentication (`/auth`)

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register new user | No            |
| POST   | `/auth/login`    | Login user        | No            |
| GET    | `/auth/profile`  | Get user profile  | Yes           |

#### Register a new user

```http
POST /auth/register
Content-Type: application/json

{
  "email": "developer@example.com",
  "password": "SecurePass123"
}
```

**Response** (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "developer@example.com",
  "subscriptionType": "free"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "developer@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Resume Management (`/resumes`)

All resume endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | `/resumes/upload`  | Upload PDF resume    |
| GET    | `/resumes`         | Get all user resumes |
| GET    | `/resumes/primary` | Get primary resume   |
| GET    | `/resumes/:id`     | Get specific resume  |
| PATCH  | `/resumes/:id`     | Update resume        |
| DELETE | `/resumes/:id`     | Delete resume        |

#### Upload Resume (PDF)

```http
POST /resumes/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: @/path/to/resume.pdf
setAsPrimary: true (optional)
fileName: MyResume.pdf (optional)
```

**Response** (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "resume.pdf",
  "atsScore": 85,
  "scoreBreakdown": {
    "skillMatch": 90,
    "projectStrength": 75,
    "experienceRelevance": 80,
    "resumeStructure": 95,
    "keywordDensity": 85,
    "actionVerbs": 70,
    "total": 85
  },
  "structuredData": {
    "skills": ["javascript", "react", "node.js"],
    "experience": [...],
    "projects": [...],
    "education": [...]
  },
  "isPrimary": true,
  "version": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Jobs & Matching (`/jobs`)

All job endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint          | Description                       |
| ------ | ----------------- | --------------------------------- |
| GET    | `/jobs`           | Get jobs with filters             |
| GET    | `/jobs/matches`   | Get job matches for user's resume |
| GET    | `/jobs/:id`       | Get specific job details          |
| GET    | `/jobs/:id/match` | Calculate match score for a job   |

#### Get Jobs with Filters

```http
GET /jobs?country=us&role=react&days=7&search=remote
Authorization: Bearer <token>
```

**Query Parameters:**

- `country`: Country code (us, gb, ca, etc.)
- `role`: Job title/keyword
- `days`: Posted within last N days
- `search`: Full-text search

**Response** (200 OK)

```json
{
  "jobs": [
    {
      "id": "uuid",
      "title": "Senior React Developer",
      "company": "Tech Corp",
      "location": "San Francisco",
      "salaryMin": 120000,
      "salaryMax": 160000,
      "postedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 42
}
```

#### Get Job Matches for Resume

```http
GET /jobs/matches?resumeId=uuid&limit=10
Authorization: Bearer <token>
```

**Response** (200 OK)

```json
[
  {
    "jobId": "uuid",
    "score": 85,
    "breakdown": {
      "skillMatch": 90,
      "keywordScore": 80,
      "experienceScore": 85,
      "recencyScore": 100
    },
    "matchedSkills": ["react", "typescript", "node.js"],
    "missingSkills": ["aws", "docker"]
  }
]
```

---

### Saved Jobs (`/jobs/saved`)

All saved jobs endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint                   | Description                                        |
| ------ | -------------------------- | -------------------------------------------------- |
| POST   | `/jobs/saved/:jobId`       | Save a job                                         |
| GET    | `/jobs/saved`              | Get all saved jobs                                 |
| GET    | `/jobs/saved/stats`        | Get saved jobs statistics                          |
| GET    | `/jobs/saved/check/:jobId` | Check if job is saved                              |
| GET    | `/jobs/saved/:id`          | Get specific saved job                             |
| PATCH  | `/jobs/saved/:id`          | Update saved job (notes, tags, application status) |
| DELETE | `/jobs/saved/:id`          | Delete saved job                                   |

#### Save a Job

```http
POST /jobs/saved/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Great company with good benefits",
  "tags": ["remote", "high-priority"]
}
```

**Response** (201 Created)

```json
{
  "message": "Job saved successfully",
  "savedJob": {
    "id": "uuid",
    "userId": "user-uuid",
    "jobId": "job-uuid",
    "notes": "Great company with good benefits",
    "tags": ["remote", "high-priority"],
    "applied": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Saved Jobs with Filters

```http
GET /jobs/saved?applied=true&tags=remote&page=1&limit=10
Authorization: Bearer <token>
```

**Response** (200 OK)

```json
{
  "items": [
    {
      "id": "uuid",
      "job": {
        "title": "Senior React Developer",
        "company": "Tech Corp",
        "location": "Remote"
      },
      "notes": "Great company",
      "tags": ["remote", "high-priority"],
      "applied": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 25
}
```

#### Get Saved Jobs Statistics

```http
GET /jobs/saved/stats
Authorization: Bearer <token>
```

**Response** (200 OK)

```json
{
  "total": 15,
  "applied": 3,
  "pending": 12,
  "topTags": [
    { "tag": "remote", "count": 8 },
    { "tag": "high-priority", "count": 5 }
  ]
}
```

#### Update Saved Job

```http
PATCH /jobs/saved/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
Content-Type: application/json

{
  "applied": true,
  "applicationNotes": "Applied on company website",
  "tags": ["remote", "applied", "interview-scheduled"]
}
```

---

### Admin Dashboard (`/admin`)

All admin endpoints require: `Authorization: Bearer <token>` and admin role

| Method | Endpoint               | Description                         |
| ------ | ---------------------- | ----------------------------------- |
| GET    | `/admin/dashboard`     | Get dashboard statistics            |
| GET    | `/admin/users`         | Get all users (paginated)           |
| GET    | `/admin/users/:userId` | Get user details with usage history |
| GET    | `/admin/usage`         | Get usage statistics                |
| GET    | `/admin/jobs/stats`    | Get job statistics                  |
| POST   | `/admin/jobs/sync`     | Manually trigger job sync           |
| DELETE | `/admin/jobs/old`      | Clean up old jobs                   |

#### Get Dashboard Stats

```http
GET /admin/dashboard
Authorization: Bearer <token>
```

**Response** (200 OK)

```json
{
  "users": {
    "total": 150,
    "activeToday": 42
  },
  "jobs": {
    "total": 12500,
    "addedToday": 350
  },
  "usage": {
    "totalScans": 1250,
    "totalMatches": 5000
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Get Usage Statistics

```http
GET /admin/usage?days=30&action=resume_scan
Authorization: Bearer <token>
```

**Response** (200 OK)

```json
[
  {
    "date": "2024-01-01",
    "count": 45
  },
  {
    "date": "2024-01-02",
    "count": 52
  }
]
```

---

### Email Notifications (Triggered Automatically)

| Event             | Email Type        | Trigger                    |
| ----------------- | ----------------- | -------------------------- |
| User Registration | Welcome Email     | Automatic on register      |
| New Job Matches   | Job Matches Email | After resume upload/update |
| Daily Digest      | Daily Summary     | Cron job (daily)           |
| Near Limit        | Limit Warning     | When usage > 80%           |

---

### Usage & Limits (`/usage`)

All usage endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/usage/summary` | Get current usage and limits |

#### Get Usage Summary

```http
GET /usage/summary
Authorization: Bearer <token>
```

**Response** (200 OK)

```json
{
  "resumeScans": {
    "used": 2,
    "limit": 3
  },
  "jobSearches": {
    "used": 1,
    "limit": 5
  },
  "remaining": {
    "resumeScans": 1,
    "jobSearches": 4
  }
}
```

---

## 📁 Project Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
│
├── auth/                            # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   ├── admin.guard.ts               # Admin role guard
│   ├── user-id.decorator.ts
│   ├── user.decorator.ts
│   └── dto/
│       ├── register.dto.ts
│       └── login.dto.ts
│
├── users/                           # User entity
│   └── user.entity.ts               # Added role field for admin
│
├── resumes/                         # Resume management
│   ├── resume.module.ts
│   ├── controllers/
│   │   └── resume.controller.ts
│   ├── services/
│   │   ├── resume.service.ts
│   │   ├── resume-parser.service.ts
│   │   └── ats-scoring.service.ts
│   ├── entities/
│   │   └── resume.entity.ts
│   └── dto/
│       ├── upload-resume.dto.ts
│       ├── update-resume.dto.ts
│       └── resume-response.dto.ts
│
├── jobs/                            # Job integration
│   ├── jobs.module.ts
│   ├── controllers/
│   │   ├── jobs.controller.ts
│   │   └── saved-jobs.controller.ts  # Saved jobs endpoints
│   ├── services/
│   │   ├── jobs.service.ts
│   │   ├── job-matching.service.ts
│   │   ├── saved-jobs.service.ts      # Saved jobs logic
│   │   ├── adzuna.service.ts
│   │   ├── job-sync.service.ts
│   │   └── http-wrapper.service.ts
│   ├── entities/
│   │   ├── job.entity.ts
│   │   ├── job-match.entity.ts
│   │   └── saved-job.entity.ts        # Saved jobs model
│   └── dto/
│       └── save-job.dto.ts            # Saved job validation
│
├── email/                            # Email notifications
│   ├── email.module.ts
│   ├── email.service.ts
│   └── templates/                    # Handlebars templates
│       ├── welcome.hbs
│       ├── job-matches.hbs
│       ├── daily-digest.hbs
│       └── limit-warning.hbs
│
├── admin/                            # Admin dashboard
│   ├── admin.module.ts
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── interfaces/
│       └── admin-service.interface.ts
│
├── usage/                            # Usage limits & tracking
│   ├── usage.module.ts
│   ├── controllers/
│   │   └── usage.controller.ts
│   ├── services/
│   │   └── usage.service.ts
│   ├── guards/
│   │   └── usage-limit.guard.ts       # Free tier enforcement
│   ├── decorators/
│   │   └── usage-limit.decorator.ts
│   ├── entities/
│   │   └── usage-log.entity.ts
│   └── interfaces/
│       └── usage-service.interface.ts
│
├── config/                          # Configuration
│   └── http.module.ts
│
└── types/                           # Type declarations
    ├── express.d.ts
    ├── multer-file.interface.ts
    └── pdf-parse.d.ts
```

---

## 💾 Database Schema

### Users Table

```sql
- id: UUID (PK)
- email: string (unique)
- password: string (hashed)
- subscription_type: string (default: 'free')
- role: string (default: 'user')      # 'admin' for admin users
- daily_resume_scans: integer (default: 0)
- last_scan_reset: date
- created_at: timestamp
- updated_at: timestamp
```

### Resumes Table

```sql
- id: UUID (PK)
- user_id: UUID (FK)
- file_name: string
- file_size: integer
- mime_type: string
- raw_text: text
- structured_data: jsonb
- ats_score: integer
- score_breakdown: jsonb
- is_primary: boolean
- version: integer
- created_at: timestamp
- updated_at: timestamp
```

### Jobs Table

```sql
- id: UUID (PK)
- title: string
- company: string
- description: text
- required_skills: jsonb
- location: string
- country: string
- salary_min: integer
- salary_max: integer
- salary_currency: string
- job_type: string
- source: string
- source_id: string
- job_url: string
- posted_at: timestamp
- created_at: timestamp
- updated_at: timestamp
```

### Job Matches Table

```sql
- id: UUID (PK)
- user_id: UUID (FK)
- job_id: UUID (FK)
- score: float
- score_breakdown: jsonb
- matched_skills: jsonb
- missing_skills: jsonb
- viewed: boolean (default: false)
- saved: boolean (default: false)
- applied: boolean (default: false)
- created_at: timestamp
```

### Saved Jobs Table

```sql
- id: UUID (PK)
- user_id: UUID (FK)
- job_id: UUID (FK)
- notes: text
- tags: text[]                        # Array of tags
- applied: boolean (default: false)
- applied_at: timestamp
- application_notes: text
- created_at: timestamp
- updated_at: timestamp
- UNIQUE(user_id, job_id)              # Prevent duplicates
```

### Usage Logs Table

```sql
- id: UUID (PK)
- user_id: UUID (FK)
- action: enum (resume_scan, job_search, job_view, job_save, match_view)
- metadata: jsonb
- created_at: timestamp
```

---

## 📊 Job Matching Algorithm

The matching score is calculated with these weights:

| Component            | Weight | Description                                     |
| -------------------- | ------ | ----------------------------------------------- |
| Skill Match          | 60%    | Direct skill matching with bonus for all skills |
| Keyword Score        | 25%    | Keyword overlap with job description            |
| Experience Relevance | 10%    | Title and description relevance                 |
| Recency Score        | 5%     | Newer jobs score higher                         |

### Scoring Logic

- **Skill Match**: (matched skills / total required skills) \* 100 + 20% bonus for perfect match
- **Keyword Score**: Unique keyword overlap between resume and job description
- **Experience**: Title matching + description keyword relevance
- **Recency**: 100% (<7d), 80% (<14d), 60% (<30d), 40% (<60d), 20% (older)

---

## 🚦 Free Tier Limits

| Action       | Free Tier Limit |
| ------------ | --------------- |
| Resume Scans | 3 per day       |
| Job Searches | 5 per day       |
| Saved Jobs   | 10 total        |
| Job Matches  | Unlimited       |

---

## 🧪 Testing the API

### Using Postman

1. **Import the collection** or use the endpoints above
2. **Create environment variables**:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (will be set after login)

3. **Test Flow**:

   ```bash
   # 1. Register
   POST {{baseUrl}}/auth/register

   # 2. Login (copy token)
   POST {{baseUrl}}/auth/login

   # 3. Set token in environment
   # 4. Upload resume
   POST {{baseUrl}}/resumes/upload

   # 5. Get job matches
   GET {{baseUrl}}/jobs/matches

   # 6. Save a job
   POST {{baseUrl}}/jobs/saved/{jobId}

   # 7. Check usage
   GET {{baseUrl}}/usage/summary
   ```

### Creating an Admin User

```sql
-- Run this in your database to make a user admin
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## 📅 Next Steps

### Phase 1: Production Ready

- [x] Authentication & Authorization
- [x] Resume Upload & Parsing
- [x] ATS Scoring
- [x] Job Integration (Adzuna)
- [x] Job Matching Algorithm
- [x] Usage Limits & Tracking
- [x] Saved Jobs
- [x] Email Notifications
- [x] Admin Dashboard
- [ ] Unit Tests (Jest)
- [ ] E2E Tests
- [ ] API Documentation (Swagger)

### Phase 2: Frontend Development

- [ ] Next.js setup with TypeScript
- [ ] Authentication pages
- [ ] Resume upload UI with drag & drop
- [ ] Job explorer with filters
- [ ] Dashboard with analytics charts
- [ ] Saved jobs management UI

### Phase 3: Production Deployment

- [ ] CI/CD with GitHub Actions
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Custom domain setup
- [ ] Monitoring with Sentry
- [ ] Analytics with PostHog

### Phase 4: Monetization

- [ ] Subscription tiers (Pro, Enterprise)
- [ ] Payment integration (Stripe)
- [ ] Advanced analytics
- [ ] Team accounts

---

## 🎯 Quick Start Commands

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Supabase Documentation](https://supabase.com/docs)
- [Adzuna API Docs](https://developer.adzuna.com)
- [Nodemailer Docs](https://nodemailer.com/about)

---

**StackPilot** - Career Intelligence for Modern Developers 🚀
