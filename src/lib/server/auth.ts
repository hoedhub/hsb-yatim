import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/sveltekit/providers/credentials";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const [foundUser] = await db
          .select()
          .from(user)
          .where(eq(user.username, credentials.username as string))
          .limit(1);

        if (!foundUser) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          foundUser.password_hash,
        );

        if (passwordMatch) {
          return {
            id: foundUser.id.toString(),
            name: foundUser.username,
            email: foundUser.username, // Using username as email for simplicity
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
