import { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fingerprint, ShieldX, X } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { useAuth } from '@/hooks/useAuth';
import { useAttestation } from '@/hooks/useAttestation';
import { haptic } from '@/lib/haptics';

type Status =
  | 'idle'
  | 'biometric'
  | 'attesting'
  | 'done'
  | 'denied'
  | 'locked';

export default function StepUp() {
  const { attest, pending } = useAttestation();
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [retried, setRetried] = useState(false);

  const close = () => router.back();

  const run = async () => {
    setError(null);
    try {
      setStatus('biometric');
      const has = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (has && enrolled) {
        const r = await LocalAuthentication.authenticateAsync({
          promptMessage: 'verify it is you',
        });
        if (!r.success) {
          haptic.error();
          setError('biometric check failed');
          setStatus('idle');
          return;
        }
      }

      setStatus('attesting');
      const decision = await attest('step-up');

      if (decision.decision === 'ALLOW') {
        haptic.success();
        setStatus('done');
        setTimeout(close, 700);
      } else if (decision.decision === 'CHALLENGE') {
        haptic.warning();
        setError(decision.reason || 'sim change detected, re-verify');
        setStatus('idle');
      } else if (decision.decision === 'HIGH_RISK') {
        haptic.error();
        setError(decision.reason || 'this device looks unsafe');
        setStatus('locked');
      } else {
        haptic.error();
        setError(decision.reason || "couldn't verify your device");
        setStatus('denied');
      }
    } catch (e) {
      haptic.error();
      setError(e instanceof Error ? e.message : 'verification failed');
      setStatus('denied');
    }
  };

  const retryDeny = async () => {
    setRetried(true);
    setStatus('idle');
    setError(null);
    await run();
  };

  const isWorking = pending || status === 'biometric' || status === 'attesting';

  if (status === 'locked') {
    return (
      <View className="flex-1 bg-canvas">
        <SafeAreaView className="flex-1">
          <View className="flex-1 items-center justify-center px-6">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-status-critical/10">
              <ShieldX size={44} color="#FF4D4D" weight="bold" />
            </View>
            <Text
              className="mt-8 text-center font-medium text-text-primary"
              style={{ fontSize: 24, letterSpacing: -0.48 }}
            >
              we can't complete this request
            </Text>
            <Text
              className="mt-3 text-center text-[14px] text-text-secondary"
              style={{ maxWidth: 320 }}
            >
              {error
                ? error.toLowerCase()
                : 'this device looks unsafe for sensitive actions.'}
            </Text>
          </View>
          <View className="px-6 pb-8" style={{ gap: 10 }}>
            <Button
              label="contact support"
              onPress={() =>
                Linking.openURL('mailto:support@cipher.app').catch(() => {})
              }
            />
            <Button
              label="sign out"
              variant="secondary"
              onPress={async () => {
                await signOut();
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (status === 'denied') {
    return (
      <View className="flex-1 bg-canvas">
        <SafeAreaView className="flex-1">
          <View className="flex-row justify-end px-6 pt-2">
            <Pressable
              onPress={close}
              haptic="light"
              className="h-9 w-9 items-center justify-center rounded-full bg-surface-1"
            >
              <X size={16} color="#A3A3A3" weight="regular" />
            </Pressable>
          </View>

          <View className="flex-1 items-center justify-center px-6">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-status-critical/10">
              <X size={44} color="#FF4D4D" weight="bold" />
            </View>
            <Text
              className="mt-8 text-center font-medium text-text-primary"
              style={{ fontSize: 24, letterSpacing: -0.48 }}
            >
              couldn't verify
            </Text>
            <Text
              className="mt-3 text-center text-[14px] text-text-secondary"
              style={{ maxWidth: 320 }}
            >
              {error
                ? error.toLowerCase()
                : 'something went wrong validating your device.'}
            </Text>
          </View>

          <View className="px-6 pb-8" style={{ gap: 10 }}>
            {!retried ? (
              <Button label="try again" onPress={retryDeny} />
            ) : (
              <Button
                label="contact support"
                onPress={() =>
                  Linking.openURL('mailto:support@cipher.app').catch(() => {})
                }
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-end px-6 pt-2">
          <Pressable
            onPress={close}
            haptic="light"
            className="h-9 w-9 items-center justify-center rounded-full bg-surface-1"
          >
            <X size={16} color="#A3A3A3" weight="regular" />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className="h-24 w-24 items-center justify-center rounded-full border border-accent-border bg-accent-dim">
            <Fingerprint size={44} color="#00F5D4" weight="regular" />
          </View>

          <Text
            className="mt-8 text-center font-medium text-text-primary"
            style={{ fontSize: 24, letterSpacing: -0.48 }}
          >
            {status === 'done' ? 'verified' : "verify it's you"}
          </Text>
          <Text
            className="mt-3 text-center text-[14px] text-text-secondary"
            style={{ maxWidth: 300 }}
          >
            {status === 'attesting'
              ? 'requesting a fresh signature from your device key…'
              : status === 'done'
                ? 'attestation passed. you can move money.'
                : 'we need a fresh signature for this action.'}
          </Text>

          {error ? (
            <Text className="mt-4 text-[13px] text-status-critical">
              {error.toLowerCase()}
            </Text>
          ) : null}
        </View>

        <View className="px-6 pb-8">
          <Button
            label={isWorking ? 'verifying…' : 'use biometric'}
            onPress={run}
            loading={isWorking}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
