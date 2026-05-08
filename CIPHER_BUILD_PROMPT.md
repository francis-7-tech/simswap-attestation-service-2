# Cipher — Mobile App Build Brief

> A SIM-swap fraud detection mobile banking app powered by cryptographic device attestation and behavioural risk scoring. Built in React Native (Expo) + TypeScript + NativeWind. This document is the complete build spec — read it top to bottom before writing code.

---

## 1. Role & Mindset

You are a **senior design engineer + senior mobile engineer**. You ship like someone who has worked on Cash App, Linear, and Vercel. You care about:

- Pixel discipline. 1px never reads as 2px. Spacing is on a system, not eyeballed.
- Motion that feels native to iOS — damped springs, not linear easing. Every press has feedback.
- Type-safe everywhere. `any` is a smell. Discriminated unions for API responses.
- File structure that scales. No 800-line components.
- Restraint. The app has one accent color, used precisely. Nothing decorative.

You are NOT building a generic banking app. You are building a security-first surface where the **device trust score is the hero**, not the account balance.

---

## 2. Product Vision (One Paragraph)

Cipher is a mobile banking demo that detects SIM-swap fraud before the first naira moves. Every session runs a behavioural and device-signal pipeline. Every sensitive action is signed by a device-bound keypair and verified server-side. When something looks off — a recently swapped SIM, a new device fingerprint, an off-pattern typing cadence — Cipher pauses transactions and walks the user through a step-up flow. The product is a thesis-grade demonstration of multi-layered fraud defence on a mobile banking surface.

---

## 3. Design Language

### 3.1 Reference brands (study these before designing)

| Brand | What we steal |
|---|---|
| **Cash App** | Hero numerical typography on pure black. Bold, confident, unapologetic scale. |
| **Vercel** | Engineered dark — tight kerning, OKLCH gray ladders, surgical color use. |
| **Apple** | Restraint, generous blackspace, one hero per screen, system grays do the heavy lifting. |
| **Bolt** | One signature accent on pure black. Used precisely. Memorable. |
| **Airbnb** | Soft 12–16px radii, warm copy, prevents the app from feeling cold/surveillance. |
| **DoorDash** | Confident full-width CTAs. Zero hedging in button labels. |
| **PayPal** | Visible-but-quiet trust signals (verified badges, attestation indicators). |

### 3.2 Design principles

1. **Trust score is the hero.** Bigger than balance. Bigger than anything.
2. **Lowercase typography**, except for acronyms (SIM, TIRMS, JWT) and proper nouns.
3. **Status dots, not status pills.** 6px colored dots whisper. Pills shout. We whisper at scale.
4. **Mint accent is brand-only.** Never used to communicate "safe" — we have green for that. The semantic system stays clean.
5. **Soft red, not OSHA red.** `#FF4D4D`, not `#FF0000`. Pure red vibrates uncomfortably on black.
6. **Letter-spaced micro-labels** (0.12em tracking, 11px, color-tertiary) for section headers. The Apple/Vercel move.

### 3.3 Color tokens

```ts
// Surfaces
canvas:           '#000000'  // pure black, no compromise
surface-1:        '#0A0A0A'  // elevated cards, list items
surface-2:        '#141414'  // modals, bottom sheets
border-subtle:    '#1F1F1F'  // dividers, card borders
border-strong:    '#2A2A2A'  // input fields, secondary buttons

// Text
text-primary:     '#FAFAFA'  // off-white, easier on eyes than #FFF
text-secondary:   '#A3A3A3'  // body copy, captions
text-tertiary:    '#525252'  // micro-labels, metadata

// Brand
accent:           '#00F5D4'  // electric mint, signature color
accent-dim:       'rgba(0, 245, 212, 0.08)'   // tinted backgrounds
accent-border:    'rgba(0, 245, 212, 0.25)'   // tinted borders

// Functional status (NEVER used for brand)
status-safe:      '#22C55E'  // verified, all good
status-warning:   '#F59E0B'  // elevated risk, step-up needed
status-critical:  '#FF4D4D'  // blocked, SIM-swap detected
```

### 3.4 Typography

- Family: **Inter** (load via `expo-font`) for everything. Tabular-nums variant for numbers.
- Weights: **400** (regular) and **500** (medium). That's it. No 600, no 700. Use scale and color for hierarchy, not weight.
- Sizes: hero 64px, display 32px, h1 24px, h2 18px, body 14–15px, caption 12px, micro 11px.
- Letter-spacing: `-0.04em` on hero numbers, `-0.02em` on display, `0` on body, `+0.12em` on micro-labels.
- Line height: 1 on hero/display, 1.2–1.3 on headings, 1.5 on body.

### 3.5 Spacing scale (in NativeWind units, 1 = 4px)

