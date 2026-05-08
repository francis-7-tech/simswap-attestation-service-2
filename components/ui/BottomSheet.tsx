import { useEffect } from 'react';
import {
  Modal,
  Pressable as RNPressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function BottomSheet({ visible, onClose, children, className }: Props) {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(height);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 250 });
      backdrop.value = withTiming(0.6, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateY.value = withTiming(height, { duration: 220 });
      backdrop.value = withTiming(0, { duration: 200 });
    }
  }, [visible, height, translateY, backdrop]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFillObject, backdropStyle]}
          className="bg-black"
        >
          <RNPressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={sheetStyle}
          className={cn(
            'overflow-hidden rounded-t-2xl border-t border-border-subtle bg-surface-2',
            className
          )}
        >
          <View className="items-center pt-3">
            <View className="h-1 w-10 rounded-full bg-border-strong" />
          </View>
          <SafeAreaView edges={['bottom']}>
            <View className="px-5 pb-4 pt-4">{children}</View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

