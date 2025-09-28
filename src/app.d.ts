// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session as AuthSession } from "@auth/sveltekit";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: () => Promise<AuthSession | null>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "@auth/sveltekit" {
    interface User {
        id: string;
        role: string;
        rememberMe?: boolean;
    }
    interface Session extends AuthSession {
        user: User;
    }
}
