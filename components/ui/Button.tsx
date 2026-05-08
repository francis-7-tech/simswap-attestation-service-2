import { ActivityIndicator, Text, View } from 'react-native';
import { Pressable } from './Pressable';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'lg' | 'md' | 'sm';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
};

const SIZE = {
  lg: 'h-14 px-6',
  md: 'h-12 px-5',
  sm: 'h-9 px-4',
} as const;

const TEXT_SIZE = {
  lg: 'text-[15px]',
  md: 'text-[14px]',
  sm: 'text-[13px]',
} as const;

const VARIANT_BG = {
  primary: 'bg-accent',
  secondary: 'bg-transparent border border-border-strong',
  danger: 'bg-transparent border border-status-critical',
  ghost: 'bg-transparent',
} as const;

const VARIANT_TEXT = {
  primary: 'text-canvas',
  secondary: 'text-text-primary',
  danger: 'text-status-critical',
  ghost: 'text-accent',
} as const;

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  fullWidth = true,
  leading,
  trailing,
  className,
  haptic = 'medium',
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      haptic={haptic}
      className={cn(
        'flex-row items-center justify-center rounded-lg',
        SIZE[size],
        VARIANT_BG[variant],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#000' : '#FAFAFA'}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {leading ? <View className="mr-2">{leading}</View> : null}
          <Text
            className={cn(
              'font-medium',
              TEXT_SIZE[size],
              VARIANT_TEXT[variant]
            )}
          >
            {label}
          </Text>
          {trailing ? <View className="ml-2">{trailing}</View> : null}
        </View>
      )}
    </Pressable>
  );
}
