# Troubleshooting Notes

## Drizzle Kit Configuration for Turso
- **Issue**: `drizzle-kit generate` and `drizzle-kit push` commands were deprecated. Initial attempts to configure `drizzle.config.ts` with `driver: 'turso'` or `driver: 'libsql'` resulted in `ZodError` validation failures.
- **Resolution**: The correct configuration for `drizzle.config.ts` for Turso is `dialect: 'turso'` (without a separate `driver` property). This was found through deeper online research and trial-and-error.

## Drizzle Kit / TSX and SvelteKit $env Module Resolution
- **Issue**: `drizzle-kit` and `tsx` (used for running seed script) failed to resolve SvelteKit's `$env/dynamic/private` alias, leading to `Cannot find module '$env'` errors.
- **Resolution**: For `drizzle.config.ts` and `src/lib/server/db/index.ts` (used by the seed script), the `$env` import was replaced with `import 'dotenv/config';` and environment variables were accessed via `process.env.VARIABLE_NAME!`. This ensures compatibility in a standard Node.js environment.

## Svelte-Simple-Form and Zod Version Compatibility
- **Issue**: A `TypeError` occurred when passing a Zod schema to `svelte-simple-form`'s `useForm` hook, indicating a mismatch in expected Zod object structure.
- **Resolution**: The `zod` dependency in `package.json` was manually updated from `^4.1.11` to `^3.23.0` (latest stable 3.x version). After running `pnpm install`, the type error was resolved, indicating a compatibility issue between `svelte-simple-form` and older Zod versions.

## Deprecated @types/bcryptjs and @types/uuid
- **Issue**: `pnpm` warned about deprecated `@types/bcryptjs` and `@types/uuid` packages.
- **Resolution**: These packages were uninstalled using `pnpm remove @types/bcryptjs @types/uuid`. The main `bcryptjs` and `uuid` packages now include their own TypeScript type definitions, making the separate `@types` packages redundant.