import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';

type Tone = 'accent' | 'safe' | 'warning' | 'critical' | 'neutral';

type Props = {
  label: string;
  tone?: Tone;
  leading?: React.ReactNode;
  className?: string;
};

const TONE_BG = {
  accent: 'bg-accent-dim border-accent-border',
  safe: 'bg-status-safe/10 border-status-safe/30',
  warning: 'bg-status-warning/10 border-status-warning/30',
  critical: 'bg-status-critical/10 border-status-critical/30',
  neutral: 'bg-surface-2 border-border-strong',
} as const;

const TONE_TEXT = {
  accent: 'text-accent',
  safe: 'text-status-safe',
  warning: 'text-status-warning',
  critical: 'text-status-critical',
  neutral: 'text-text-secondary',
} as const;

export function BadgePill({
  label,
  tone = 'accent',
  leading,
  className,
}: Props) {
  return (
    <View
      className={cn(
        'flex-row items-center rounded-full border px-3 py-1',
        TONE_BG[tone],
        className
      )}
    >
      {leading ? <View className="mr-1.5">{leading}</View> : null}
      <Text className={cn('text-[11px] font-medium', TONE_TEXT[tone])}>
        {label.toLowerCase()}
      </Text>
    </View>
  );
}
