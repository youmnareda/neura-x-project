import { apiRequest } from './api';

// Fetch all records (scans) for the authenticated user
export async function fetchRecords(token) {
  console.log('fetchRecords called with token:', token ? token.substring(0, 20) + '...' : 'no token');
  const result = await apiRequest('/scan/my-scans', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('fetchRecords result:', result);
  return result;
}

// Delete a specific record (scan) by ID
export async function deleteRecord(id, token) {
  return apiRequest(`/scan/delete/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
