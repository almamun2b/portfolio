// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// Extend Session
declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
    };
  }

  interface User extends DefaultUser {
    id?: string;
  }
}

// Extend JWT
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
