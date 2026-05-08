import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAuthStore } from '@/lib/stores/auth.store';
import { getOnboarded } from '@/lib/secure-store';
import Logo from '@/assets/svg/logo.svg';

export default function Splash() {
  const hydrate = useAuthStore((s) => s.hydrate);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.96);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
    scale.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
    ringScale.value = withRepeat(
      withTiming(1.6, { duration: 2000, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
  }, [opacity, scale, ringScale, ringOpacity]);

  useEffect(() => {
    const start = Date.now();
    (async () => {
      await hydrate();
      const onboarded = await getOnboarded();
      const { jwt, device } = useAuthStore.getState();
      const elapsed = Date.now() - start;
      const wait = Math.max(0, 1200 - elapsed);
      setTimeout(() => {
        if (!onboarded) {
          router.replace('/(onboarding)');
        } else if (jwt && device) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      }, wait);
    })();
  }, [hydrate]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-canvas">
      <Animated.View style={ringStyle} className="absolute">
        <View className="h-[120px] w-[120px] rounded-full border border-accent/30" />
      </Animated.View>
      <Animated.View style={logoStyle}>
        <Logo width={72} height={72} />
      </Animated.View>
    </View>
  );
}
