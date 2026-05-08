import { useCallback, useState } from 'react';
import { getChallenge, verifyAttestation } from '@/lib/api/attestation';
import { signWithDeviceKey } from '@/lib/attestation/keys';
import { collectAttestationPayload } from '@/lib/attestation/collect';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRiskStore } from '@/lib/stores/risk.store';
import type { AttestDecision } from '@/lib/api/types';

export function useAttestation() {
  const device = useAuthStore((s) => s.device);
  const setLastVerifiedAt = useRiskStore((s) => s.setLastVerifiedAt);
  const pushSignal = useRiskStore((s) => s.pushSignal);
  const [pending, setPending] = useState(false);
  const [lastDecision, setLastDecision] = useState<AttestDecision | null>(null);

  const attest = useCallback(
    async (action: string): Promise<AttestDecision> => {
      if (!device) {
        throw new Error('device not enrolled');
      }
      setPending(true);
      try {
        const payload = await collectAttestationPayload(action);
        const payloadString = JSON.stringify(payload);

        const { challenge } = await getChallenge(device.deviceUuid);
        const signatureBase64 = await signWithDeviceKey(challenge + payloadString);

        const decision = await verifyAttestation({
          deviceUuid: device.deviceUuid,
          challenge,
          payload: payloadString,
          signatureBase64,
        });

        setLastDecision(decision);
        setLastVerifiedAt(Date.now());
        const status =
          decision.decision === 'ALLOW'
            ? 'safe'
            : decision.decision === 'CHALLENGE'
              ? 'warning'
              : 'critical';
        pushSignal({
          id: `attest-${Date.now()}`,
          label:
            decision.decision === 'ALLOW'
              ? 'attestation passed'
              : `attestation ${decision.decision.toLowerCase().replace('_', ' ')}`,
          status,
          detail: decision.reason,
          at: Date.now(),
        });
        return decision;
      } finally {
        setPending(false);
      }
    },
    [device, pushSignal, setLastVerifiedAt]
  );

  return { attest, pending, lastDecision };
}
