import { RSAKeychain } from 'react-native-rsa-native';

const KEY_TAG = 'com.cipher.attestation.devicekey.v1';

function stripPem(pem: string): string {
  return pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');
}

async function readPublicKeyBase64(): Promise<string | null> {
  const raw = await RSAKeychain.getPublicKey(KEY_TAG).catch(() => undefined);
  if (!raw) return null;
  return stripPem(raw);
}

export async function ensureDeviceKey(): Promise<string> {
  const existing = await readPublicKeyBase64();
  if (existing) return existing;

  await RSAKeychain.generateKeys(KEY_TAG, 2048);
  const fresh = await readPublicKeyBase64();
  if (!fresh) throw new Error('failed to read newly generated public key');
  return fresh;
}

export async function signWithDeviceKey(message: string): Promise<string> {
  return RSAKeychain.signWithAlgorithm(message, KEY_TAG, 'SHA256withRSA');
}

export async function deleteDeviceKey(): Promise<void> {
  await RSAKeychain.deletePrivateKey(KEY_TAG);
}
