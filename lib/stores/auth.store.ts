import { create } from 'zustand';
import {
  clearAll,
  getDevice,
  getToken,
  getUser,
  setDevice as persistDevice,
  setToken as persistToken,
  setUser as persistUser,
  type StoredDevice,
  type StoredUser,
} from '@/lib/secure-store';

type AuthState = {
  hydrated: boolean;
  jwt: string | null;
  user: StoredUser | null;
  device: StoredDevice | null;
  hydrate: () => Promise<void>;
  setSession: (jwt: string, user: StoredUser) => Promise<void>;
  setDevice: (device: StoredDevice) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  hydrated: false,
  jwt: null,
  user: null,
  device: null,
  hydrate: async () => {
    const [jwt, user, device] = await Promise.all([
      getToken(),
      getUser(),
      getDevice(),
    ]);
    set({ jwt, user, device, hydrated: true });
  },
  setSession: async (jwt, user) => {
    await Promise.all([persistToken(jwt), persistUser(user)]);
    set({ jwt, user });
  },
  setDevice: async (device) => {
    await persistDevice(device);
    set({ device });
  },
  signOut: async () => {
    await clearAll();
    set({ jwt: null, user: null, device: null });
  },
}));
