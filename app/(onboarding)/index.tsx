import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { OnboardingSlide } from '@/components/feature/OnboardingSlide';
import { PageDots } from '@/components/feature/PageDots';
import { Pressable } from '@/components/ui/Pressable';
import { setOnboarded } from '@/lib/secure-store';
import Slide1 from '@/assets/svg/onboarding-1.svg';
import Slide2 from '@/assets/svg/onboarding-2.svg';
import Slide3 from '@/assets/svg/onboarding-3.svg';

const SLIDES = [
  {
    Illustration: Slide1,
    headline: 'banking that knows your device',
    subhead:
      'every login is checked against your SIM, your fingerprint, and 30+ device signals. swaps get caught the moment they happen.',
  },
  {
    Illustration: Slide2,
    headline: 'every transaction, signed',
    subhead:
      'your device holds a private key that signs every sensitive action. servers verify the signature before money moves. no signature, no money.',
  },
  {
    Illustration: Slide3,
    headline: "you're in control",
    subhead:
      'one tap to lock your account if anything looks off. one tap to verify it was really you. no one-time codes to fumble with.',
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList>(null);

  const isLast = index === SLIDES.length - 1;

  const finish = async () => {
    await setOnboarded();
    router.replace('/(auth)/signup');
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    list.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View
        style={{
          height: 32,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 24,
          paddingTop: 8,
        }}
      >
        {!isLast ? (
          <Pressable onPress={finish} haptic="light">
            <Text style={{ color: '#A3A3A3', fontSize: 13, fontWeight: '500' }}>
              skip
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          ref={list}
          data={SLIDES}
          keyExtractor={(_, i) => `slide-${i}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={onScrollEnd}
          getItemLayout={(_, i) => ({
            length: width,
            offset: width * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <View style={{ width, flex: 1 }}>
              <OnboardingSlide
                Illustration={item.Illustration}
                headline={item.headline}
                subhead={item.subhead}
              />
            </View>
          )}
        />
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={{ marginBottom: 24, alignItems: 'center' }}>
          <PageDots count={SLIDES.length} active={index} />
        </View>
        <Button
          label={isLast ? 'get started' : 'continue'}
          onPress={next}
          haptic="medium"
        />
      </View>
    </SafeAreaView>
  );
}
