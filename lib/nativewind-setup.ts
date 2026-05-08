import { cssInterop } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

cssInterop(SafeAreaView, { className: 'style' });
cssInterop(Animated.View, { className: 'style' });
cssInterop(Animated.ScrollView, { className: 'style' });
cssInterop(Animated.Text, { className: 'style' });
