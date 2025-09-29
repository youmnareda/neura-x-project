// Auth API service

import { apiRequest } from './api';

export async function login({ email, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(signupData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: signupData,
  });
}

export async function verifyEmail({ email, code }) {
  return apiRequest('/auth/verify-code', {
    method: 'POST',
    body: { email, code },
  });
}

export async function getProfile(token) {
  return apiRequest('/profile/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateProfile(token, data) {
  let options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (data instanceof FormData) {
    options.body = data;
    // Let browser set Content-Type for FormData
  } else {
    options.headers['Content-Type'] = 'application/json';
    options.body = data;
  }
  return apiRequest('/profile/change-name', options);
}

export async function updateGender(token, gender) {
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found');
  }
  
  return apiRequest(`/admin/users/gender/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: { gender },
  });
}

export async function updateBirthDate(token, birthDate) {
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found');
  }
  
  return apiRequest(`/admin/users/birth-date/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: { birthDate },
  });
}

export async function changeName(token, data) {
  return apiRequest('/profile/change-name', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: data,
  });
}

export async function changePassword(token, data) {
  return apiRequest('/profile/change-password', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: data,
  });
}

export async function changeEmail(token, data) {
  return apiRequest('/profile/change-email', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: data,
  });
}

export async function deleteAccount(token) {
  return apiRequest('/profile/delete-account', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function logout(token) {
  return apiRequest('/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
