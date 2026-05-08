import { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  Pressable as RNPressable,
} from 'react-native';
import { Eye, EyeSlash } from '@/components/icons';
import { cn } from '@/lib/cn';

type Props = Omit<TextInputProps, 'style'> & {
  label?: string;
  error?: string | null;
  secure?: boolean;
  className?: string;
};

export function Input({
  label,
  error,
  secure = false,
  className,
  ...rest
}: Props) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  return (
    <View className={cn('w-full', className)}>
      {label ? (
        <Text className="mb-2 text-[12px] font-medium tracking-[0.12em] text-text-tertiary">
          {label.toLowerCase()}
        </Text>
      ) : null}

      <View
        className={cn(
          'h-14 flex-row items-center rounded-lg border bg-surface-1 px-4',
          focused
            ? 'border-accent-border'
            : error
              ? 'border-status-critical'
              : 'border-border-strong'
        )}
      >
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor="#525252"
          selectionColor="#00F5D4"
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className="flex-1 font-sans text-[15px] text-text-primary"
        />
        {secure ? (
          <RNPressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={12}
            className="ml-2"
          >
            {hidden ? (
              <EyeSlash size={18} color="#A3A3A3" weight="regular" />
            ) : (
              <Eye size={18} color="#A3A3A3" weight="regular" />
            )}
          </RNPressable>
        ) : null}
      </View>

      {error ? (
        <Text className="mt-2 text-[12px] text-status-critical">{error}</Text>
      ) : null}
    </View>
  );
}
