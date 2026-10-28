import { apiFetch } from './client';

export const patternsApi = {
  async getPatterns(category, difficulty) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (difficulty && difficulty !== 'all') params.set('difficulty', difficulty);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch(`/api/patterns${query}`);
  },

  async getPatternById(id) {
    return apiFetch(`/api/patterns/${id}`);
  },

  async getProblems(patternId) {
    return apiFetch(`/api/patterns/${patternId}/problems`);
  },

  async getPatternProgress(patternId) {
    return apiFetch(`/api/patterns/${patternId}/progress`);
  },

  async createPattern(payload) {
    return apiFetch('/api/patterns', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async addProblem(patternId, payload) {
    return apiFetch(`/api/patterns/${patternId}/problems`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
