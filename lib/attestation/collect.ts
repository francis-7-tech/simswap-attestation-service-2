import { Platform } from 'react-native';
import * as Cellular from 'expo-cellular';
import * as Location from 'expo-location';

export type AttestationPayload = {
  action: string;
  at: number;
  mcc: string | null;
  mnc: string | null;
  city: string | null;
  isRooted: boolean;
  isEmulator: boolean;
  usbDebug: boolean;
};

async function readCarrier(): Promise<{ mcc: string | null; mnc: string | null }> {
  if (Platform.OS !== 'android') return { mcc: null, mnc: null };
  try {
    const [mcc, mnc] = await Promise.all([
      Cellular.getMobileCountryCodeAsync().catch(() => null),
      Cellular.getMobileNetworkCodeAsync().catch(() => null),
    ]);
    return { mcc: mcc || null, mnc: mnc || null };
  } catch {
    return { mcc: null, mnc: null };
  }
}

async function readCity(): Promise<string | null> {
  try {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const req = await Location.requestForegroundPermissionsAsync();
      status = req.status;
    }
    if (status !== 'granted') return null;
    const loc = await Location.getLastKnownPositionAsync();
    if (!loc) return null;
    const [place] = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    return place?.city ?? place?.subregion ?? null;
  } catch {
    return null;
  }
}

export async function collectAttestationPayload(
  action: string
): Promise<AttestationPayload> {
  const [{ mcc, mnc }, city] = await Promise.all([readCarrier(), readCity()]);

  return {
    action,
    at: Date.now(),
    mcc,
    mnc,
    city,
    isRooted: false,
    isEmulator: false,
    usbDebug: false,
  };
}
