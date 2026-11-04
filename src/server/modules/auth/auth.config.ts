import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/env";
import {
  SESSION_ABSOLUTE_MS,
  sessionCookieName,
} from "@/lib/auth/session-policy";
import { ADMIN_SIGN_IN } from "@/lib/auth/safe-path";
import { writeAudit } from "@/server/core/audit";
import { logger as appLogger } from "@/server/core/logger";
import { verifyCredentials } from "@/server/modules/auth/auth.service";
import {
  createSession,
  revokeByToken,
  validateSession,
} from "@/server/modules/auth/auth.session";

// Auth.js v5 with the Credentials provider and JWT cookies. The JWT is only
// a pointer: every request re-checks the Session row (revoked, expired, idle,
// user disabled), so sessions can be ended server-side at any time.
// The session cookie has this app's own name (see SESSION_COOKIE_BASE) and
// keeps the Auth.js defaults otherwise: HttpOnly, SameSite=Lax, and Secure
// with the __Secure- prefix over https.

// Over https (every deployment) the cookie is Secure and __Secure- prefixed.
const secureCookies = env.NEXT_PUBLIC_SITE_URL.startsWith("https://");

/** The fields we put in the JWT (Auth.js types its token as an open record). */
interface AppToken {
  /** Raw session token; only ever inside the encrypted cookie. */
  sid?: string;
  /** DB id of the Session row. */
  sessionId?: string;
  uid?: string;
  role?: "ADMIN";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  trustHost: env.AUTH_TRUST_HOST || env.NODE_ENV === "development",
  useSecureCookies: secureCookies,
  cookies: { sessionToken: { name: sessionCookieName(secureCookies) } },
  session: { strategy: "jwt", maxAge: Math.floor(SESSION_ABSOLUTE_MS / 1000) },
  logger: {
    // A cookie we can't decrypt (an old secret) just means "signed out", not
    // a bug, so it is a warning. Everything else keeps Auth.js's own output.
    error(error) {
      if (error.name === "JWTSessionError") {
        appLogger.warn("auth.session.unreadable");
        return;
      }
      console.error(error);
    },
  },
  pages: { signIn: ADMIN_SIGN_IN },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: (credentials) => verifyCredentials(credentials),
    }),
  ],
  callbacks: {
    async jwt({ token: raw, user }) {
      const token = raw as typeof raw & AppToken;
      // `user` is only present on the sign-in call; Auth.js types it as always set.
      const signingIn = user as typeof user | undefined;
      if (signingIn?.id) {
        // Sign-in: open a server-side session and remember its token.
        const created = await createSession(signingIn.id);
        return {
          sub: signingIn.id,
          name: signingIn.name,
          email: signingIn.email,
          uid: signingIn.id,
          role: "ADMIN",
          sid: created.token,
          sessionId: created.sessionId,
        };
      }
      if (!token.sid) return null;
      const valid = await validateSession(token.sid);
      if (!valid) return null;
      return token;
    },
    session({ session, token: raw }) {
      const token = raw as typeof raw & AppToken;
      session.sessionId = token.sessionId ?? "";
      session.user.id = token.uid ?? "";
      session.user.role = token.role ?? "ADMIN";
      return session;
    },
  },
  events: {
    async signOut(message) {
      const sid =
        "token" in message
          ? (message.token as AppToken | null)?.sid
          : undefined;
      if (!sid) return;
      const userId = await revokeByToken(sid);
      if (userId) {
        await writeAudit({
          actorId: userId,
          action: "auth.signout",
          targetType: "user",
          targetId: userId,
        });
      }
    },
  },
});
