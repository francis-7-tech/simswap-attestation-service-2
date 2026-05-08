import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { ShieldX } from '@/components/icons';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { MicroLabel } from '@/components/ui/MicroLabel';
import { SignalRow } from '@/components/feature/SignalRow';
import { haptic } from '@/lib/haptics';
import { useRiskStore } from '@/lib/stores/risk.store';

export default function AlertModal() {
  const [visible, setVisible] = useState(true);
  const unlock = useRiskStore((s) => s.unlock);

  useEffect(() => {
    haptic.warning().catch(() => {});
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => router.back(), 220);
  };

  const onSelfAttest = () => {
    unlock();
    close();
  };

  const onLock = () => {
    close();
    setTimeout(() => router.push('/(modals)/step-up'), 240);
  };

  return (
    <BottomSheet visible={visible} onClose={close}>
      <View className="items-center pt-2">
        <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-status-critical/10">
          <ShieldX size={36} color="#FF4D4D" weight="bold" />
        </View>
        <View className="mt-4">
          <MicroLabel className="text-status-critical text-center">
            critical alert
          </MicroLabel>
        </View>
        <Text
          className="mt-2 text-center font-medium text-text-primary"
          style={{ fontSize: 24, letterSpacing: -0.48 }}
        >
          SIM swap detected
        </Text>
        <Text className="mt-2 px-4 text-center text-[14px] text-text-secondary">
          your SIM was reissued 14 minutes ago. all transactions are paused.
        </Text>
      </View>

      <View className="mt-6">
        <MicroLabel className="mb-2">risk signals</MicroLabel>
        <Card className="px-4 py-1">
          <SignalRow
            label="SIM swap monitor"
            detail="reissued 14m ago"
            status="critical"
            timestamp="14m"
          />
          <Divider />
          <SignalRow
            label="device fingerprint"
            detail="matches enrollment"
            status="safe"
            timestamp="now"
          />
          <Divider />
          <SignalRow
            label="network risk"
            detail="unfamiliar wifi"
            status="warning"
            timestamp="2h"
          />
        </Card>
      </View>

      <View className="mt-6" style={{ gap: 10 }}>
        <Button label="lock account and verify" onPress={onLock} haptic="heavy" />
        <Button
          label="it was me"
          variant="secondary"
          onPress={onSelfAttest}
        />
      </View>
    </BottomSheet>
  );
}