`1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24` — stick to these. No `7`, no `13`.

### 3.6 Border radii

- `rounded-md` → 8px (inputs, small components)
- `rounded-lg` → 12px (cards, surfaces, buttons)
- `rounded-xl` → 16px (sheets, large cards)
- `rounded-full` → pills, avatars

---

## 4. Tech Stack (exact)

```
expo                     ~51.0.0    (or latest stable)
expo-router              ~3.5.0
react-native             0.74.x
typescript               ^5.3.0     (strict mode, noUncheckedIndexedAccess: true)
nativewind               ^4.0.36
tailwindcss              ^3.4.0
react-native-reanimated  ~3.10.0    (animations)
react-native-gesture-handler ~2.16.0
expo-haptics             ~13.0.0    (Apple-style feedback)
expo-secure-store        ~13.0.0    (JWT + device key storage)
expo-crypto              ~13.0.0    (UUID, hashing)
expo-font                ~12.0.0    (Inter)
expo-splash-screen       ~0.27.0
expo-status-bar          ~1.12.0
react-native-svg         15.2.0
react-native-svg-transformer ^1.3.0  (import .svg as components)
phosphor-react-native    ^2.1.0     (icon set — NO lucide, NO emoji)
zustand                  ^4.5.0     (state)
axios                    ^1.6.0     (api client)
react-native-reanimated-carousel ^3.5.1  (onboarding)
```

**Why Phosphor over Lucide:** multi-weight (Regular, Bold, Light, Duotone) gives you a richer hierarchy on dark surfaces. Reads more premium.

---

## 5. Setup

```bash
# 1. Bootstrap
npx create-expo-app@latest cipher --template blank-typescript
cd cipher

# 2. Router + core
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install react-native-screens react-native-safe-area-context

# 3. Styling
npm install nativewind@^4.0.36
npm install -D tailwindcss@^3.4.0 prettier-plugin-tailwindcss

# 4. Animations + gestures + haptics
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install expo-haptics expo-secure-store expo-crypto expo-font expo-splash-screen

# 5. SVG
npx expo install react-native-svg
npm install -D react-native-svg-transformer

# 6. Icons
npm install phosphor-react-native

# 7. Carousel
npm install react-native-reanimated-carousel

# 8. State + http
npm install zustand axios

# 9. Utility
npm install dayjs clsx tailwind-merge
```

**`metro.config.js`** — register the SVG transformer:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = withNativeWind(config, { input: './global.css' });
```

**`babel.config.js`**:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: ['react-native-reanimated/plugin'], // must be last
  };
};
```

**`tsconfig.json`** path aliases:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts"]
}
```

**Declare SVG module type** — create `types/svg.d.ts`:

```ts
declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
```

---

## 6. File Structure

```
cipher/
├── app/                              # expo-router file routes
│   ├── _layout.tsx                   # root layout (fonts, providers, splash gate)
│   ├── index.tsx                     # boot router (decides splash → onboarding/auth/home)
│   ├── (onboarding)/
│   │   ├── _layout.tsx
│   │   └── index.tsx                 # 3-screen carousel
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx               # bottom tab bar
│   │   ├── index.tsx                 # dashboard
│   │   ├── activity.tsx
│   │   ├── security.tsx
│   │   └── profile.tsx
│   └── (modals)/
│       ├── _layout.tsx
│       ├── alert.tsx                 # SIM-swap alert sheet
│       ├── transaction-detail.tsx
│       └── step-up.tsx               # biometric step-up flow
├── components/
│   ├── ui/
│   │   ├── Button.tsx                # primary, secondary, danger variants
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Pressable.tsx             # haptic + scale wrapper for everything tappable
│   │   ├── StatusDot.tsx
│   │   ├── BadgePill.tsx
│   │   ├── MicroLabel.tsx            # tracked uppercase-feel label
│   │   ├── Divider.tsx
│   │   └── BottomSheet.tsx
│   ├── feature/
│   │   ├── TrustScoreHero.tsx        # the big animated number on dashboard
│   │   ├── SignalRow.tsx             # row in the risk-signals card
│   │   ├── TransactionRow.tsx
│   │   ├── DeviceAttestationBadge.tsx
│   │   ├── OnboardingSlide.tsx
│   │   └── PageDots.tsx              # carousel page indicator
│   └── icons/
│       └── index.ts                  # re-export Phosphor icons we use
├── lib/
│   ├── api/
│   │   ├── client.ts                 # axios instance with interceptors
│   │   ├── auth.ts                   # signup, login
│   │   ├── attestation.ts            # enroll, challenge, sign, verify
│   │   └── types.ts                  # request/response types
│   ├── stores/
│   │   ├── auth.store.ts             # zustand: user, jwt, device
│   │   └── risk.store.ts             # zustand: trust score, signals
│   ├── secure-store.ts               # wrapper around expo-secure-store
│   ├── haptics.ts                    # haptic helpers
│   └── cn.ts                         # clsx + tailwind-merge wrapper
├── hooks/
│   ├── useAuth.ts
│   ├── useAttestation.ts
│   ├── useRiskScore.ts
│   └── usePressableScale.ts          # reanimated press-scale hook
├── assets/
│   ├── fonts/
│   │   ├── Inter-Regular.ttf
│   │   └── Inter-Medium.ttf
│   └── svg/
│       ├── logo.svg
│       ├── onboarding-1.svg
│       ├── onboarding-2.svg
│       └── onboarding-3.svg
├── global.css                        # tailwind directives
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
└── app.json
```

---

## 7. Tailwind Config

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        surface: { 1: '#0A0A0A', 2: '#141414' },
        border: { subtle: '#1F1F1F', strong: '#2A2A2A' },
        text: { primary: '#FAFAFA', secondary: '#A3A3A3', tertiary: '#525252' },
        accent: {
          DEFAULT: '#00F5D4',
          dim: 'rgba(0, 245, 212, 0.08)',
          border: 'rgba(0, 245, 212, 0.25)',
        },
        status: { safe: '#22C55E', warning: '#F59E0B', critical: '#FF4D4D' },
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
        micro: '0.12em',
      },
    },
  },
};
```

