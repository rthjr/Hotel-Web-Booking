import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    // Modify the session object to include additional user details
    async session({ session, token }) {
      // Ensure that user-specific properties are added to the session object
      if (token) {
        session.user.lastName = token.lastName || "Doe"; // Default to "Doe" if not provided
        session.user.role = token.role || "user"; // Include role if present in the token
      }
      return session;
    },

    // Add custom fields to the JWT token during login
    async jwt({ token, user }) {
      if (user) {
        // Set fields during the login phase
        token.lastName = user.lastName || "Doe"; // Default to "Doe"
        token.role = user.role || "user"; // Default to "user"
      }
      return token;
    },

    // Redirect users after login or other actions
    async redirect({ url, baseUrl }) {
      // Always redirect users to the base URL after authentication
      return baseUrl;
    }
  },

  // Set the session strategy to JSON Web Token (JWT)
  session: {
    strategy: "jwt", // JWT-based session storage
    maxAge: 30 * 24 * 60 * 60, // Set session expiration to 30 days
    updateAge: 24 * 60 * 60, // Update the JWT every 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };