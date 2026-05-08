import { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lightning } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { MicroLabel } from '@/components/ui/MicroLabel';
import { Pressable } from '@/components/ui/Pressable';
import { TrustScoreHero } from '@/components/feature/TrustScoreHero';
import { DeviceAttestationBadge } from '@/components/feature/DeviceAttestationBadge';
import {
  TransactionRow,
  type Transaction,
} from '@/components/feature/TransactionRow';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRiskStore } from '@/lib/stores/risk.store';

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    title: 'salary',
    caption: 'spectranet · today, 09:14',
    amount: '+₦485,000',
    direction: 'in',
  },
  {
    id: 't2',
    title: 'spotify family',
    caption: 'subscription · yesterday',
    amount: '-₦2,100',
    direction: 'out',
  },
  {
    id: 't3',
    title: 'transfer to chiamaka',
    caption: 'access bank · yesterday',
    amount: '-₦18,500',
    direction: 'out',
  },
  {
    id: 't4',
    title: 'refund · jumia',
    caption: 'merchant · 2 days ago',
    amount: '+₦14,990',
    direction: 'in',
  },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const trustScore = useRiskStore((s) => s.trustScore);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 700));
    setRefreshing(false);
  }, []);

  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00F5D4"
          />
        }
      >
        <View className="flex-row items-center justify-between pt-2">
          <View>
            <Text className="text-[12px] text-text-tertiary">good evening</Text>
            <Text className="mt-1 text-[18px] font-medium text-text-primary">
              {firstName.toLowerCase()}
            </Text>
          </View>
          <DeviceAttestationBadge verified />
        </View>

        <TrustScoreHero score={trustScore} />

        <View className="mt-8 flex-row" style={{ gap: 8 }}>
          <Card className="flex-1">
            <MicroLabel>balance</MicroLabel>
            <Text
              className="mt-2 font-medium text-text-primary"
              style={{
                fontSize: 22,
                letterSpacing: -0.44,
                fontVariant: ['tabular-nums'],
              }}
            >
              ₦2,847,500
            </Text>
            <Text className="mt-1 text-[12px] text-text-secondary">
              available
            </Text>
          </Card>
          <Card className="flex-1">
            <MicroLabel>SIM age</MicroLabel>
            <Text
              className="mt-2 font-medium text-text-primary"
              style={{ fontSize: 22, letterSpacing: -0.44 }}
            >
              2y 4m
            </Text>
            <Text className="mt-1 text-[12px] text-status-safe">stable</Text>
          </Card>
        </View>

        <View className="mt-10">
          <View className="mb-2 flex-row items-center justify-between">
            <MicroLabel>recent activity</MicroLabel>
            <Pressable
              onPress={() => router.push('/(tabs)/activity')}
              haptic="light"
            >
              <Text className="text-[12px] font-medium text-accent">
                see all
              </Text>
            </Pressable>
          </View>

          <Card className="px-4 py-1">
            {MOCK_TRANSACTIONS.map((tx, i) => (
              <View key={tx.id}>
                <TransactionRow
                  tx={tx}
                  onPress={(id) =>
                    router.push({
                      pathname: '/(modals)/transaction-detail',
                      params: { id },
                    })
                  }
                />
                {i < MOCK_TRANSACTIONS.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-28 right-6"
        style={{ shadowColor: '#00F5D4', shadowOpacity: 0.4, shadowRadius: 12 }}
      >
        <Pressable
          onPress={() => router.push('/(modals)/step-up')}
          haptic="medium"
          className="h-14 w-14 items-center justify-center rounded-full bg-accent"
        >
          <Lightning size={22} color="#000000" weight="bold" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
