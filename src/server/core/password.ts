import "server-only";
import { hash, verify } from "@node-rs/argon2";
import { ARGON2_PARAMS } from "@/lib/auth/password-params";

export function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_PARAMS);
}

export async function verifyPassword(
  passwordHash: string,
  password: string,
): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | undefined;

/**
 * Burns the same time as a real check. Called when the email is unknown (or
 * the account has no password) so response time doesn't reveal which emails
 * exist.
 */
export async function verifyDummy(password: string): Promise<void> {
  dummyHash ??= hashPassword("timing-equaliser-not-a-real-password");
  await verifyPassword(await dummyHash, password);
}
