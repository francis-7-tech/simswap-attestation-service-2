import { Text, TextProps } from 'react-native';
import { cn } from '@/lib/cn';

type Props = TextProps & {
  children: string;
  className?: string;
};

export function MicroLabel({ children, className, ...rest }: Props) {
  return (
    <Text
      {...rest}
      className={cn(
        'text-[11px] font-medium tracking-[0.12em] text-text-tertiary',
        className
      )}
    >
      {children.toLowerCase()}
    </Text>
  );
}
