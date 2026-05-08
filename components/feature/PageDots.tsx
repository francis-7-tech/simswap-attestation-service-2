import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

type Props = {
  count: number;
  active: number;
};

const SPRING = { damping: 18, stiffness: 220 };

function Dot({ isActive }: { isActive: boolean }) {
  const width = useSharedValue(isActive ? 16 : 6);
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  useEffect(() => {
    width.value = withSpring(isActive ? 16 : 6, SPRING);
    opacity.value = withSpring(isActive ? 1 : 0.5, SPRING);
  }, [isActive, width, opacity]);

  const style = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
    backgroundColor: isActive ? '#00F5D4' : '#2A2A2A',
  }));

  return (
    <Animated.View
      style={[{ height: 6, borderRadius: 3, marginHorizontal: 3 }, style]}
    />
  );
}

export function PageDots({ count, active }: Props) {
  return (
    <View className="flex-row items-center justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} isActive={i === active} />
      ))}
    </View>
  );
}
