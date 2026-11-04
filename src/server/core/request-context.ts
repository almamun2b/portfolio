import "server-only";
import { headers } from "next/headers";

/** Client IP as reported by the platform proxy; "unknown" when absent. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (forwarded ?? h.get("x-real-ip") ?? "unknown").slice(0, 64);
}

export async function getUserAgent(): Promise<string | null> {
  const ua = (await headers()).get("user-agent");
  return ua ? ua.slice(0, 512) : null;
}
