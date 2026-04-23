import { User } from '../types/api';

const TOKEN_KEY = 'access_token';
const LEGACY_TOKEN_KEY = 'token';
const USER_KEY = 'user';
const TIMESTAMP_KEY = 'login_timestamp';

export const authUtil = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_KEY, token); // Keep legacy for backward compatibility
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  },

  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  isAuthenticated: (): boolean => {
    const token = authUtil.getToken();
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);
    if (!token || !timestamp) return false;

    const loginTime = parseInt(timestamp, 10);
    const SESSION_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours
    return Date.now() - loginTime <= SESSION_TIMEOUT;
  },
};
