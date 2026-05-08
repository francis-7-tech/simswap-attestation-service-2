import { useRiskStore } from '@/lib/stores/risk.store';

export function useRiskScore() {
  const trustScore = useRiskStore((s) => s.trustScore);
  const signals = useRiskStore((s) => s.signals);
  const locked = useRiskStore((s) => s.locked);

  const tier =
    trustScore >= 90 ? 'safe' : trustScore >= 70 ? 'warning' : 'critical';

  const subhead =
    tier === 'safe'
      ? 'all signals normal'
      : tier === 'warning'
        ? 'minor anomalies'
        : 'elevated risk';

  return { trustScore, signals, locked, tier, subhead };
}