`global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 8. Backend Integration

Base URL via env: `EXPO_PUBLIC_API_BASE_URL` (set in `.env`, e.g. `http://10.0.2.2:8080` for Android emulator, `http://localhost:8080` for iOS).

### 8.1 Endpoints (already implemented and tested)

| # | Method | Path | Purpose |
|---|---|---|---|
| 1 | POST | `/api/v1/auth/signup` | Create user → `{ userId, jwt }` |
| 2 | POST | `/api/v1/auth/login` | Authenticate → `{ jwt }` |
| 3 | POST | `/api/v1/test/simulate-enroll` | Generate keypair + persist server-side → `{ deviceUuid, publicKeyBase64 }` |
| 4 | GET  | `/api/v1/attest/challenge?deviceUuid=…` | Get a fresh UUID challenge to sign |
| 5 | POST | `/api/v1/test/simulate-sign` | Sign `{challenge, payload}` server-side → `{ signatureBase64 }` |
| 6 | POST | `/api/v1/attest/verify` | Verify signature → `{ decision: "ALLOW"\|"DENY", reason }` |
| 7 | POST | `/api/v1/testD/simulate-signature` | One-shot keygen + sign → `{ publicKeyBase64, signatureBase64 }` |

> **Note:** the `/test/*` and `/testD/*` endpoints exist because the cryptographic operations are simulated server-side for the demo. In a production build you'd replace these with native iOS Secure Enclave / Android Keystore calls. For this thesis demo, we call the test endpoints.

### 8.2 API client (`lib/api/client.ts`)

```ts
import axios, { AxiosError } from 'axios';
import { getToken, clearToken } from '@/lib/secure-store';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10_000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<{ message?: string }>) => {
    if (err.response?.status === 401) await clearToken();
    return Promise.reject({
      status: err.response?.status,
      message: err.response?.data?.message ?? err.message,
    });
  }
);
```

### 8.3 Typed endpoint functions (`lib/api/auth.ts`, `lib/api/attestation.ts`)

```ts
// auth.ts
export const signup = (body: { email: string; password: string; fullName: string }) =>
  api.post<{ userId: string; jwt: string }>('/api/v1/auth/signup', body).then(r => r.data);

export const login = (body: { email: string; password: string }) =>
  api.post<{ jwt: string }>('/api/v1/auth/login', body).then(r => r.data);

// attestation.ts
export const enrollDevice = () =>
  api.post<{ deviceUuid: string; publicKeyBase64: string }>('/api/v1/test/simulate-enroll')
    .then(r => r.data);

export const getChallenge = (deviceUuid: string) =>
  api.get<{ challenge: string }>('/api/v1/attest/challenge', { params: { deviceUuid } })
    .then(r => r.data);

export const simulateSign = (body: { deviceUuid: string; challenge: string; payload: string }) =>
  api.post<{ signatureBase64: string }>('/api/v1/test/simulate-sign', body).then(r => r.data);

export type AttestDecision = { decision: 'ALLOW' | 'DENY'; reason: string };

export const verifyAttestation = (body: {
  deviceUuid: string;
  challenge: string;
  payload: string;
  signatureBase64: string;
}) => api.post<AttestDecision>('/api/v1/attest/verify', body).then(r => r.data);
```

