import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/sveltekit/providers/credentials";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { env } from "$env/dynamic/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const { handle: authHandle, signIn, signOut } = SvelteKitAuth({
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const [foundUser] = await db.select().from(user).where(eq(user.username, credentials.username as string)).limit(1);
                if (!foundUser) return null;

                const passwordMatch = await bcrypt.compare(credentials.password as string, foundUser.password_hash);
                if (passwordMatch) {
                    return { id: foundUser.id.toString(), name: foundUser.username, email: foundUser.username, role: "admin" };
                }
                return null;
            },
        }),
    ],
    secret: env.AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
    },
});

const authorization: Handle = async ({ event, resolve }) => {
    const isLoginPage = event.url.pathname === "/login";
    const isAuthRoute = event.url.pathname.startsWith("/auth");
    const session = await event.locals.auth();

    // If it's the login page and there's no session, let it pass to Auth.js
    if (isLoginPage && !session) {
        return resolve(event);
    }

    // If it's an auth route (not login) and there's no session, let it pass to Auth.js
    if (isAuthRoute && !session) {
        return resolve(event);
    }

    // If it's the login page or an auth route and there IS a session, redirect to home
    if ((isLoginPage || isAuthRoute) && session) {
        throw redirect(303, "/");
    }

    // If it's a protected route (not login or auth) and there's no session, redirect to login.
    if (!session) {
        throw redirect(303, "/login");
    }

    // Otherwise, proceed with the request (authenticated user on a protected route).
    return resolve(event);
};
// Export the handle as a sequence of the auth handler and the authorization handler
export const handle = sequence(authHandle, authorization);
