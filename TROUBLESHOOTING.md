# 🔧 Troubleshooting Guide - Aplikasi Tiket Jahit

## 🎯 Quick Problem Finder

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
    throw redirect(303, '/auth/signin');
  }
  return { session };
}

# 3. Check hooks.server.ts:
export { handle } from './lib/server/auth';
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
console.log('QR Content:', content);  // Should not be empty/null
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
import adapter from '@vercel/adapter-vercel';
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