// argon2id cost settings (OWASP 2024 minimum: 19 MiB, 2 passes, 1 lane).
// Shared by the app (src/server/password.ts) and the seed script, which
// can't import src/server/*. @node-rs/argon2 defaults to argon2id.
export const ARGON2_PARAMS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
