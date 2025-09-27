import { SvelteKitAuth } from "@auth/sveltekit";
import { handle as authHandle } from "$lib/server/auth";

export const handle = authHandle;
