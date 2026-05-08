import { View } from 'react-native';
import { cn } from '@/lib/cn';

type Props = {
  className?: string;
};

export function Divider({ className }: Props) {
  return <View className={cn('h-px w-full bg-border-subtle', className)} />;
}
