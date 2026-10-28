/**
 * Centralized API client for communicating with the Spring Boot backend.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');

const TOKEN_KEY = 'dsa_revision_auth_token';
const USER_KEY = 'dsa_revision_auth_user';

export class ApiException extends Error {
  constructor(apiError) {
    super(apiError.message || 'API request failed');
    this.name = 'ApiException';
    this.status = apiError.status;
    this.error = apiError.error || 'Error';
    this.validationErrors = apiError.validationErrors;
  }
}

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new ApiException({
      status: 0,
      error: 'NetworkError',
      message: err?.message || 'Unable to connect to backend server. Is Spring Boot running on ' + API_BASE_URL + '?',
    });
  }

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/api/auth/login') && !endpoint.includes('/api/auth/register')) {
      // Dispatch event so UI can prompt login if token expired
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        status: response.status,
        error: response.statusText,
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    throw new ApiException(errorData);
  }

  // Handle empty bodies (204 No Content, etc.)
  if (response.status === 204) {
    return {};
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
}