### 8.4 Auth flow

1. **Signup/Login** → receive JWT → store in SecureStore under `cipher.jwt`.
2. **First-time after signup** → call `enrollDevice()` → store `deviceUuid` and `publicKeyBase64` in SecureStore under `cipher.device`.
3. **On every app launch** → check JWT exists → check device enrolled → route to `/onboarding` (first time), `/auth/login` (logged out), or `/(tabs)` (signed in + enrolled).

### 8.5 Attestation flow (run on every sensitive action)

```
User taps "Authorize transaction"
  ↓
1. getChallenge(deviceUuid) → challenge
2. simulateSign({ deviceUuid, challenge, payload: JSON.stringify(transaction) }) → signature
3. verifyAttestation({ deviceUuid, challenge, payload, signatureBase64 }) → { decision, reason }
  ↓
If ALLOW → proceed, show success. If DENY → show alert sheet, log to risk store.
```

---

## 9. Screens — Detailed Specs

For every screen below: **lowercase headlines**, dark canvas, mint accent only for brand moments, status colors only for status, generous blackspace.

### 9.1 Splash (`app/index.tsx`)

- Pure black canvas. Centered logo SVG (`@/assets/svg/logo.svg`) at 72×72.
- Logo fades in from `opacity: 0, scale: 0.96` → `opacity: 1, scale: 1` over 400ms (ease-out-quad).
- Pulse rings on logo gently expand-and-fade in a 2s loop while we run the auth/device check.
- After the check completes (min 1.2s on screen so it doesn't flash), `router.replace()` to one of:
  - `/(onboarding)` — first launch, no JWT
  - `/(auth)/login` — has device enrolled but no valid JWT
  - `/(tabs)` — signed in + enrolled
- Use `expo-splash-screen` to keep the native splash up until fonts load, then hand off to this in-app splash for the auth-check moment.

### 9.2 Onboarding carousel (`app/(onboarding)/index.tsx`)

Three slides using `react-native-reanimated-carousel`. Each slide:
- Top: SVG illustration centered (240×240), 80px from top.
- Headline (24px, medium, tightest tracking, primary color).
- Subhead (14px, secondary color, line-height 1.5, max-width 320px).
- Bottom: page dots (6px circles, 3 of them — active one is mint and 16px wide pill, others are border-strong color).
- Bottom CTA: full-width primary button. Label changes per slide:
  - Slide 1: `continue`
  - Slide 2: `continue`
  - Slide 3: `get started` → routes to `/(auth)/signup`
- Top-right `skip` text button on slides 1–2 → jumps to `/(auth)/signup`.

**Slide content:**

| # | SVG | Headline | Subhead |
|---|---|---|---|
| 1 | `onboarding-1.svg` | banking that knows your device | every login is checked against your SIM, your fingerprint, and 30+ device signals. swaps get caught the moment they happen. |
| 2 | `onboarding-2.svg` | every transaction, signed | your device holds a private key that signs every sensitive action. servers verify the signature before money moves. no signature, no money. |
| 3 | `onboarding-3.svg` | you're in control | one tap to lock your account if anything looks off. one tap to verify it was really you. no one-time codes to fumble with. |

**Interaction:** swipe horizontally or tap CTA to advance. Page dots animate width-and-color over 240ms damped spring. Subtle parallax on the SVG: as you scroll, illustration moves slightly slower than the text (translateX = scrollX * 0.4).

### 9.3 Signup (`app/(auth)/signup.tsx`)

Stack: keyboard-avoiding view, scrollable.
- Top: small logo (32×32) and `cipher` wordmark.
- Headline: `create your account` (24px, medium).
- Inputs (stacked, 16px gap):
  - `full name`
  - `email`
  - `password` (with show/hide eye icon)
- Primary CTA: `create account` (full-width).
- Subtle text below: `already have an account? sign in` — sign in is mint.
- On submit: call `signup()` → store JWT → call `enrollDevice()` → store device → push `/(onboarding)` if first-time, else `/(tabs)`.
- Validation: client-side email regex + min 8 char password. Error states shown inline below input in `status-critical`.

### 9.4 Login (`app/(auth)/login.tsx`)

Same shell as signup. Headline: `welcome back`. Two inputs (email, password). CTA: `sign in`. Footer: `new here? create account`.

### 9.5 Dashboard (`app/(tabs)/index.tsx`)

The marquee screen. From top:

1. **Header row** — left: `good evening` (tertiary, 12px) + name (primary, 18px medium). Right: `DeviceAttestationBadge` ("verified" pill with shield-check icon).
2. **Trust score hero** — 32px top padding. `MicroLabel` "device trust score". Then huge number `98` (64px, medium, tightest tracking, primary) with `/100` (28px, tertiary) inline. Below: animated subhead — green dot + "all signals normal" (status-safe, 13px medium). The number is animated on mount via `useAnimatedCounter` hook, ticking from 0 to current value over 900ms (ease-out-cubic).
3. **Two metric cards in a grid** (gap 8px):
   - `balance` → `₦2,847,500`
   - `SIM age` → `2y 4m`
4. **`recent activity` section** — micro-label header. List of `TransactionRow` items separated by `border-subtle` lines. Each row: 32px circle icon (status-tinted bg), title + caption stack, amount on the right.
5. **Floating action button** — bottom-right, mint, 56px, ⚡ Phosphor `<Lightning />` icon for "quick send" (or your preferred). Triggers step-up modal.

**Interactions:**
- Pull-to-refresh refetches trust score + activity. Damped spring overscroll (`progressViewOffset` = 60).
- Trust score number ticks up on mount.
- All rows have `usePressableScale()` (scale 0.97 + light haptic on press).

### 9.6 Activity (`app/(tabs)/activity.tsx`)

- `MicroLabel` "all activity" + filter chip group at top (`all`, `incoming`, `outgoing`, `flagged`).
- Sectioned list grouped by date (`today`, `yesterday`, `this week`, `earlier`).
- Each row is a `TransactionRow`. Tap → push `/(modals)/transaction-detail` with the transaction id.
- Empty state: centered `<Phosphor.Pulse />` icon, tertiary text "no activity yet".

### 9.7 Security (`app/(tabs)/security.tsx`)

The differentiator screen. This is where Cipher proves its thesis.

Sections (each is a `Card`):

1. **device attestation** — Phosphor `<ShieldCheck />` icon, "this device" title, `deviceUuid` truncated, "enrolled 12 days ago" caption, status dot on the right (mint).
2. **active signals** — list of detection layers, each with status:
   - `SIM swap monitor` — `status-safe` dot — "no swaps detected"
   - `device fingerprint` — `status-safe` dot — "matches enrollment"
   - `behavioural baseline` — `status-safe` dot — "consistent with profile"
   - `network risk` — `status-warning` dot — "unfamiliar wifi"
3. **recent security events** — short list of events with timestamps.
4. **danger zone** — single button: `lock all transactions` (transparent, status-critical text + border).

### 9.8 Profile (`app/(tabs)/profile.tsx`)

Avatar + name + email. List of rows: `account details`, `notifications`, `appearance`, `help`, `sign out`. Sign out is critical-colored. Tap → clear SecureStore → router replace `/(auth)/login`.

### 9.9 SIM-swap alert sheet (`app/(modals)/alert.tsx`)

Presented as a bottom sheet from any screen. Triggered when `verifyAttestation` returns `DENY` or when a `simulate-enroll` reveals a SIM age anomaly.

Layout:
- Big circular icon (72px) with status-critical tint background, Phosphor `<ShieldX />` 36px inside.
- Micro-label `critical alert` (status-critical, tracked).
- Headline `SIM swap detected` (24px medium).
- Body: "your SIM was reissued 14 minutes ago. all transactions are paused."
- `risk signals` card (surface-1, border-subtle) listing 3 signals with status dots and timestamps.
- Two stacked buttons:
  - Primary mint: `lock account and verify` → triggers step-up flow.
  - Secondary outlined: `it was me` → calls a "self-attest" endpoint (placeholder for now).

**Animation:** sheet slides up with damped spring (`damping: 20, stiffness: 250`). Backdrop fades to 0.6 opacity. Heavy haptic on present (`Haptics.notificationAsync(Warning)`).

### 9.10 Transaction detail (`app/(modals)/transaction-detail.tsx`)

Half-sheet. Shows: amount (hero), counterparty, timestamp, status, risk score for this transaction (mini gauge), signal breakdown. Footer: `flag as fraud` (critical) and `it's fine` (secondary).

### 9.11 Step-up (`app/(modals)/step-up.tsx`)

Full-screen modal. Center: large fingerprint icon, headline "verify it's you", subtext "we need a fresh signature for this action". Primary button: `use biometric` (calls device-local biometric via `expo-local-authentication`), then runs the attestation flow (challenge → sign → verify). On success: dismiss with success toast. On fail: show inline error and offer retry.

---

## 10. Component Library

Build these as the foundation. Every screen composes from these.

### 10.1 `<Pressable>` — the base interactive

Every tappable in the app uses this. NEVER use raw `TouchableOpacity` or RN `Pressable` directly.

```tsx
// components/ui/Pressable.tsx
import { Pressable as RNPressable, PressableProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

type Props = PressableProps & {
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
  scale?: number;
};

export function Pressable({ haptic = 'light', scale = 0.97, onPress, children, ...rest }: Props) {
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={() => { s.value = withSpring(scale, { damping: 15, stiffness: 350 }); }}
      onPressOut={() => { s.value = withSpring(1, { damping: 15, stiffness: 350 }); }}
      onPress={(e) => {
        if (haptic !== 'none') {
          const map = {
            light: Haptics.ImpactFeedbackStyle.Light,
            medium: Haptics.ImpactFeedbackStyle.Medium,
            heavy: Haptics.ImpactFeedbackStyle.Heavy,
          };
          Haptics.impactAsync(map[haptic]);
        }
        onPress?.(e);
      }}
      style={style}
    >
      {children}
    </AnimatedPressable>
  );
}
```

### 10.2 `<Button>`

Variants: `primary` (mint bg, black text), `secondary` (transparent, border-strong), `danger` (transparent, status-critical text + border), `ghost` (text only, mint).
Sizes: `lg` (h-14, full-width default), `md` (h-12), `sm` (h-9). Loading state: spinner replaces label, button stays at same width.

### 10.3 `<MicroLabel>`

```tsx
<Text className="text-text-tertiary text-[11px] font-medium tracking-[0.12em]">
  {children.toLowerCase()}
</Text>
```

### 10.4 `<TrustScoreHero>`

Animated counter component. Takes `score: number`. Tick animation on mount (0 → score over 900ms), spring-damped if it changes after mount. Below the number, conditional subhead based on score range:
- `>= 90` → green dot + "all signals normal"
- `70–89` → amber dot + "minor anomalies"
- `< 70` → red dot + "elevated risk"

### 10.5 `<StatusDot size={6} variant="safe" | "warning" | "critical" | "neutral" />`

Tiny but used everywhere. Pulse animation on `critical`.

### 10.6 `<Card>`

Surface-1 background, border-subtle, rounded-lg, padding 16px (or `compact` for 12px).

### 10.7 `<TransactionRow>`

32px circle icon (status-tinted), two-line stack (title + meta), right-aligned amount. Pressable wraps the whole thing.

### 10.8 `<SignalRow>`

6px status dot, label, optional timestamp on right. Used in the alert sheet's signals card.

### 10.9 `<DeviceAttestationBadge>`

Pill: mint-tinted bg, mint border at 0.25 opacity, shield-check Phosphor icon, "verified" label. 11px text, mint color. Lives in dashboard header.

### 10.10 `<BottomSheet>`

Wrapper using `@gorhom/bottom-sheet` or your own with Reanimated. Surface-2 bg, rounded-xl top corners only. Backdrop: rgba(0,0,0,0.6). Snap points: configurable.

### 10.11 `<PageDots count={3} active={index} />`

Three dots, 6px each, gap 6px. Active dot becomes a 16×6 pill in mint with width animation (spring, damping 18).

---

## 11. Animation Patterns (Apple-style)

Use these idioms consistently. No CSS-style ease-in-out. No linear. Damped springs only.

### 11.1 Standard spring

`withSpring(target, { damping: 15, stiffness: 250 })` — the Cipher house spring. Use it for almost everything.

### 11.2 Gentle entry

`withTiming(target, { duration: 400, easing: Easing.bezier(0.16, 1, 0.3, 1) })` — Apple's "ease-out-expo" curve. Use for screen-entry fades.

### 11.3 Number ticker

Build a `useAnimatedCounter(target, durationMs)` hook using `withTiming` on a shared value, formatting each frame to integer.

### 11.4 Layout transitions

Wrap dynamic lists/cards in `Animated.View` with `layout={LinearTransition.springify()}` to get free smooth re-layouts when items add/remove or change height.

### 11.5 Haptic palette

| Action | Haptic |
|---|---|
| Tab change, button press | Light impact |
| Card press, list select | Light impact |
| Sheet present | Medium impact |
| Critical alert appear | Warning notification |
| Successful attestation | Success notification |
| Verification fails | Error notification |

### 11.6 Carousel parallax

In the onboarding carousel, the SVG illustration translates at 0.4× the page scroll velocity vs. the headline text. Page dots animate width on focus change.

### 11.7 Trust score pulse

When the score is below 70, the number itself gets a subtle 1.0 → 1.02 pulse loop (2s, ease-in-out). Critical states should breathe.

---

## 12. SVG Assets

Write these four files exactly as below into `assets/svg/`. They're imported as React components via the SVG transformer (`import Logo from '@/assets/svg/logo.svg'`).

### 12.1 `assets/svg/logo.svg`

```svg
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 4L56 18V46L32 60L8 46V18L32 4Z" stroke="#00F5D4" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="32" cy="32" r="3.5" fill="#00F5D4"/>
  <circle cx="32" cy="32" r="9" stroke="#00F5D4" stroke-width="1.5" stroke-opacity="0.6"/>
  <circle cx="32" cy="32" r="15" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.3"/>
</svg>
```

### 12.2 `assets/svg/onboarding-1.svg` — SIM swap detection

```svg
<svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="140" cy="140" r="120" stroke="#1F1F1F" stroke-width="1"/>
  <circle cx="140" cy="140" r="90" stroke="#1F1F1F" stroke-width="1"/>
  <circle cx="140" cy="140" r="60" stroke="#1F1F1F" stroke-width="1"/>
  <rect x="55" y="105" width="60" height="70" rx="6" stroke="#00F5D4" stroke-width="2" fill="#00F5D4" fill-opacity="0.08"/>
  <rect x="63" y="120" width="44" height="20" rx="2" fill="#00F5D4" fill-opacity="0.4"/>
  <line x1="63" y1="135" x2="107" y2="135" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.6"/>
  <line x1="85" y1="120" x2="85" y2="155" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.6"/>
  <line x1="63" y1="155" x2="107" y2="155" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.6"/>
  <rect x="165" y="105" width="60" height="70" rx="6" stroke="#FF4D4D" stroke-width="2" fill="#FF4D4D" fill-opacity="0.05" stroke-dasharray="4 4"/>
  <rect x="173" y="120" width="44" height="20" rx="2" fill="#FF4D4D" fill-opacity="0.3"/>
  <line x1="173" y1="135" x2="217" y2="135" stroke="#FF4D4D" stroke-width="1" stroke-opacity="0.5"/>
  <line x1="195" y1="120" x2="195" y2="155" stroke="#FF4D4D" stroke-width="1" stroke-opacity="0.5"/>
  <line x1="173" y1="155" x2="217" y2="155" stroke="#FF4D4D" stroke-width="1" stroke-opacity="0.5"/>
  <path d="M120 135 L160 135" stroke="#A3A3A3" stroke-width="1.5" stroke-dasharray="3 3"/>
  <path d="M120 145 L160 145" stroke="#A3A3A3" stroke-width="1.5" stroke-dasharray="3 3"/>
  <line x1="40" y1="210" x2="240" y2="210" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.4"/>
  <circle cx="140" cy="210" r="4" fill="#00F5D4"/>
</svg>
```

### 12.3 `assets/svg/onboarding-2.svg` — cryptographic signing

```svg
<svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M140 40L220 90V190L140 240L60 190V90L140 40Z" stroke="#1F1F1F" stroke-width="1"/>
  <path d="M140 70L195 105V175L140 210L85 175V105L140 70Z" stroke="#1F1F1F" stroke-width="1"/>
  <circle cx="140" cy="140" r="36" stroke="#00F5D4" stroke-width="2" fill="#00F5D4" fill-opacity="0.06"/>
  <circle cx="140" cy="140" r="6" fill="#00F5D4"/>
  <path d="M115 140 L122 140 L125 130 L130 150 L135 125 L140 155 L145 130 L150 145 L155 140 L162 140" stroke="#00F5D4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="60" cy="90" r="3" fill="#00F5D4" fill-opacity="0.6"/>
  <circle cx="220" cy="90" r="3" fill="#00F5D4" fill-opacity="0.6"/>
  <circle cx="60" cy="190" r="3" fill="#00F5D4" fill-opacity="0.6"/>
  <circle cx="220" cy="190" r="3" fill="#00F5D4" fill-opacity="0.6"/>
  <line x1="115" y1="125" x2="80" y2="100" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.3"/>
  <line x1="165" y1="125" x2="200" y2="100" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.3"/>
  <line x1="115" y1="155" x2="80" y2="180" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.3"/>
  <line x1="165" y1="155" x2="200" y2="180" stroke="#00F5D4" stroke-width="1" stroke-opacity="0.3"/>
</svg>
```

### 12.4 `assets/svg/onboarding-3.svg` — biometric control

```svg
<svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M140 40C140 40 80 55 80 80V150C80 195 140 230 140 230C140 230 200 195 200 150V80C200 55 140 40 140 40Z" stroke="#00F5D4" stroke-width="2" fill="#00F5D4" fill-opacity="0.04"/>
  <path d="M115 130 Q140 110 165 130" stroke="#00F5D4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M105 145 Q140 115 175 145" stroke="#00F5D4" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-opacity="0.7"/>
  <path d="M115 160 Q140 140 165 160" stroke="#00F5D4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M125 175 Q140 165 155 175" stroke="#00F5D4" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-opacity="0.7"/>
  <circle cx="140" cy="155" r="3" fill="#00F5D4"/>
  <circle cx="190" cy="80" r="20" fill="#0A0A0A" stroke="#00F5D4" stroke-width="2"/>
  <path d="M180 80 L188 88 L200 74" stroke="#00F5D4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
```

---

## 13. Iconography

Use **`phosphor-react-native`** exclusively. NO Lucide. NO emoji. No mixing of icon sets.

Recommended icons (centralize in `components/icons/index.ts`):

```ts
export {
  ShieldCheck, ShieldX, ShieldWarning,
  Fingerprint, LockKey, Key,
  ArrowDownLeft, ArrowUpRight, ArrowsLeftRight,
  Pulse, Lightning, Bell,
  Eye, EyeSlash,
  CaretRight, CaretDown, X,
  Gear, User, House,
  WifiHigh, BatteryHigh,
} from 'phosphor-react-native';
```

Default icon weight: `regular`. Use `bold` for active tab icons. Use `duotone` sparingly for hero illustration moments. Color: pass `color="#FAFAFA"` or status colors as needed. Size: 16px inline, 20px in tab bar, 24px in card headers, 36px+ for hero moments.

---

## 14. State Management (Zustand)

### `lib/stores/auth.store.ts`

```ts
type AuthState = {
  jwt: string | null;
  user: { userId: string; email: string; fullName: string } | null;
  device: { deviceUuid: string; publicKeyBase64: string } | null;
  hydrate: () => Promise<void>;        // load from SecureStore on app boot
  setSession: (jwt: string, user: AuthState['user']) => Promise<void>;
  setDevice: (device: AuthState['device']) => Promise<void>;
  signOut: () => Promise<void>;
};
```

### `lib/stores/risk.store.ts`

```ts
type RiskState = {
  trustScore: number;                  // 0–100
  signals: Array<{ id: string; label: string; status: 'safe' | 'warning' | 'critical'; at: number }>;
  lastVerifiedAt: number | null;
  setTrustScore: (n: number) => void;
  pushSignal: (s: Signal) => void;
  reset: () => void;
};
```

---

## 15. Acceptance Criteria

The build is done when:

- [ ] App boots through native splash → in-app splash → correct route based on auth state.
- [ ] Onboarding carousel works on first launch only (skip persists in SecureStore).
- [ ] Signup flow: creates user, stores JWT, enrolls device, persists `deviceUuid`.
- [ ] Login flow: authenticates, stores JWT, routes to dashboard.
- [ ] Dashboard shows animated trust score, balance, SIM age, recent activity.
- [ ] Triggering a "send" action runs the full attestation pipeline (challenge → sign → verify) and shows the verdict.
- [ ] DENY verdict triggers the alert bottom sheet with risk signals + step-up CTA.
- [ ] Step-up flow uses `expo-local-authentication` for biometric.
- [ ] Every tappable surface has scale animation + haptic feedback.
- [ ] All copy is sentence-case (except acronyms). No Title Case. No ALL CAPS in UI copy.
- [ ] No Lucide icons in the codebase. No emoji. Only Phosphor.
- [ ] Strict TypeScript: zero `any`, zero `@ts-ignore`.
- [ ] Splash + onboarding SVGs are imported from `@/assets/svg/*.svg` as React components.
- [ ] Runs at 60fps on a mid-range Android device (test with React DevTools Performance).

---

## 16. Definition of "Senior" (the bar to meet)

When a senior engineer reviews this codebase, they should think:

- "These animations feel native, not bolted on."
- "The component tree is shallow. Every component does one thing."
- "Types are tight. Discriminated unions everywhere they belong."
- "Spacing is on a system. Margins are deliberate."
- "Color is used as semantics, not decoration."
- "I could ship this to TestFlight tomorrow."

If anything feels like a stock RN starter app, it's wrong. Cipher should look and feel like a security product made by people who care about security and design.

---

## 17. Build Order (suggested)

1. Bootstrap project + install all deps + verify Metro/Babel/SVG transformer wiring.
2. Drop the four SVGs into `assets/svg/`. Verify they render via a temporary screen.
3. Tailwind config + global.css + verify NativeWind classes work.
4. Build the component library (`Pressable`, `Button`, `Card`, `MicroLabel`, `StatusDot`, `BadgePill`).
5. Build the splash + onboarding carousel.
6. Wire up SecureStore + zustand auth store + API client.
7. Build signup and login screens with full validation + API integration.
8. Build the (tabs) layout and dashboard with the `TrustScoreHero` component.
9. Build security and activity tabs.
10. Build the alert bottom sheet + step-up modal + transaction detail.
11. Wire up the full attestation pipeline (challenge → sign → verify).
12. Polish: haptics audit, animation pass, empty states, error states, accessibility labels.
13. Test on a real device — iOS and Android — fix anything that doesn't feel premium.

---

**Done. Build it.**
