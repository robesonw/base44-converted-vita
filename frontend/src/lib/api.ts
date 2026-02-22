import { useEffect, useState } from 'react';
import axios from 'axios';

const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const token = getCookie('token');
  const config = {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.get(path, config);
  if (!response.status.toString().startsWith('2')) {
    throw new ApiError(response.data);
  }
  return response.data;
};

const useAuth = () => {
  const [state, setState] = useState({ user: null, loading: true });

  const login = async (email: string, password: string) => {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(response.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setUser(response.user);
  };

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const refreshToken = async () => {
    const response = await apiFetch('/api/auth/refresh');
    setUser(response.user);
  };

  return { ...state, login, register, logout, refreshToken };
};

const useEntityList = (filters?) => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const data = await apiFetch(`/api/entities${filters ? '?' + new URLSearchParams(filters) : ''}`);
        setEntities(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, [filters]);

  return { entities, loading, error };
};

const useEntityCreate = () => {...};
const useEntityUpdate = () => {...};
const useEntityDelete = () => {...};

export { apiFetch, useAuth, useEntityList, useEntityCreate, useEntityUpdate, useEntityDelete };