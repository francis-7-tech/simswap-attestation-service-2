import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const KEYS = {
  jwt: 'cipher.jwt',
  device: 'cipher.device',
  user: 'cipher.user',
  onboarded: 'cipher.onboarded',
  deviceUuid: 'cipher.deviceUuid',
} as const;

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.jwt);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.jwt, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.jwt);
}

export type StoredDevice = { deviceUuid: string; publicKeyBase64: string };

export async function getDevice(): Promise<StoredDevice | null> {
  const raw = await SecureStore.getItemAsync(KEYS.device);
  return raw ? (JSON.parse(raw) as StoredDevice) : null;
}

export async function setDevice(device: StoredDevice): Promise<void> {
  await SecureStore.setItemAsync(KEYS.device, JSON.stringify(device));
}

export async function clearDevice(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.device);
}

export async function getOrCreateDeviceUuid(): Promise<string> {
  const existing = await SecureStore.getItemAsync(KEYS.deviceUuid);
  if (existing) return existing;
  const fresh = Crypto.randomUUID().toLowerCase();
  await SecureStore.setItemAsync(KEYS.deviceUuid, fresh);
  return fresh;
}

export type StoredUser = { userId: string; email: string; fullName: string };

export async function getUser(): Promise<StoredUser | null> {
  const raw = await SecureStore.getItemAsync(KEYS.user);
  return raw ? (JSON.parse(raw) as StoredUser) : null;
}

export async function setUser(user: StoredUser): Promise<void> {
  await SecureStore.setItemAsync(KEYS.user, JSON.stringify(user));
}

export async function clearUser(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.user);
}

export async function getOnboarded(): Promise<boolean> {
  const v = await SecureStore.getItemAsync(KEYS.onboarded);
  return v === '1';
}

export async function setOnboarded(): Promise<void> {
  await SecureStore.setItemAsync(KEYS.onboarded, '1');
}

export async function clearAll(): Promise<void> {
  await Promise.all([clearToken(), clearDevice(), clearUser()]);
}
