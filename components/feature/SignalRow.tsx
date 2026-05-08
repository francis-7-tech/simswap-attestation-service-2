import { Text, View } from 'react-native';
import { StatusDot } from '@/components/ui/StatusDot';
import type { SignalStatus } from '@/lib/stores/risk.store';

type Props = {
  label: string;
  detail?: string;
  status: SignalStatus;
  timestamp?: string;
};

export function SignalRow({ label, detail, status, timestamp }: Props) {
  return (
    <View className="flex-row items-center py-3">
      <StatusDot variant={status} size={6} />
      <View className="ml-3 flex-1">
        <Text className="text-[14px] font-medium text-text-primary">
          {label.toLowerCase()}
        </Text>
        {detail ? (
          <Text className="mt-0.5 text-[12px] text-text-secondary">
            {detail.toLowerCase()}
          </Text>
        ) : null}
      </View>
      {timestamp ? (
        <Text className="text-[11px] text-text-tertiary">
          {timestamp.toLowerCase()}
        </Text>
      ) : null}
    </View>
  );
}
