import {
  Pressable as RNPressable,
  PressableProps,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

type Props = Omit<PressableProps, 'style'> & {
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
  scale?: number;
  className?: string;
};

const HAPTIC_MAP = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
} as const;

export function Pressable({
  haptic = 'light',
  scale = 0.97,
  onPress,
  children,
  className,
  disabled,
  ...rest
}: Props) {
  const s = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: s.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    s.value = withSpring(scale, { damping: 15, stiffness: 350 });
  };

  const handlePressOut = () => {
    s.value = withSpring(1, { damping: 15, stiffness: 350 });
  };

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    if (haptic !== 'none') {
      Haptics.impactAsync(HAPTIC_MAP[haptic]).catch(() => {});
    }
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      className={className}
      style={animatedStyle}
    >
      {children as React.ReactNode}
    </AnimatedPressable>
  );
}
