import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { MicroLabel } from '@/components/ui/MicroLabel';
import { StatusDot } from '@/components/ui/StatusDot';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

type Props = {
  score: number;
};

export function TrustScoreHero({ score }: Props) {
  const display = useAnimatedCounter(score, 900);
  const pulse = useSharedValue(1);

  const tier =
    score >= 90 ? 'safe' : score >= 70 ? 'warning' : 'critical';

  const subhead =
    tier === 'safe'
      ? 'all signals normal'
      : tier === 'warning'
        ? 'minor anomalies'
        : 'elevated risk';

  const subheadColor =
    tier === 'safe'
      ? 'text-status-safe'
      : tier === 'warning'
        ? 'text-status-warning'
        : 'text-status-critical';

  useEffect(() => {
    if (score < 70) {
      pulse.value = withRepeat(
        withTiming(1.02, {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
    return () => cancelAnimation(pulse);
  }, [score, pulse]);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View className="pt-8">
      <MicroLabel>device trust score</MicroLabel>
      <Animated.View style={heroStyle} className="mt-3 flex-row items-end">
        <Text
          className="font-medium text-text-primary"
          style={{
            fontSize: 64,
            lineHeight: 64,
            letterSpacing: -2.56,
            fontVariant: ['tabular-nums'],
          }}
        >
          {display}
        </Text>
        <Text
          className="ml-1 pb-1 text-text-tertiary"
          style={{ fontSize: 28, lineHeight: 28 }}
        >
          /100
        </Text>
      </Animated.View>
      <View className="mt-3 flex-row items-center">
        <StatusDot variant={tier} size={6} />
        <Text className={`ml-2 text-[13px] font-medium ${subheadColor}`}>
          {subhead}
        </Text>
      </View>
    </View>
  );
}
