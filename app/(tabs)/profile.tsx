import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretRight } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { MicroLabel } from '@/components/ui/MicroLabel';
import { Pressable } from '@/components/ui/Pressable';
import { useAuth } from '@/hooks/useAuth';

const ROWS = [
  { id: 'account', label: 'account details' },
  { id: 'notifications', label: 'notifications' },
  { id: 'appearance', label: 'appearance' },
  { id: 'help', label: 'help' },
];

export default function Profile() {
  const { user, signOut } = useAuth();

  const initial = user?.fullName?.charAt(0).toUpperCase() ?? '?';

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120,
          paddingTop: 8,
        }}
      >
        <View className="items-center pt-6">
          <View className="h-20 w-20 items-center justify-center rounded-full border border-border-strong bg-surface-1">
            <Text
              className="font-medium text-text-primary"
              style={{ fontSize: 28 }}
            >
              {initial}
            </Text>
          </View>
          <Text className="mt-4 text-[18px] font-medium text-text-primary">
            {user?.fullName?.toLowerCase() ?? 'cipher user'}
          </Text>
          <Text className="mt-1 text-[13px] text-text-secondary">
            {user?.email ?? ''}
          </Text>
        </View>

        <View className="mt-10">
          <MicroLabel className="mb-2">settings</MicroLabel>
          <Card className="px-4 py-1">
            {ROWS.map((r, i) => (
              <View key={r.id}>
                <Pressable className="flex-row items-center py-4">
                  <Text className="flex-1 text-[14px] text-text-primary">
                    {r.label}
                  </Text>
                  <CaretRight size={14} color="#525252" weight="regular" />
                </Pressable>
                {i < ROWS.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>
        </View>

        <View className="mt-8">
          <Pressable
            onPress={signOut}
            haptic="medium"
            className="h-14 items-center justify-center rounded-lg border border-status-critical/30 bg-transparent"
          >
            <Text className="text-[14px] font-medium text-status-critical">
              sign out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
