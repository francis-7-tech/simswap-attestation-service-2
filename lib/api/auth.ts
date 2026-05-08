import { api } from '@/lib/api/client';
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from '@/lib/api/types';

export const signup = (body: SignupRequest) =>
  api.post<AuthResponse>('/api/v1/auth/signup', body).then((r) => r.data);

export const login = (body: LoginRequest) =>
  api.post<AuthResponse>('/api/v1/auth/login', body).then((r) => r.data);
