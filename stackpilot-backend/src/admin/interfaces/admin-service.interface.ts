export interface IAdminService {
  getDashboardStats(): Promise<any>;
  getUsers(options: { page: number; limit: number }): Promise<any>;
  getUserDetails(userId: string): Promise<any>;
  getUsageStats(options: { days: number; action?: string }): Promise<any>;
  getJobStats(): Promise<any>;
  forceJobSync(): Promise<{ message: string }>;
  cleanupJobs(days: number): Promise<{ message: string }>;
}
