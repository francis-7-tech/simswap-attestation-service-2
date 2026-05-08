import { Text, View } from 'react-native';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShieldWarning,
} from '@/components/icons';
import { Pressable } from '@/components/ui/Pressable';

export type Transaction = {
  id: string;
  title: string;
  caption: string;
  amount: string;
  direction: 'in' | 'out';
  flagged?: boolean;
};

type Props = {
  tx: Transaction;
  onPress?: (id: string) => void;
};

export function TransactionRow({ tx, onPress }: Props) {
  const Icon = tx.flagged
    ? ShieldWarning
    : tx.direction === 'in'
      ? ArrowDownLeft
      : ArrowUpRight;

  const tint = tx.flagged
    ? 'bg-status-critical/10'
    : tx.direction === 'in'
      ? 'bg-status-safe/10'
      : 'bg-surface-2';

  const iconColor = tx.flagged
    ? '#FF4D4D'
    : tx.direction === 'in'
      ? '#22C55E'
      : '#A3A3A3';

  const amountColor = tx.flagged
    ? 'text-status-critical'
    : tx.direction === 'in'
      ? 'text-status-safe'
      : 'text-text-primary';

  return (
    <Pressable
      onPress={() => onPress?.(tx.id)}
      className="flex-row items-center py-3"
    >
      <View
        className={`h-8 w-8 items-center justify-center rounded-full ${tint}`}
      >
        <Icon size={16} color={iconColor} weight="regular" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-[14px] font-medium text-text-primary">
          {tx.title.toLowerCase()}
        </Text>
        <Text className="mt-0.5 text-[12px] text-text-secondary">
          {tx.caption.toLowerCase()}
        </Text>
      </View>
      <Text
        className={`text-[14px] font-medium ${amountColor}`}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {tx.amount}
      </Text>
    </Pressable>
  );
}
