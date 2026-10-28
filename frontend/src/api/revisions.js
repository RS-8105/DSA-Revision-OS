import { apiFetch } from './client';

export const revisionsApi = {
  async recordRevision(patternId, assessment, notes = '') {
    return apiFetch('/api/revisions', {
      method: 'POST',
      body: JSON.stringify({
        patternId,
        assessment: assessment.toUpperCase(),
        notes,
      }),
    });
  },

  async getTodayRevisions() {
    return apiFetch('/api/revisions/today');
  },

  async getOverdueRevisions() {
    return apiFetch('/api/revisions/overdue');
  },

  async getUpcomingRevisions() {
    return apiFetch('/api/revisions/upcoming');
  },

  async getHistory() {
    return apiFetch('/api/revisions/history');
  },

  async getHistoryForPattern(patternId) {
    return apiFetch(`/api/revisions/history/${patternId}`);
  },
};
