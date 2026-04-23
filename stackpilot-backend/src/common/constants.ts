export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  GITHUB = 'github',
  MICROSOFT = 'microsoft',
}

export const SYSTEM_LIMITS = {
  FREE_TIER_SAVED_JOBS: 10,
  DAILY_RESUME_SCANS: 2,
};

export const DEFAULT_URLS = {
  FRONTEND_URL: 'http://localhost:3000',
  SUPPORT_EMAIL: 'edusmart500@gmail.com',
};
