// Generic API service layer for frontend

const LOCAL_UPLOAD_URL = 'http://localhost:5000/api';
const VERCEL_URL = 'https://brain-scan-nine.vercel.app/api';

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (e.g. '/auth/login')
 * @param {object} options - fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function apiRequest(endpoint, options = {}) {
  // Use local backend for upload, Vercel for everything else
  const isUpload = endpoint === '/scan/upload';
  const url = `${isUpload ? LOCAL_UPLOAD_URL : VERCEL_URL}${endpoint}`;

  let defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  let fetchOptions = {
    ...options,
    headers: defaultHeaders,
  };
  // If body is FormData, remove Content-Type so browser sets it, and don't stringify
  if (fetchOptions.body instanceof FormData) {
    delete fetchOptions.headers['Content-Type'];
  } else if (fetchOptions.body && typeof fetchOptions.body === 'object') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }
  const response = await fetch(url, fetchOptions);
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  if (!response.ok) {
    const error = new Error((data && data.message) || response.statusText || 'API Error');
    if (data && data.error) error.error = data.error;
    throw error;
  }
  return data;
}
