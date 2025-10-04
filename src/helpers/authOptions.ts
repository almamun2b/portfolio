import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Email or password is missing");
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          if (!res?.ok) {
            console.error("User login failed", await res.text());
            return null;
          }
          const user = await res.json();
          if (user.success) {
            return {
              id: user.data?.id,
              name: user?.data.name,
              email: user.data?.email,
              image: user.data?.picture,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.log("User login failed", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token?.id;
      }
      return session;
    },
    // async signIn({ user, account }) {
    //   if (account?.provider === "google") {
    //     const res = await loginWithGoogle(user); // save user into to backend
    //     if (res?.id) {
    //       return true;
    //     }
    //     return false;
    //   }
    //   return true;
    // },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
