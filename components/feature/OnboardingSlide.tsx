import { Text, View } from 'react-native';

type Props = {
  Illustration: React.FC<{ width?: number; height?: number }>;
  headline: string;
  subhead: string;
};

export function OnboardingSlide({
  Illustration,
  headline,
  subhead,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <Illustration width={220} height={220} />
      </View>

      <View style={{ marginTop: 40, alignItems: 'center', width: '100%' }}>
        <Text
          style={{
            color: '#FAFAFA',
            fontSize: 24,
            lineHeight: 30,
            fontWeight: '600',
            letterSpacing: -0.48,
            textAlign: 'center',
            paddingHorizontal: 8,
          }}
        >
          {headline.toLowerCase()}
        </Text>
        <Text
          style={{
            color: '#A3A3A3',
            fontSize: 14,
            lineHeight: 21,
            textAlign: 'center',
            marginTop: 12,
            maxWidth: 320,
            paddingHorizontal: 8,
          }}
        >
          {subhead.toLowerCase()}
        </Text>
      </View>
    </View>
  );
}
