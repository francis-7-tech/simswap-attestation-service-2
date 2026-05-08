import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/lib/cn';

type Variant = 'safe' | 'warning' | 'critical' | 'neutral';

type Props = {
  variant?: Variant;
  size?: number;
  className?: string;
};

const COLOR: Record<Variant, string> = {
  safe: '#22C55E',
  warning: '#F59E0B',
  critical: '#FF4D4D',
  neutral: '#525252',
};

export function StatusDot({ variant = 'neutral', size = 6, className }: Props) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (variant === 'critical') {
      opacity.value = withRepeat(
        withTiming(0.35, {
          duration: 900,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      );
    } else {
      opacity.value = 1;
    }
    return () => cancelAnimation(opacity);
  }, [variant, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={cn(className)}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: COLOR[variant],
        },
        animatedStyle,
      ]}
    />
  );
}
