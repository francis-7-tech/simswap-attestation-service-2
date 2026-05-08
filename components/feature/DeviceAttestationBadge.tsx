import { ShieldCheck } from '@/components/icons';
import { BadgePill } from '@/components/ui/BadgePill';

type Props = {
  verified?: boolean;
};

export function DeviceAttestationBadge({ verified = true }: Props) {
  return (
    <BadgePill
      tone={verified ? 'accent' : 'critical'}
      label={verified ? 'verified' : 'unverified'}
      leading={
        <ShieldCheck
          size={12}
          color={verified ? '#00F5D4' : '#FF4D4D'}
          weight="bold"
        />
      }
    />
  );
}
