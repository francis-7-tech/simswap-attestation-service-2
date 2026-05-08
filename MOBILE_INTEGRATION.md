# SIM-Swap Attestation — Mobile Integration Guide

This document is the contract between the mobile app and the attestation service. It covers every endpoint the mobile team needs to call, the exact request/response shapes, the on-device responsibilities, and the end-to-end flow.

---

## 1. Environment

| Env | Base URL |
|---|---|
| Local | `http://localhost:8081` (or `:8080` when free) |
| Staging | _TBD_ |
| Production | _TBD_ |

All endpoints are under the prefix **`/api/v1`**.

Interactive docs:
- Swagger UI: `${BASE_URL}/swagger-ui/index.html`
- OpenAPI JSON: `${BASE_URL}/v3/api-docs`

---

## 2. End-to-end flow

```
┌──────────────┐                       ┌──────────────────┐
│  Mobile App  │                       │   Attestation    │
│              │                       │     Service      │
└──────┬───────┘                       └────────┬─────────┘
       │                                        │
       │  1. POST /auth/signup  (or /login)     │
       │ ─────────────────────────────────────▶ │
       │  ◀──── { token, userId, deviceUuid }   │
       │                                        │
       │  2. (one-time) Generate RSA keypair    │
       │     in secure hardware (Keystore /     │
       │     Keychain), submit public key       │
       │     during enrollment                  │
       │                                        │
       │  3. GET /attest/challenge?deviceUuid=… │
       │ ─────────────────────────────────────▶ │
       │  ◀──── { challenge: "<uuid>" }         │
       │                                        │
       │  4. Sign (challenge + payload) with    │
       │     the device private key. Never      │
       │     send the private key off-device.   │
       │                                        │
       │  5. POST /attest/verify                │
       │     { deviceUuid, challenge, payload,  │
       │       signatureBase64 }                │
       │ ─────────────────────────────────────▶ │
       │  ◀──── { decision, reason }            │
       │                                        │
```

The decision the mobile app must handle:
- `ALLOW`     — proceed with the protected action.
- `CHALLENGE` — SIM card changed since last attestation; ask the user to re-prove ownership (OTP, biometric, etc.).
- `HIGH_RISK` — block the request and surface a security message; device looks rooted/emulated or geo/IP mismatch.
- `DENY`      — block the request; signature invalid or device not enrolled.

---

## 3. Authentication

A successful `/auth/signup` or `/auth/login` returns a **JWT** valid for 1 hour. Send it on subsequent calls as:

```
Authorization: Bearer <token>
```

The JWT claims:

| Claim | Meaning |
|---|---|
| `sub` | userId (UUID) |
| `email` | user's email |
| `deviceUuid` | the device this user is bound to |
| `iat`, `exp` | issued-at and expiry (epoch seconds) |

> ⚠️ The current build does **not yet** enforce JWTs on `/attest/*` routes server-side. Mobile should still attach the header — server enforcement is coming.

---

## 4. Endpoints

All bodies are JSON. All Content-Types are `application/json`.

### 4.1 `POST /api/v1/auth/signup`

Register a new user bound to a `deviceUuid`.

**Request**

