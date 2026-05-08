import { create } from 'zustand';

export type SignalStatus = 'safe' | 'warning' | 'critical';

export type RiskSignal = {
  id: string;
  label: string;
  status: SignalStatus;
  detail?: string;
  at: number;
};

type RiskState = {
  trustScore: number;
  signals: RiskSignal[];
  lastVerifiedAt: number | null;
  locked: boolean;
  setTrustScore: (n: number) => void;
  pushSignal: (s: RiskSignal) => void;
  setSignals: (s: RiskSignal[]) => void;
  setLastVerifiedAt: (t: number) => void;
  lock: () => void;
  unlock: () => void;
  reset: () => void;
};

const DEFAULT_SIGNALS: RiskSignal[] = [
  {
    id: 'sim-monitor',
    label: 'SIM swap monitor',
    status: 'safe',
    detail: 'no swaps detected',
    at: Date.now(),
  },
  {
    id: 'fingerprint',
    label: 'device fingerprint',
    status: 'safe',
    detail: 'matches enrollment',
    at: Date.now(),
  },
  {
    id: 'baseline',
    label: 'behavioural baseline',
    status: 'safe',
    detail: 'consistent with profile',
    at: Date.now(),
  },
  {
    id: 'network',
    label: 'network risk',
    status: 'warning',
    detail: 'unfamiliar wifi',
    at: Date.now(),
  },
];

export const useRiskStore = create<RiskState>((set) => ({
  trustScore: 98,
  signals: DEFAULT_SIGNALS,
  lastVerifiedAt: null,
  locked: false,
  setTrustScore: (n) => set({ trustScore: n }),
  pushSignal: (s) =>
    set((state) => ({ signals: [s, ...state.signals].slice(0, 20) })),
  setSignals: (signals) => set({ signals }),
  setLastVerifiedAt: (t) => set({ lastVerifiedAt: t }),
  lock: () => set({ locked: true }),
  unlock: () => set({ locked: false }),
  reset: () =>
    set({
      trustScore: 98,
      signals: DEFAULT_SIGNALS,
      lastVerifiedAt: null,
      locked: false,
    }),
}));
