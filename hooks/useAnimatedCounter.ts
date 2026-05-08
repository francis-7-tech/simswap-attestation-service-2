import { useEffect, useState } from 'react';
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export function useAnimatedCounter(target: number, duration = 900) {
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(target, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    return () => cancelAnimation(progress);
  }, [target, duration, progress]);

  useAnimatedReaction(
    () => progress.value,
    (v) => {
      runOnJS(setDisplay)(Math.round(v));
    },
    [target]
  );

  return display;
}
