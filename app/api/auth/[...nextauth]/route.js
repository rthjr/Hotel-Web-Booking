//import { connectMongoDB } from "@/lib/mongodb";
//import User from "@/models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { jwtDecode } from "jwt-decode";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials Provider (Email & Password Login)
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        // Authenticate with Laravel backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await res.json();

        if (res.ok && data.access_token) {
          // Decode JWT to get role
          const decoded = jwtDecode(data.access_token);

          return {
            ...data.user, // user info from Laravel
            accessToken: data.access_token,
            role: decoded.role, // role from JWT
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      // Store access token for Google logins
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
