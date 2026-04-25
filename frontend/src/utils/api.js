export const API_URL = 'http://localhost:5001/api';

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ecoToken');

  // 1. Check before API call to ensure token exists
  if (!token) {
    console.warn('[AUTH DEBUG] Missing token before API call. Redirecting to login.');
    window.location.href = '/login';
    return null;
  }

  // 2. Automatically attach token in Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  // 3. Handle expired or invalid token gracefully
  if (res.status === 401 || res.status === 403) {
    console.error(`[AUTH DEBUG] Server rejected token (Status: ${res.status}). Triggering logout.`);
    localStorage.removeItem('ecoToken');
    localStorage.removeItem('ecoUser');
    window.location.href = '/login';
    return null;
  }

  return res;
};