```json
{
  "email": "alice@example.com",
  "password": "password123",
  "deviceUuid": "device-alice-001"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✅ | Lowercased server-side, must be unique |
| `password` | string | ✅ | Minimum 8 characters |
| `deviceUuid` | string | ✅ | Stable per-install identifier (see §6) |

**Response — 200**

```json
{
  "userId": "c904c8e0-6a37-4ab3-acaa-52408ad675e5",
  "email": "alice@example.com",
  "deviceUuid": "device-alice-001",
  "token": "eyJhbGciOiJIUzM4NCJ9.....",
  "expiresInMs": 3600000
}
```

**Errors**

| Status | Body | Cause |
|---|---|---|
| 400 | `{ "error": "email, password (>=8 chars), and deviceUuid are required" }` | Validation failed |
| 409 | `{ "error": "Email already registered" }` | Email already exists |

---

### 4.2 `POST /api/v1/auth/login`

Authenticate an existing user.

**Request**

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response — 200**

Same shape as `/signup` (returns a fresh JWT).

**Errors**

| Status | Body | Cause |
|---|---|---|
| 401 | `{ "error": "Invalid credentials" }` | Bad email or password |

---

### 4.3 `GET /api/v1/attest/challenge`

Issue a one-time challenge token that the device must sign. Challenges expire after 60 seconds.

**Request**

Query string only — no body.

```
GET /api/v1/attest/challenge?deviceUuid=device-alice-001
```

| Param | Type | Required | Notes |
|---|---|---|---|
| `deviceUuid` | string | ✅ | Must be an enrolled device |

**Response — 200**

```json
{
  "challenge": "af57e07e-3b86-4452-a66b-f28e9d8e3303"
}
```

> Each challenge is single-use. Generate a new one for every protected action.

---

### 4.4 `POST /api/v1/attest/verify`

The main route. Verifies the device signature, then runs the fraud-decision engine.

**Request**

```json
{
  "deviceUuid": "device-alice-001",
  "challenge": "af57e07e-3b86-4452-a66b-f28e9d8e3303",
  "payload": "{\"action\":\"transfer\",\"amount\":100}",
  "signatureBase64": "Zx3R/BpESVefcF74nJHuBP87S8A0gZxo2x/TAxM5xse..."
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `deviceUuid` | string | ✅ | Enrolled device |
| `challenge` | string | ✅ | The exact challenge returned by `/challenge` |
| `payload` | string | ✅ | The request payload the user is attesting to (see §5) |
| `signatureBase64` | string | ✅ | Base64 RSA-SHA256 signature over `challenge + payload` bytes (UTF-8) |

**Response — 200 (always 200; check the `decision` field)**

```json
{ "decision": "ALLOW",     "reason": "Verified device" }
{ "decision": "CHALLENGE", "reason": "The SIM card of this device has changed ..." }
{ "decision": "HIGH_RISK", "reason": "City/IP mismatch and device rooted/emulated ..." }
{ "decision": "DENY",      "reason": "Invalid device signature" }
```

> The HTTP status is **always 200** for this endpoint. Branch on `decision`, not on status.

---

## 5. What the mobile app actually does

### 5.1 One-time setup, on first launch

1. Generate an **RSA-2048** keypair inside secure hardware:
   - **Android** — `KeyPairGenerator.getInstance("RSA", "AndroidKeyStore")` with `setUserAuthenticationRequired(false)` (or `true` if you want biometric-bound).
   - **iOS** — `SecKeyCreateRandomKey` with `kSecAttrTokenIDSecureEnclave` (use EC if you switch off RSA — see §7).
2. Generate a stable `deviceUuid`:
   - Android: a UUID stored in EncryptedSharedPreferences.
   - iOS: `identifierForVendor` or a UUID in Keychain (survives reinstall on iOS).
3. Export the public key as Base64 (X.509 SubjectPublicKeyInfo, the JDK default).
4. Submit it via `/auth/signup` (which currently only stores `deviceUuid` — the public-key registration endpoint is being added; until then use the simulator endpoints in §8 for testing only).

### 5.2 Per-protected-request

```text
1. challenge = GET /attest/challenge?deviceUuid=<uuid>
2. payload   = canonical JSON of the action (e.g. {"action":"transfer","amount":100})
3. data      = challenge.bytes(UTF-8) || payload.bytes(UTF-8)
4. signature = SHA256withRSA(data, devicePrivateKey)  // signs `data`, returns bytes
5. POST /attest/verify with deviceUuid, challenge, payload, base64(signature)
6. switch on response.decision
```

### 5.3 Payload canonicalization

The exact bytes you sign **must** match the bytes the server signs over. Rules:

- Always send the same JSON string in `payload` that you fed into the signer. Do **not** re-serialize on the network layer.
- Recommended: build the JSON once as a string, sign that string's UTF-8 bytes, then send that same string in the `payload` field.
- Avoid pretty-printing, sort keys, and use UTF-8 throughout.

---

## 6. `deviceUuid` requirements

- Generated once and persisted across app launches.
- Stable across login/logout (it identifies the **device**, not the user).
- Reset only on full app reinstall.
- Lowercase UUIDv4 is recommended, but any string is accepted.

---

## 7. Crypto details

| Item | Value |
|---|---|
| Key algorithm | RSA-2048 (RS256 / `SHA256withRSA`) |
| Public-key encoding | X.509 SubjectPublicKeyInfo, Base64 (no PEM headers) |
| Signature algorithm | `SHA256withRSA` |
| Signature encoding | Base64 (standard, not URL-safe) |
| Bytes signed | `challenge.UTF8 || payload.UTF8` (no separator, no length prefix) |

Reference signing code:

**Android (Kotlin)**
```kotlin
val sig = Signature.getInstance("SHA256withRSA").apply {
    initSign(privateKey)
    update(challenge.toByteArray(Charsets.UTF_8))
    update(payload.toByteArray(Charsets.UTF_8))
}.sign()
val signatureBase64 = Base64.encodeToString(sig, Base64.NO_WRAP)
```

**iOS (Swift)**
```swift
let data = (challenge + payload).data(using: .utf8)!
var error: Unmanaged<CFError>?
guard let sig = SecKeyCreateSignature(
    privateKey, .rsaSignatureMessagePKCS1v15SHA256, data as CFData, &error
) as Data? else { throw error!.takeRetainedValue() }
let signatureBase64 = sig.base64EncodedString()
```

---

## 8. Test-only simulator endpoints

These exist so backend developers can exercise the full flow without a real device. **Do not call from the production app.**

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/v1/test/simulate-enroll` | Generates a server-side keypair for a `deviceUuid` and stores it |
| `POST` | `/api/v1/test/simulate-sign` | Signs `challenge + payload` with the stored private key |
| `POST` | `/api/v1/testD/simulate-signature` | One-shot: generate keypair, save device, sign, return signature + public key |

Bodies and responses match the patterns in §4. Detail in Swagger UI.

---

## 9. Error handling matrix

| Code | When | Mobile behavior |
|---|---|---|
| 400 | Validation error on signup | Show the message; let user retry |
| 401 | Wrong password / expired JWT | Force re-login |
| 409 | Email already registered | Send to login screen |
| 200 + `decision=ALLOW` | Happy path | Proceed |
| 200 + `decision=CHALLENGE` | SIM swap suspected | Trigger step-up auth flow |
| 200 + `decision=HIGH_RISK` | Rooted / emulator / geo mismatch | Block + show security message |
| 200 + `decision=DENY` | Bad signature, missing challenge, unknown device | Block + log; request a fresh challenge & retry once |
| 5xx | Service down | Retry with exponential backoff (max 3) |

---

## 10. Security do's and don'ts

✅ Generate the keypair in hardware-backed storage. Never export the private key.
✅ Use a fresh challenge per request — don't cache.
✅ Pin the TLS certificate on production builds.
✅ On `HIGH_RISK`, lock the user out of sensitive actions and force re-attestation.

❌ Don't store the JWT in unencrypted shared prefs / `UserDefaults`. Use Keychain/Keystore.
❌ Don't reuse signatures across requests.
❌ Don't sign on the server (the simulator endpoints exist for backend tests only).
❌ Don't roll your own hashing — use `SHA256withRSA` exactly.

---

## 11. Quick curl reference

```bash
BASE=http://localhost:8081/api/v1

# 1. Signup
curl -X POST "$BASE/auth/signup" \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"password123","deviceUuid":"device-alice-001"}'

# 2. Login
curl -X POST "$BASE/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"password123"}'

# 3. Get challenge
curl "$BASE/attest/challenge?deviceUuid=device-alice-001"

# 4. Verify (signature comes from the device, see §5)
curl -X POST "$BASE/attest/verify" \
  -H 'Content-Type: application/json' \
  -d '{
    "deviceUuid":"device-alice-001",
    "challenge":"<from step 3>",
    "payload":"{\"action\":\"transfer\",\"amount\":100}",
    "signatureBase64":"<base64 sig>"
  }'
```

---

## 12. Open items / known gaps

- A production `/attest/enroll` endpoint that accepts the **device's** public key is not yet wired (currently commented out in `AttestationController`). Until it is, real-device enrollment is not possible — the simulator endpoints stand in.
- `/attest/verify` returns HTTP 200 even for unknown devices (with `decision=DENY`). Branch on the body, not the status.
- JWT enforcement on `/attest/*` is not yet active. Send the header anyway so you don't have to change the client when it's turned on.
- `verify` returns `decision=DENY` with reason `"Invalid device signature"` for both invalid signatures **and** fraud-engine denials. Server logging will be improved to disambiguate.

---

_Last updated: 2026-05-07_
