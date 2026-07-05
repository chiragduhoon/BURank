import * as crypto from "crypto";

// Admin session cookie: an HMAC over a fixed label, keyed by the server
// secret. Unforgeable without the secret, verifiable on any serverless
// instance, and invalidated by rotating NEXTAUTH_SECRET or ADMIN_PASSWORD.

function signingKey(): string {
  // Tie the token to both secrets so changing the admin password
  // invalidates existing admin sessions too.
  return `${process.env.NEXTAUTH_SECRET ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`;
}

export function createAdminToken(): string {
  return crypto
    .createHmac("sha256", signingKey())
    .update("burank-admin-v1")
    .digest("hex");
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = createAdminToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare anyway against self to keep timing uniform, then fail.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
