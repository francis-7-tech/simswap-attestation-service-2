import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { MicroLabel } from '@/components/ui/MicroLabel';
import { StatusDot } from '@/components/ui/StatusDot';
import { SignalRow } from '@/components/feature/SignalRow';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRiskStore } from '@/lib/stores/risk.store';

export default function Security() {
  const device = useAuthStore((s) => s.device);
  const signals = useRiskStore((s) => s.signals);
  const lock = useRiskStore((s) => s.lock);

  const truncated = device
    ? `${device.deviceUuid.slice(0, 8)}…${device.deviceUuid.slice(-4)}`
    : 'not enrolled';

  const events = [
    { id: 'e1', label: 'signed in from this device', at: 'today, 09:12' },
    { id: 'e2', label: 'attestation passed for transfer', at: 'yesterday' },
    { id: 'e3', label: 'unfamiliar wifi noticed', at: '2 days ago' },
  ];

  const onLock = () => {
    lock();
    router.push('/(modals)/alert');
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120,
          paddingTop: 8,
        }}
      >
        <Text
          className="font-medium text-text-primary"
          style={{ fontSize: 24, letterSpacing: -0.48 }}
        >
          security
        </Text>
        <Text className="mt-2 text-[14px] text-text-secondary">
          the layers protecting this account.
        </Text>

        <View className="mt-8">
          <MicroLabel className="mb-2">device attestation</MicroLabel>
          <Card>
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-accent-dim">
                <ShieldCheck size={18} color="#00F5D4" weight="bold" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-medium text-text-primary">
                  this device
                </Text>
                <Text
                  className="mt-0.5 text-[12px] text-text-secondary"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {truncated.toLowerCase()}
                </Text>
                <Text className="mt-0.5 text-[11px] text-text-tertiary">
                  enrolled 12 days ago
                </Text>
              </View>
              <StatusDot variant="safe" size={6} />
            </View>
          </Card>
        </View>

        <View className="mt-8">
          <MicroLabel className="mb-2">active signals</MicroLabel>
          <Card className="px-4 py-1">
            {signals.map((s, i) => (
              <View key={s.id}>
                <SignalRow
                  label={s.label}
                  detail={s.detail}
                  status={s.status}
                />
                {i < signals.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>
        </View>

        <View className="mt-8">
          <MicroLabel className="mb-2">recent events</MicroLabel>
          <Card className="px-4 py-1">
            {events.map((e, i) => (
              <View key={e.id}>
                <View className="flex-row items-center justify-between py-3">
                  <Text className="flex-1 text-[14px] text-text-primary">
                    {e.label}
                  </Text>
                  <Text className="ml-3 text-[11px] text-text-tertiary">
                    {e.at}
                  </Text>
                </View>
                {i < events.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>
        </View>

        <View className="mt-10">
          <MicroLabel className="mb-2">danger zone</MicroLabel>
          <Button
            label="lock all transactions"
            variant="danger"
            onPress={onLock}
            haptic="heavy"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
