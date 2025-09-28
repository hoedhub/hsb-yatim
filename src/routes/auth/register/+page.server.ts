import { fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const actions = {
    default: async ({ request }) => {
        // Only allow registration in development environment
        if (process.env.NODE_ENV !== 'development') {
            throw redirect(303, '/auth/signin');
        }

        const data = await request.formData();
        const username = data.get("username") as string;
        const password = data.get("password") as string;
        const confirmPassword = data.get("confirmPassword") as string;

        console.log("--- Registration Action ---");
        console.log("Received:", { username, password, confirmPassword });

        if (!username || !password || !confirmPassword) {
            console.log("Validation Error: All fields required.");
            return fail(400, { username, error: "All fields are required." });
        }

        if (password !== confirmPassword) {
            console.log("Validation Error: Passwords do not match.");
            return fail(400, { username, error: "Passwords do not match." });
        }

        // Check if user already exists
        const [existingUser] = await db.select().from(user).where(eq(user.username, username)).limit(1);
        if (existingUser) {
            return fail(409, { username, error: "User with this username already exists." });
        }

        const password_hash = await bcrypt.hash(password, 10);

        try {
            await db.insert(user).values({
                username,
                password_hash,
            });
        } catch (e) {
            console.error("Error during user registration:", e);
            return fail(500, { username, error: "Failed to register user." });
        }

        throw redirect(303, '/auth/signin');
    },
};