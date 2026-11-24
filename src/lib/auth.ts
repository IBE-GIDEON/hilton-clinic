import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "hc_staff_session";
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// Local development only. In production the portal stays locked until
// ADMIN_PASSCODE and SESSION_SECRET are set, so this public default can never open it.
const DEV_PASSCODE = "hilton2026";
const isProduction = () => process.env.NODE_ENV === "production";

function getPasscode(): string | null {
  if (process.env.ADMIN_PASSCODE) return process.env.ADMIN_PASSCODE;
  return isProduction() ? null : DEV_PASSCODE;
}

function getSecret(): string | null {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  return isProduction() ? null : `hilton-clinics-local-secret-${DEV_PASSCODE}`;
}

function sign(payload: string): string {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET must be set in production.");
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyPasscode(input: string): boolean {
  const passcode = getPasscode();
  if (!passcode || !getSecret()) return false;
  const expected = Buffer.from(passcode);
  const actual = Buffer.from(input.trim());
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export async function createStaffSession(): Promise<void> {
  const exp = String(Date.now() + TTL_MS);
  const sig = sign(exp);
  const store = await cookies();
  store.set(COOKIE_NAME, `${exp}.${sig}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(TTL_MS / 1000),
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearStaffSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isStaffAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!getSecret() || !raw || !raw.includes(".")) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = Buffer.from(sign(exp));
  const actual = Buffer.from(sig);
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}
