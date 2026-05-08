import { View, ViewProps } from 'react-native';
import { cn } from '@/lib/cn';

type Props = ViewProps & {
  compact?: boolean;
  className?: string;
};

export function Card({
  compact = false,
  className,
  children,
  ...rest
}: Props) {
  return (
    <View
      {...rest}
      className={cn(
        'rounded-lg border border-border-subtle bg-surface-1',
        compact ? 'p-3' : 'p-4',
        className
      )}
    >
      {children}
    </View>
  );
}
