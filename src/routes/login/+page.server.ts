import { AuthError } from "@auth/sveltekit";
import { signIn } from "../../hooks.server";
import { redirect, fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        const form = await event.request.formData();
        const username = form.get("username");
        const password = form.get("password");

        if (!username || !password) {
            return fail(400, { username, error: "Username and password are required." });
        }

        try {
            await signIn("credentials", {
                username,
                password,
                redirectTo: "/", // Redirect to home page on successful login
            });
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return {
                            success: false,
                            error: "Invalid credentials.",
                        };
                    default:
                        return {
                            success: false,
                            error: "Something went wrong.",
                        };
                }
            }
            throw error;
        }
    },
};