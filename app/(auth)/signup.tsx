import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { haptic } from '@/lib/haptics';
import Logo from '@/assets/svg/logo.svg';
import type { ApiError } from '@/lib/api/types';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (fullName.trim().length < 2) next.fullName = 'enter your full name';
    if (!EMAIL_RX.test(email)) next.email = 'enter a valid email';
    if (password.length < 8) next.password = 'min 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) {
      haptic.error();
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await signup(email.trim(), password, fullName.trim());
      haptic.success();
      router.replace('/(tabs)');
    } catch (e) {
      const err = e as ApiError;
      haptic.error();
      setErrors({ form: err.message ?? 'signup failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 flex-row items-center">
            <Logo width={32} height={32} />
            <Text className="ml-2 text-[18px] font-medium text-text-primary">
              cipher
            </Text>
          </View>

          <Text
            className="font-medium text-text-primary"
            style={{ fontSize: 24, letterSpacing: -0.48 }}
          >
            create your account
          </Text>
          <Text className="mt-2 text-[14px] text-text-secondary">
            secure banking, locked to your device.
          </Text>

          <View className="mt-8" style={{ gap: 16 }}>
            <Input
              label="full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              error={errors.fullName}
              autoCorrect={false}
            />
            <Input
              label="email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />
            <Input
              label="password"
              value={password}
              onChangeText={setPassword}
              secure
              error={errors.password}
            />
          </View>

          {errors.form ? (
            <Text className="mt-4 text-[12px] text-status-critical">
              {errors.form}
            </Text>
          ) : null}

          <View className="mt-8">
            <Button
              label="create account"
              onPress={onSubmit}
              loading={loading}
            />
          </View>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-[13px] text-text-secondary">
              already have an account?{' '}
            </Text>
            <Link
              href="/(auth)/login"
              replace
              className="text-[13px] font-medium text-accent"
            >
              sign in
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
