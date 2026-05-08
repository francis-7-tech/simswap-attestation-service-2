import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { MicroLabel } from '@/components/ui/MicroLabel';
import { SignalRow } from '@/components/feature/SignalRow';
import { haptic } from '@/lib/haptics';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [visible, setVisible] = useState(true);

  const close = () => {
    setVisible(false);
    setTimeout(() => router.back(), 220);
  };

  return (
    <BottomSheet visible={visible} onClose={close}>
      <View className="items-center pt-2">
        <MicroLabel>transaction</MicroLabel>
        <Text
          className="mt-3 font-medium text-text-primary"
          style={{
            fontSize: 40,
            letterSpacing: -1.6,
            fontVariant: ['tabular-nums'],
          }}
        >
          -₦18,500
        </Text>
        <Text className="mt-1 text-[13px] text-text-secondary">
          to chiamaka · access bank
        </Text>
        <Text className="mt-0.5 text-[12px] text-text-tertiary">
          yesterday, 14:30
        </Text>
      </View>

      <View className="mt-6 flex-row" style={{ gap: 8 }}>
        <Card className="flex-1">
          <MicroLabel>status</MicroLabel>
          <Text className="mt-2 text-[14px] font-medium text-status-safe">
            cleared
          </Text>
        </Card>
        <Card className="flex-1">
          <MicroLabel>risk score</MicroLabel>
          <Text
            className="mt-2 text-[14px] font-medium text-text-primary"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            04 / 100
          </Text>
        </Card>
      </View>

      <View className="mt-6">
        <MicroLabel className="mb-2">signal breakdown</MicroLabel>
        <Card className="px-4 py-1">
          <SignalRow
            label="device match"
            detail="signed by enrolled key"
            status="safe"
          />
          <Divider />
          <SignalRow
            label="recipient familiarity"
            detail="prior transfer 12 days ago"
            status="safe"
          />
          <Divider />
          <SignalRow
            label="amount baseline"
            detail="within 1.4σ of profile"
            status="safe"
          />
        </Card>
      </View>

      <View className="mt-6" style={{ gap: 10 }}>
        <Button
          label="flag as fraud"
          variant="danger"
          onPress={() => {
            haptic.warning();
            close();
          }}
        />
        <Button
          label="it's fine"
          variant="secondary"
          onPress={() => {
            haptic.light();
            close();
          }}
        />
      </View>

      {id ? (
        <Text className="mt-4 text-center text-[10px] text-text-tertiary">
          ref · {String(id).toLowerCase()}
        </Text>
      ) : null}
    </BottomSheet>
  );
}
