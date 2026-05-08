import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { House, Pulse, ShieldCheck, User } from '@/components/icons';
import { haptic } from '@/lib/haptics';

const TAB_BG = '#000000';
const ACTIVE = '#FAFAFA';
const INACTIVE = '#525252';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopColor: '#1F1F1F',
          borderTopWidth: 1,
          height: 84,
          paddingTop: 10,
          paddingBottom: 24,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          letterSpacing: 0,
        },
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarItemStyle: { gap: 4 },
      }}
      screenListeners={{
        tabPress: () => {
          haptic.light().catch(() => {});
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'home',
          tabBarIcon: ({ color, focused }) => (
            <House size={20} color={color} weight={focused ? 'bold' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'activity',
          tabBarIcon: ({ color, focused }) => (
            <Pulse size={20} color={color} weight={focused ? 'bold' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: 'security',
          tabBarIcon: ({ color, focused }) => (
            <ShieldCheck
              size={20}
              color={color}
              weight={focused ? 'bold' : 'regular'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color, focused }) => (
            <User size={20} color={color} weight={focused ? 'bold' : 'regular'} />
          ),
        }}
      />
    </Tabs>
  );
}
