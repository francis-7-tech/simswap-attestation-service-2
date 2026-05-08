export type SignupRequest = {
  email: string;
  password: string;
  deviceUuid: string;
  publicKeyBase64?: string;
};

export type EnrollKeyRequest = {
  deviceUuid: string;
  publicKeyBase64: string;
  platform: 'ios' | 'android';
  integrityToken?: string | null;
};

export type AuthResponse = {
  userId: string;
  email: string;
  deviceUuid: string;
  token: string;
  expiresInMs: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ChallengeResponse = {
  challenge: string;
};

export type VerifyRequest = {
  deviceUuid: string;
  challenge: string;
  payload: string;
  signatureBase64: string;
};

export type AttestDecisionType = 'ALLOW' | 'CHALLENGE' | 'HIGH_RISK' | 'DENY';

export type AttestDecision = {
  decision: AttestDecisionType;
  reason: string;
};

export type ApiError = {
  status?: number;
  message: string;
};
