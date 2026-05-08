import axios, { AxiosError } from 'axios';
import { getToken, clearToken } from '@/lib/secure-store';
import type { ApiError } from '@/lib/api/types';

const baseURL = 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  timeout: 10_000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<{ message?: string }>) => {
    if (err.response?.status === 401) {
      await clearToken();
    }
    const apiError: ApiError = {
      status: err.response?.status,
      message: err.response?.data?.message ?? err.message,
    };
    return Promise.reject(apiError);
  }
);
