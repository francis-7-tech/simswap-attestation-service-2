import { api } from '@/lib/api/client';
import type {
  AttestDecision,
  ChallengeResponse,
  EnrollKeyRequest,
  VerifyRequest,
} from '@/lib/api/types';

export const enrollKey = (body: EnrollKeyRequest) =>
  api.post<{ ok: true }>('/api/v1/attest/enroll', body).then((r) => r.data);

export const getChallenge = (deviceUuid: string) =>
  api
    .get<ChallengeResponse>('/api/v1/attest/challenge', {
      params: { deviceUuid },
    })
    .then((r) => r.data);

export const verifyAttestation = (body: VerifyRequest) =>
  api
    .post<AttestDecision>('/api/v1/attest/verify', body)
    .then((r) => r.data);
