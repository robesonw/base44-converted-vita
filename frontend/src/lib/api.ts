import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const apiFetch = async (path: string, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  return await apiClient.get(path, { ...options, headers });
};

export const useAuth = () => {
  const login = async (credentials) => {
    const response = await apiFetch('/auth/login', { method: 'POST', data: credentials });
    localStorage.setItem('token', response.data.token);
  };
  const logout = () => {
    localStorage.removeItem('token');
  };
  const me = async () => {
    return await apiFetch('/auth/me');
  };
  return { login, logout, me };
};