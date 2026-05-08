import { useCallback } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRiskStore } from '@/lib/stores/risk.store';
import * as authApi from '@/lib/api/auth';
import { enrollKey } from '@/lib/api/attestation';
import { ensureDeviceKey } from '@/lib/attestation/keys';
import { getOrCreateDeviceUuid } from '@/lib/secure-store';

export function useAuth() {
  const { jwt, user, device, hydrated, setSession, setDevice, signOut } =
    useAuthStore();
  const resetRisk = useRiskStore((s) => s.reset);

  const handleSignup = useCallback(
    async (email: string, password: string, fullName: string) => {
      const deviceUuid = await getOrCreateDeviceUuid();
      const publicKeyBase64 = await ensureDeviceKey();

      const res = await authApi.signup({
        email,
        password,
        deviceUuid,
        publicKeyBase64,
      });
      await setSession(res.token, {
        userId: res.userId,
        email: res.email,
        fullName,
      });
      await setDevice({ deviceUuid: res.deviceUuid, publicKeyBase64 });

      // Best-effort enrollment of the public key. Backend may not have
      // /attest/enroll deployed yet; ignore failures.
      try {
        await enrollKey({
          deviceUuid: res.deviceUuid,
          publicKeyBase64,
          platform: Platform.OS === 'ios' ? 'ios' : 'android',
          integrityToken: null,
        });
      } catch {
        // ignore until endpoint ships
      }
    },
    [setSession, setDevice]
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      const publicKeyBase64 = await ensureDeviceKey();
      await setSession(res.token, {
        userId: res.userId,
        email: res.email,
        fullName: '',
      });
      await setDevice({ deviceUuid: res.deviceUuid, publicKeyBase64 });
    },
    [setSession, setDevice]
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    resetRisk();
    router.replace('/(auth)/login');
  }, [signOut, resetRisk]);

  return {
    jwt,
    user,
    device,
    hydrated,
    isAuthed: !!jwt,
    isEnrolled: !!device,
    signup: handleSignup,
    login: handleLogin,
    signOut: handleSignOut,
  };
}
