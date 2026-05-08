import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export function usePressableScale(target = 0.97) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(target, { damping: 15, stiffness: 350 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 350 });
  };

  return { style, onPressIn, onPressOut };
}
