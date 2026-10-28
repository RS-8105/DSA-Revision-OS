import { apiFetch } from './client';

export const dashboardApi = {
  async getDashboard() {
    return apiFetch('/api/dashboard');
  },

  async getProgressSummary() {
    return apiFetch('/api/progress');
  },

  async getWeakAreas(limit = 5) {
    return apiFetch(`/api/progress/weak-areas?limit=${limit}`);
  },

  async getAllProgress() {
    return apiFetch('/api/progress/details');
  },
};
