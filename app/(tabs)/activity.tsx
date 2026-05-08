import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pulse } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { MicroLabel } from '@/components/ui/MicroLabel';
import { Pressable } from '@/components/ui/Pressable';
import {
  TransactionRow,
  type Transaction,
} from '@/components/feature/TransactionRow';
import { cn } from '@/lib/cn';

type Filter = 'all' | 'incoming' | 'outgoing' | 'flagged';

type DatedTx = Transaction & { bucket: 'today' | 'yesterday' | 'this week' | 'earlier' };

const DATA: DatedTx[] = [
  {
    id: 't1',
    title: 'salary',
    caption: 'spectranet · 09:14',
    amount: '+₦485,000',
    direction: 'in',
    bucket: 'today',
  },
  {
    id: 't2',
    title: 'spotify family',
    caption: 'subscription · 18:02',
    amount: '-₦2,100',
    direction: 'out',
    bucket: 'yesterday',
  },
  {
    id: 't3',
    title: 'transfer to chiamaka',
    caption: 'access bank · 14:30',
    amount: '-₦18,500',
    direction: 'out',
    bucket: 'yesterday',
  },
  {
    id: 't4',
    title: 'refund · jumia',
    caption: 'merchant · 2 days ago',
    amount: '+₦14,990',
    direction: 'in',
    bucket: 'this week',
  },
  {
    id: 't5',
    title: 'flagged login attempt',
    caption: 'unfamiliar device · 3 days ago',
    amount: '—',
    direction: 'out',
    flagged: true,
    bucket: 'this week',
  },
  {
    id: 't6',
    title: 'rent · uba',
    caption: 'standing order · last month',
    amount: '-₦450,000',
    direction: 'out',
    bucket: 'earlier',
  },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'incoming', label: 'incoming' },
  { id: 'outgoing', label: 'outgoing' },
  { id: 'flagged', label: 'flagged' },
];

export default function Activity() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return DATA;
    if (filter === 'incoming') return DATA.filter((d) => d.direction === 'in');
    if (filter === 'outgoing')
      return DATA.filter((d) => d.direction === 'out' && !d.flagged);
    return DATA.filter((d) => d.flagged);
  }, [filter]);

  const grouped = useMemo(() => {
    const buckets: Record<string, Transaction[]> = {};
    for (const t of filtered) {
      if (!buckets[t.bucket]) buckets[t.bucket] = [];
      buckets[t.bucket]!.push(t);
    }
    return buckets;
  }, [filtered]);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <View className="px-6 pt-2">
        <MicroLabel>all activity</MicroLabel>
        <View className="mt-3 flex-row" style={{ gap: 8 }}>
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                haptic="light"
                className={cn(
                  'rounded-full border px-3 py-1.5',
                  active
                    ? 'border-accent-border bg-accent-dim'
                    : 'border-border-strong bg-transparent'
                )}
              >
                <Text
                  className={cn(
                    'text-[12px] font-medium',
                    active ? 'text-accent' : 'text-text-secondary'
                  )}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, paddingTop: 16 }}
      >
        {filtered.length === 0 ? (
          <View className="items-center justify-center pt-32">
            <Pulse size={36} color="#525252" weight="regular" />
            <Text className="mt-4 text-[13px] text-text-tertiary">
              no activity yet
            </Text>
          </View>
        ) : (
          Object.entries(grouped).map(([bucket, items]) => (
            <View key={bucket} className="mt-6">
              <MicroLabel className="mb-2">{bucket}</MicroLabel>
              <Card className="px-4 py-1">
                {items.map((tx, i) => (
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
                    {i < items.length - 1 ? <Divider /> : null}
                  </View>
                ))}
              </Card>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
