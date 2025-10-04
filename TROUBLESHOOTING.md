# 🔧 Troubleshooting Guide - Aplikasi Tiket Jahit (Private Admin Only)

## 🎯 Quick Problem Finder (Private Admin Access)

**Common Issues:**
- [Environment & Setup Problems](#-environment--setup-problems)
- [Database Connection Issues](#-database-connection-issues)
- [Authentication Problems](#-authentication-problems)
- [Build & Compilation Errors](#-build--compilation-errors)
- [Print System Issues](#-print-system-issues)
- [Performance Problems](#-performance-problems)
- [Deployment Issues](#-deployment-issues)

---

## 🛠️ Environment & Setup Problems

### Problem: `pnpm install` fails
```bash
Error: Cannot resolve dependency
```

**Solutions:**
```bash
# 1. Clear cache and retry
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 2. Check Node.js version
node --version  # Should be v18+
nvm use 18      # Switch to Node 18 if needed

# 3. Check pnpm version
pnpm --version  # Should be v8+
npm install -g pnpm@latest
```

### Problem: Development server won't start
```bash
Error: Cannot find module '@sveltejs/kit'
```

**Solutions:**
```bash
# 1. Reinstall dependencies
rm -rf node_modules .svelte-kit
pnpm install

# 2. Check SvelteKit adapter
# Update vite.config.js:
import adapter from '@sveltejs/adapter-auto';

# 3. Clear SvelteKit cache
rm -rf .svelte-kit
pnpm dev
```

### Problem: TypeScript errors on startup
```bash
Cannot find module '$lib/...' or its corresponding type declarations
```

**Solutions:**
```bash
# 1. Regenerate types
pnpm check
rm -rf .svelte-kit
pnpm dev

# 2. Check tsconfig.json paths:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "$lib": ["src/lib"],
      "$lib/*": ["src/lib/*"]
    }
  }
}

# 3. Restart TypeScript server in VS Code
Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

---

## 🗄️ Database Connection Issues

### Problem: Cannot connect to Turso database
```bash
Error: LibsqlError: URL_INVALID
```

**Diagnosis Steps:**
```bash
# 1. Check environment variables
echo $DATABASE_URL
echo $DATABASE_AUTH_TOKEN

# 2. Test Turso CLI connection
turso db shell tiket-jahit
# If this fails, check authentication
turso auth login
```

**Solutions:**
```bash
# 1. Verify database exists
turso db list
turso db show tiket-jahit

# 2. Regenerate auth token
turso db tokens create tiket-jahit
# Update .env with new token

# 3. Check database URL format
# Should be: libsql://[database-name]-[org].turso.io
DATABASE_URL="libsql://tiket-jahit-yourorg.turso.io"
```

### Problem: Migration fails
```bash
Error: table "customer" already exists
```

**Solutions:**
```bash
# 1. Check current schema
turso db shell tiket-jahit
.schema

# 2. Reset database (CAREFUL - deletes data!)
turso db destroy tiket-jahit
turso db create tiket-jahit
pnpm db:push

# 3. Fix migration conflicts
# Delete problematic migration files in drizzle/
# Regenerate: pnpm drizzle-kit generate:sqlite
```

### Problem: Seed data fails
```bash
Error: UNIQUE constraint failed: user.username
```

**Solutions:**
```bash
# 1. Clear existing data
turso db shell tiket-jahit
DELETE FROM user WHERE username = 'admin';
DELETE FROM settings;

# 2. Run seed again
pnpm db:seed

# 3. Check duplicate handling in seed script
# src/lib/server/db/seed.ts should have:
const existingUser = await db.select().from(user).where(eq(user.username, 'admin'));
if (existingUser.length === 0) {
  // Insert user
}
```

---

## 🔐 Authentication Problems

### Problem: Infinite redirect loop with custom sign-in page
```bash
Browser gets stuck in a loop redirecting to /login or /auth/signin
```

**Diagnosis:**
- This often happens when Auth.js's internal routing conflicts with a custom sign-in page configured via `pages.signIn`.
- Auth.js might try to intercept the custom sign-in route and redirect to its own default page, or back to the custom page, creating a loop.
- The issue is often silent in server logs as it occurs at a low level within Auth.js's internal handling.

**Solutions:**
1. **Move custom sign-in page to a non-Auth.js intercepted route**: 
   - Rename `src/routes/auth/signin/*` to `src/routes/login/*`.
   - Update all references (e.g., in `hooks.server.ts` `authorization` handle, `+page.svelte` links).
   - Ensure `pages.signIn` is *not* set in `SvelteKitAuth` config in `hooks.server.ts`.
2. **Ensure `authorization` handle correctly passes control**: 
   - In `hooks.server.ts`, the `authorization` handle should `return resolve(event);` for the custom login page (`/login`) when no session exists, allowing SvelteKit to render your page.
3. **Verify `AUTH_SECRET`**: Ensure it's a long, random string (min 32 chars).
4. **Clear browser cache/cookies**: Always clear browser data for the site when debugging redirects.

### Problem: Login always fails
```bash
Error: Invalid credentials
```

**Diagnosis:**
```bash
# 1. Check user exists in database
turso db shell tiket-jahit
SELECT * FROM user WHERE username = 'admin';

# 2. Verify password hash
# In your app, add temporary logging:
console.log('Input password:', password);
console.log('Stored hash:', user.password_hash);
console.log('Compare result:', await bcrypt.compare(password, user.password_hash));
```

**Solutions:**
```bash
# 1. Reset admin password
# Run this in database shell:
UPDATE user SET password_hash = '[new-bcrypt-hash]' WHERE username = 'admin';

# 2. Generate new hash (in Node.js):
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);

# 3. Check AUTH_SECRET length
# Must be at least 32 characters
echo ${#AUTH_SECRET}  # Should output >= 32
```

### Problem: Session expires immediately
```bash
User redirected to login after successful authentication
```

**Solutions:**
```bash
# 1. Check AUTH_SECRET consistency
# Same secret must be used across restarts
# Store in .env, not hardcoded

# 2. Check cookie settings in auth config:
export const { handle } = SvelteKitAuth({
  trustHost: true,  // Add this for localhost
  cookies: {
    secure: process.env.NODE_ENV === 'production'
  }
});

# 3. Clear browser cookies and retry
```

### Problem: Protected routes accessible without login
```bash
Can access /dashboard without authentication
```

**Solutions:**
```bash
# 1. Check layout structure:
src/routes/(protected)/+layout.server.ts should exist

# 2. Verify layout server code:
export async function load({ locals }) {
  const session = await locals.auth();
  if (!session?.user) {
    throw redirect(303, '/login');
  }
  return { session };
}

# 3. Check hooks.server.ts:
# Ensure the authorization handle is correctly configured in the sequence
export const handle = sequence(authHandle, authorization);
```

---

## 🏗️ Build & Compilation Errors

### Problem: Build fails with SvelteKit error
```bash
Error: Cannot resolve entry for package
```

**Solutions:**
```bash
# 1. Update all dependencies
pnpm update

# 2. Check adapter configuration:
# vite.config.js
import adapter from '@vercel/adapter-vercel';  # For Vercel
export default {
  kit: {
    adapter: adapter()
  }
};

# 3. Clear and rebuild
rm -rf .svelte-kit build
pnpm build
```

### Problem: TypeScript compilation errors
```bash
Type 'unknown' is not assignable to type 'User'
```

**Solutions:**
```bash
# 1. Add proper type assertions:
const session = await locals.auth() as Session | null;

# 2. Update type definitions in app.d.ts:
declare global {
  namespace App {
    interface Locals {
      auth: () => Promise<Session | null>;
    }
  }
}

# 3. Import types explicitly:
import type { Session } from '@auth/core/types';
```

### Problem: Drizzle ORM type errors
```bash
Property 'id' does not exist on type
```

**Solutions:**
```bash
# 1. Regenerate Drizzle types
pnpm drizzle-kit introspect:sqlite
pnpm drizzle-kit generate:sqlite

# 2. Check schema export:
// schema.ts
export const customer = sqliteTable('customer', { ... });
export type Customer = typeof customer.$inferSelect;
export type NewCustomer = typeof customer.$inferInsert;

# 3. Import types correctly:
import type { Customer } from '$lib/server/db/schema';
```

### Problem: `svelte-simple-form` usage with Svelte 5 Runes
```bash
Error: Property 'handler' does not exist on type...
Error: Object literal may only specify known properties, and 'schema' does not exist in type 'FormProps<...>'
Error: Cannot use 'form' as a store...
```

**Diagnosis:**
- The API for `svelte-simple-form` (v0.2.5) with Svelte 5 runes is different from previous versions or other form libraries.
- The `useForm` hook returns a single `form` object which contains all the state and methods.
- Direct destructuring of `errors`, `state`, `handler` is incorrect.
- The schema needs to be passed inside a `validation` object.
- The returned `form` object's properties are reactive, and should be accessed directly in the template, not with the `$` prefix.

**Solutions:**
1.  **Correct `useForm` usage**:
    ```typescript
    const { form } = useForm({
        initialValues: { ... },
        validation: { zod: yourSchema },
        onSubmit: async (values) => { ... }
    });
    ```
2.  **Apply the handler**:
    ```html
    <form use:form.handler>
    ```
3.  **Bind values**:
    ```html
    <input bind:value={form.data.name} />
    ```
4.  **Display errors**:
    ```html
    <p>{form.errors.name?.[0]}</p>
    ```
5.  **Disable button during submission**:
    ```html
    <button type="submit" disabled={form.isSubmitting}>Submit</button>
    ```

### Problem: Svelte 5 Component Rendering Issues (`<svelte:component>` deprecated, `TypeError` with `Snippet`s)

**Diagnosis:** Errors related to `svelte:component` deprecation, `TypeError: Cannot destructure property 'children'`, or `Unexpected token` when passing Svelte components (especially `lucide-svelte` icons) as props in Svelte 5 runes mode. This often stems from misunderstanding the distinction between passing components as props and using snippets, or how `lucide-svelte` components handle children.

**Solutions:**
1.  **Pass Component Constructor Directly:** When passing a Svelte component (e.g., `lucide-svelte` icon) as a prop, pass its constructor directly from the parent.
    ```svelte
    <!-- Parent Component -->
    <ChildComponent icon={MyIconComponent} />
    ```
2.  **Render Directly with Capitalized Prop Name:** In the child component, receive the component via `$props()` and render it directly using its capitalized prop name.
    ```svelte
    <!-- Child Component -->
    <script lang="ts">
        import type { SvelteComponent } from 'svelte';
        let { icon: IconComponent }: { icon: typeof SvelteComponent } = $props();
    </script>

    <IconComponent />
    ```
3.  **`lucide-svelte` and Children:** `lucide-svelte` components do not expect children. Ensure no content is placed between their tags (e.g., `<Home />` not `<Home>...</Home>`).
4.  **Avoid `<svelte:component>`:** This directive is deprecated in Svelte 5 runes mode.

### Problem: `noninteractive element cannot have nonnegative tabIndex value` warning

**Diagnosis:** This accessibility warning appears when a non-interactive HTML element (like `ul`) has `tabindex="0"`. In DaisyUI dropdowns, this is often an intentional part of their accessibility implementation for keyboard navigation.

**Solution:** If the warning is from a well-maintained UI library like DaisyUI and doesn't indicate a functional accessibility issue, it can be safely suppressed using a Svelte ignore comment.
    ```html
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <ul tabindex="0" ...>
    ```

---

## 🖨️ Print System Issues

### Problem: QR code not generating
```bash
Error: Cannot read property 'toDataURL' of undefined
```

**Solutions:**
```bash
# 1. Check qrcode installation
pnpm list qrcode
pnpm install qrcode @types/qrcode

# 2. Verify QR code generation code:
import QRCode from 'qrcode';

try {
  const qrDataURL = await QRCode.toDataURL(content);
  return qrDataURL;
} catch (error) {
  console.error('QR Code generation failed:', error);
  return null;
}

# 3. Check content validity:
console.log('QR Content:', content);  # Should not be empty/null
```

### Problem: Print CSS not applying
```bash
Print layout looks wrong
```

**Solutions:**
```css
/* Add to global CSS or component */
@media print {
  /* Hide navigation */
  nav, .no-print { 
    display: none !important; 
  }
  
  /* Optimize layout */
  body { 
    margin: 0; 
    padding: 20px;
    font-size: 12pt;
  }
  
  /* Page breaks */
  .page-break { 
    page-break-after: always; 
  }
  
  /* Ensure colors print */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### Problem: Print status not updating
```bash
Order status stays 'new' after printing
```

**Solutions:**
```javascript
// Check print event listeners
window.addEventListener('beforeprint', () => {
  updateOrderStatus(orderId, 'printed');
});

// Alternative: Manual print button
async function handlePrint() {
  await updateOrderStatus(orderId, 'printed');
  window.print();
}

// Verify API endpoint works:
// Test in browser console:
fetch('/api/orders/123/status', {
  method: 'PUT',
  body: JSON.stringify({ status: 'printed' }),
  headers: { 'Content-Type': 'application/json' }
});
```

---

## 🚀 Performance Problems

### Problem: Page loads slowly
```bash
Initial load takes >5 seconds
```

**Diagnosis:**
```bash
# 1. Check bundle size
pnpm build
pnpm dlx vite-bundle-analyzer

# 2. Check database query performance
# Add logging to slow queries:
console.time('loadOrders');
const orders = await db.select()...;
console.timeEnd('loadOrders');

# 3. Network tab in browser DevTools
# Look for large resources or slow API calls
```

**Solutions:**
```bash
# 1. Code splitting
// Use dynamic imports for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));

# 2. Database optimization
// Add indexes for frequent queries
CREATE INDEX order_status_idx ON order(status);
CREATE INDEX order_created_idx ON order(created_at);

# 3. Image optimization
// Use optimized image formats
// Implement lazy loading for images

# 4. Reduce bundle size
// Remove unused dependencies
pnpm dlx depcheck
```

### Problem: Database queries timing out
```bash
Error: Query timeout exceeded
```

**Solutions:**
```bash
# 1. Add query logging
// In database config
export const db = drizzle(client, { 
  logger: true  // Enable in development
});

# 2. Optimize complex queries
// Instead of multiple queries:
const orders = await db.select()
  .from(order)
  .leftJoin(customer, eq(order.customer_id, customer.id))
  .leftJoin(orderTemplate, eq(order.id, orderTemplate.order_id));

# 3. Add pagination
const orders = await db.select()
  .from(order)
  .limit(50)
  .offset(page * 50);

# 4. Use connection pooling (if applicable)
```

---

## 🚀 Deployment Issues

### Problem: Vercel deployment fails
```bash
Error: Build failed with exit code 1
```

**Solutions:**
```bash
# 1. Check build locally first
pnpm build
# Fix any errors before deploying

# 2. Check environment variables in Vercel
# Ensure all required vars are set:
# - DATABASE_URL
# - DATABASE_AUTH_TOKEN  
# - AUTH_SECRET

# 3. Check adapter configuration
# vite.config.js
import adapter from '@vercel/adapter-vercel';  # For Vercel
export default {
  kit: { 
    adapter: adapter({
      runtime: 'nodejs18.x'  # Specify runtime
    })
  }
};

# 4. Check vercel.json (if exists)
{
  "functions": {
    "src/routes/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Problem: Production database connection fails
```bash
LibsqlError: SQLITE_AUTH in production
```

**Solutions:**
```bash
# 1. Verify production database exists
turso db list
turso db show tiket-jahit-prod

# 2. Check production auth token
turso db tokens create tiket-jahit-prod
# Update Vercel environment variables

# 3. Verify URL format in production
# Should NOT include 'file:' prefix
DATABASE_URL="libsql://production-db-url"

# 4. Test connection from local with prod credentials
# Temporarily use prod credentials in .env.local
```

### Problem: Assets not loading in production
```bash
404 errors for CSS/JS files
```

**Solutions:**
```bash
# 1. Check asset paths
# Use relative paths, not absolute:
import './styles.css';  ✅
import '/src/styles.css';  ❌

# 2. Check public folder structure
public/
├── favicon.ico
└── images/

# 3. Verify base path configuration
// vite.config.js (if using subpath)
export default {
  kit: {
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/your-app' : '',
    }
  }
};
```

---

## 🆘 Emergency Procedures

### Production is Down
1. **Immediate**: Check Vercel status dashboard
2. **Rollback**: Deploy previous working version
3. **Investigate**: Check logs in Vercel dashboard
4. **Communicate**: Notify stakeholders
5. **Fix**: Address root cause

### Database Corruption
1. **Stop**: Prevent new writes
2. **Backup**: If possible, backup current state
3. **Restore**: From latest known good backup
4. **Verify**: Test critical functionality
5. **Monitor**: Watch for recurring issues

### Security Incident
1. **Secure**: Change all credentials immediately
2. **Assess**: Determine scope of breach
3. **Notify**: Inform relevant parties
4. **Investigate**: Root cause analysis
5. **Prevent**: Implement additional security measures

---

## 🔍 Debugging Tools & Commands

### Quick Diagnosis Commands
```bash
# System info
node --version && pnpm --version && git --version

# Database connectivity
turso db shell tiket-jahit

# Build test
pnpm build && echo "Build successful"

# Type check
pnpm check

# Dependency check
pnpm audit

# Clear all caches
rm -rf node_modules .svelte-kit build && pnpm install
```

### Log Analysis
```bash
# Vercel logs
vercel logs [deployment-url]

# Local development logs
# Check browser console
# Check terminal output
# Check Network tab in DevTools
```

### Database Debugging
```sql
-- Check table contents
SELECT COUNT(*) FROM customer;
SELECT COUNT(*) FROM "order";  -- 'order' is reserved word
SELECT COUNT(*) FROM user;

-- Check recent orders
SELECT * FROM "order" ORDER BY created_at DESC LIMIT 5;

-- Check user authentication
SELECT username, created_at, last_login FROM user;
```

---

## 📞 Getting Help

### Before Asking for Help
1. **Search** this troubleshooting guide
2. **Check** recent commits for related changes
3. **Test** on a clean environment if possible
4. **Document** exact error messages and steps to reproduce

### How to Ask for Help
```markdown
## Problem Description
Brief description of the issue

## Environment
- OS: macOS/Windows/Linux
- Node version: 18.x.x
- Browser: Chrome 120.x
- Last working state: "After commit abc123"

## Steps to Reproduce
1. Step one
2. Step two  
3. Error occurs

## Expected vs Actual
Expected: Should display order list
Actual: Shows blank page with console error

## What I've Tried
- Cleared cache
- Reinstalled dependencies
- Checked similar issues

## Error Messages
[Paste exact error messages]

## Additional Context
[Screenshots, logs, etc.]
```

### Escalation Path
1. **Team Chat**: Quick questions
2. **GitHub Issue**: Reproducible bugs
3. **Tech Lead**: Architecture decisions
4. **Emergency Contact**: Production issues

Remember: **Document the solution** when you find it - update this guide for the next person! 🤝

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