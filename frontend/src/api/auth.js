import { apiFetch, setStoredToken, setStoredUser, getStoredUser, getStoredToken } from './client';

export const authApi = {
  async login(email, password) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  async register(name, email, password) {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  async getCurrentUser() {
    return apiFetch('/api/auth/me');
  },

  logout() {
    setStoredToken(null);
    setStoredUser(null);
  },

  isAuthenticated() {
    return !!getStoredToken();
  },

  getCachedUser() {
    return getStoredUser();
  },
};
