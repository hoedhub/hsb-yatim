# ✅ Detailed Development Todo List: Aplikasi Tiket Jahit

Current Phase: Phase 3: Authentication Setup
Current Day: Day 10
Last Completed Task: 3.4.6 Add loading states dan error handling (Login Page)
Next Priority: 3.4.7 Test complete login/logout flow

## 🚀 Phase 1: Foundation Setup
**Timeline: Week 1 (Days 1-7)**

### Day 1: Project Initialization
- [x] **1.1.1** Run `pnpm create sveltekit@latest tiket-jahit`
- [x] **1.1.2** Choose skeleton project, TypeScript: Yes, ESLint: Yes, Prettier: Yes
- [x] **1.1.3** `cd tiket-jahit && pnpm install`
- [x] **1.1.4** Test dev server runs: `pnpm run dev`
- [x] **1.1.5** Initialize git repository: `git init && git add . && git commit -m "Initial commit"`

### Day 1-2: Dependencies Installation
- [x] **1.2.1** Install core dependencies:
  ```bash
  pnpm install @auth/sveltekit @auth/drizzle-adapter
  pnpm install drizzle-orm @libsql/client
  pnpm install svelte-simple-forms zod
  pnpm install @lucide/svelte
  pnpm install bcryptjs qrcode uuid
  ```
- [x] **1.2.2** Install dev dependencies:
  ```bash
  # pnpm install -D tailwindcss autoprefixer
  pnpm install -D drizzle-kit
  pnpm install -D @types/node @types/bcryptjs @types/qrcode @types/uuid
  ```

### Day 2: UI Component Integration
- [x] **1.3.1** Identify and copy first set of components from daisyUI [https://daisyui.com/components/] (e.g., Button, Card, Input [see src/lib/components/ui subfolders]).
- [x] **1.3.2** Create wrapper Svelte components in `src/lib/components/ui` if needed for reusability.
- [x] **1.3.3** Test component integration in a sample page.

### Day 2-3: Project Structure
- [x] **1.4.1** Create folder structure:
  ```
  src/lib/
  ├── components/ui/ (daisyUI)
  ├── components/forms/
  ├── components/layout/
  ├── components/print/
  ├── server/db/
  ├── server/auth.ts
  ├── stores/
  ├── utils/
  ├── types/
  └── schemas/
  ```
- [x] **1.4.2** Create route structure:
  ```
  src/routes/
  ├── dashboard/
  ├── customers/
  ├── orders/
  ├── measurements/labels/
  ├── measurements/templates/
  ├── settings/
  ├── print/
  ├── login/                 # Custom Login page
  ├── auth/                  # Auth.js internal routes & custom registration page
  └── api/
  ```
- [x] **1.4.3** Setup TypeScript path mapping dalam `tsconfig.json`
- [x] **1.4.4** Create `.env.example` file with required variables

### Day 3-4: Environment Setup
- [x] **1.5.1** Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
- [x] **1.5.2** Create Turso database: `turso db create tiket-jahit`
- [x] **1.5.3** Get database credentials: `turso db show tiket-jahit`
- [x] **1.5.4** Generate auth token: `turso db tokens create tiket-jahit`
- [x] **1.5.5** Create `.env` file dengan:
  ```env
  DATABASE_URL="libsql://your-database-url"
  DATABASE_AUTH_TOKEN="your-auth-token"
  AUTH_SECRET="your-secret-key-32-chars-min"
  INITIAL_ADMIN_USERNAME="admin"
  INITIAL_ADMIN_PASSWORD="secure-password-123"
  ```
- [x] **1.5.6** Add `.env` to `.gitignore`

## 🗄️ Phase 2: Database Schema & Setup
**Timeline: Week 1-2 (Days 4-10)**

### Day 4-5: Database Schema Definition
- [x] **2.1.1** Create `src/lib/server/db/schema.ts`
- [x] **2.1.2** Define `customer` table:
  ```typescript
  export const customer = sqliteTable('customer', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    type: text('type', { enum: ['individual', 'institution'] }).notNull(),
    institution_name: text('institution_name'),
    phone: text('phone'),
    address: text('address'),
    created_at: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
  });
  ```
- [x] **2.1.3** Define `measurementLabel` table dengan `is_active` field
- [x] **2.1.4** Define `measurementTemplate` table dengan `is_active` field
- [x] **2.1.5** Define `measurementTemplateLabel` junction table dengan `order_index`
- [x] **2.1.6** Define `order` table dengan `tracking_code` dan progress fields
- [x] **2.1.7** Define `orderTemplate` junction table dengan `display_order`
- [x] **2.1.8** Define `measurement` table linked ke `order_template_id`
- [x] **2.1.9** Define `user` table dengan `password_hash` dan `last_login`
- [x] **2.1.10** Define `settings` table dengan `category` dan `data_type`

### Day 5: Database Relations
- [x] **2.2.1** Add foreign key relations dengan `references()`
- [x] **2.2.2** Add indexes untuk performance:
  ```typescript
  export const customerNameIdx = index('customer_name_idx').on(customer.name);
  export const orderStatusIdx = index('order_status_idx').on(order.status);
  export const orderCreatedIdx = index('order_created_idx').on(order.created_at);
  ```
- [x] **2.2.3** Export semua tables dari schema file
- [x] **2.2.4** Create type definitions dari schema: `export type Customer = typeof customer.$inferSelect;`

### Day 5-6: Database Connection
- [x] **2.3.1** Create `src/lib/server/db/index.ts`
- [x] **2.3.2** Setup Turso client:
  ```typescript
  import { drizzle } from 'drizzle-orm/libsql';
  import { createClient } from '@libsql/client';

  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  export const db = drizzle(client);
  ```
- [x] **2.3.3** Test database connection
- [x] **2.3.4** Create `drizzle.config.ts` untuk migrations

### Day 6: Database Migrations
- [x] **2.4.1** Generate initial migration: `pnpm drizzle-kit generate:sqlite`
- [x] **2.4.2** Review generated SQL migration file
- [x] **2.4.3** Run migration: `pnpm drizzle-kit push:sqlite`
- [x] **2.4.4** Verify tables created di Turso dashboard
- [x] **2.4.5** Create seed script `src/lib/server/db/seed.ts`:
  - Default admin user dengan bcrypt hash
  - Default measurement labels (Lingkar Dada, Panjang Lengan, dll)
  - Sample measurement template (Baju, Celana)
  - Default settings (order format, print settings)

### Day 7: Seed Data Implementation
- [x] **2.5.1** Implement `hashPassword` utility function
- [x] **2.5.2** Create initial admin user seed
- [x] **2.5.3** Create basic measurement labels seed:
  ```typescript
  const defaultLabels = [
    { name: 'Lingkar Dada', default_unit: 'cm' },
    { name: 'Panjang Lengan', default_unit: 'cm' },
    { name: 'Lingkar Pinggang', default_unit: 'cm' },
    // ... more labels
  ];
  ```
- [x] **2.5.4** Create sample templates dengan template-label relationships
- [x] **2.5.5** Create default settings seed:
  ```typescript
  const defaultSettings = [
    { key: 'order_number_format', value: 'ORD-{YYYY}{MM}{DD}-{XXX}', category: 'order' },
    { key: 'tracking_code_content', value: '{tracking_code}', category: 'print' },
    // ... more settings
  ];
  ```
- [x] **2.5.6** Run seed script dan verify data

## 🔐 Phase 3: Authentication Setup
**Timeline: Week 2 (Days 8-14)**

### Day 8: Auth.js Configuration
- [x] **3.1.1** Create `src/lib/server/auth.ts`
- [x] **3.1.2** Import required Auth.js modules
- [x] **3.1.3** Configure Credentials provider:
  ```typescript
  Credentials({
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      // Database lookup logic
    }
  })
  ```
- [x] **3.1.4** Implement database user lookup dengan bcrypt verification
- [x] **3.1.5** Add JWT callbacks untuk role information
- [x] **3.1.6** Configure custom signin page: `/login` (previously `/auth/signin`)

### Day 8: Auth Integration
- [x] **3.2.1** Update `src/hooks.server.ts` dengan auth handle
- [x] **3.2.2** Create `src/app.d.ts` untuk session typing:
  ```typescript
  declare global {
    namespace App {
      interface Locals {
        auth: import('@auth/sveltekit').Session;
      }
    }
  }
  ```
- [x] **3.2.3** Test auth configuration doesn't break dev server

### Day 9: Protected Routes
- [x] **3.3.1** Create `src/routes/(protected)/+layout.server.ts`:
  ```typescript
  export async function load({ locals }) {
    const session = await locals.auth();
    if (!session?.user) {
      throw redirect(303, '/login');
    }
    return { session };
  }
  ```
- [x] **3.3.2** Create `src/routes/(protected)/+layout.svelte` dengan:
  - Navigation sidebar
  - Header dengan user info dan logout
  - Main content area
- [x] **3.3.3** Style navigation menggunakan daisyUI components
- [x] **3.3.4** Add responsive navigation (mobile hamburger menu)

### Day 9-10: Login Page
- [x] **3.4.1** Create `src/routes/login/+page.svelte` (previously `src/routes/auth/signin/+page.svelte`)
- [x] **3.4.2** Create login form menggunakan Svelte Simple Forms + daisyUI
- [x] **3.4.3** Implement form validation dengan Zod schema
- [x] **3.4.4** Add login form submission logic
- [x] **3.4.5** Style login page (centered form, responsive)
- [x] **3.4.6** Add loading states dan error handling
- [x] **3.4.7** Test complete login/logout flow

### Day 10: Registration Page (Dev Only)
- [x] **3.4.8** Create `src/routes/auth/register/+page.svelte`
- [x] **3.4.9** Create `src/routes/auth/register/+page.server.ts`
- [x] **3.4.10** Implement registration logic (password hashing, DB insert)
- [x] **3.4.11** Add confirm password field dan validation
- [x] **3.4.12** Add show/hide password toggles
- [x] **3.4.13** Conditionally display registration button di login page (dev only)
- [x] **3.4.14** Implement environment check untuk registration action (dev only)
- [x] **3.4.15** Test complete registration flow

### Day 10: Session Management
- [ ] **3.5.1** Create logout functionality di navigation
- [ ] **3.5.2** Add session persistence testing
- [ ] **3.5.3** Implement "remember me" functionality (optional)
- [ ] **3.5.4** Add session timeout handling
- [ ] **3.5.5** Test authentication edge cases (expired tokens, invalid credentials)

## 🧩 Phase 4: Core Components Development
**Timeline: Week 2-3 (Days 11-21)**

### Day 11-12: Validation Schemas
- [x] **4.1.1** Create `src/lib/schemas/index.ts`
- [x] **4.1.2** Define customer validation schema:
  ```typescript
  export const customerSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    type: z.enum(['individual', 'institution']),
    institution_name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional()
  });
  ```
- [x] **4.1.3** Define measurement label schema
- [x] **4.1.4** Define measurement template schema
- [x] **4.1.5** Define complex order schema dengan nested templates
- [x] **4.1.6** Define settings schema per category
- [x] **4.1.7** Export TypeScript types dari schemas

### Day 12-13: Reusable Components
- [x] **4.2.1** Create `src/lib/components/ui/DataTable.svelte`:
  - Props: data, columns, sortable, filterable
  - Pagination support
  - Loading states
  - Empty states
- [x] **4.2.2** Create `src/lib/components/ui/FormDialog.svelte`:
  - Generic modal form wrapper
  - Integration dengan Svelte Simple Forms
  - Error handling
  - Loading states
- [ ] **4.2.3** Create `src/lib/components/ui/StatusBadge.svelte`:
  - Dynamic styling berdasarkan status
  - Support order status dan boolean states
- [x] **4.2.4** Create `src/lib/components/ui/SearchInput.svelte`:
  - Debounced search
  - Clear button
  - Loading indicator
- [x] **4.2.5** Create `src/lib/components/ui/ConfirmDialog.svelte`:
  - Reusable confirmation modal
  - Dangerous action styling
  - Customizable messages

### Day 13-14: Layout Components
- [x] **4.3.1** Create `src/lib/components/layout/Navigation.svelte`:
  - Sidebar navigation dengan active states
  - Icons dari Lucide
  - Collapsible mobile menu
- [x] **4.3.2** Create `src/lib/components/layout/Header.svelte`:
  - User profile dropdown
  - Breadcrumb navigation
  - Quick action buttons
- [x] **4.3.3** Create `src/lib/components/layout/PageHeader.svelte`:
  - Consistent page titles
  - Action buttons area
  - Subtitle support
- [ ] **4.3.4** Test layout components responsiveness

### Day 14-15: Form Components
- [x] **4.4.1** Create `src/lib/components/forms/CustomerForm.svelte`:
  - Svelte Simple Forms integration
  - Type selection (individual/institution)
  - Conditional institution name field
  - Real-time validation
- [x] **4.4.2** Create `src/lib/components/forms/MeasurementLabelForm.svelte`:
  - Name dan default unit fields
  - Unit selection dropdown
- [x] **4.4.3** Create `src/lib/components/forms/TemplateForm.svelte`:
  - Template name dan description
  - Label selection dengan drag-drop ordering
  - Live preview
- [x] **4.4.4** Test all form components dengan validation

## 🏗️ Phase 5: Feature Implementation - Master Data
**Timeline: Week 3-4 (Days 15-28)**

### Day 15-16: Dashboard Implementation
- [ ] **5.1.1** Create `src/routes/(protected)/dashboard/+page.server.ts`:
  - Load dashboard statistics
  - Recent orders query
  - Performance optimizations
- [ ] **5.1.2** Create `src/routes/(protected)/dashboard/+page.svelte`:
  - Statistics cards layout
  - Recent orders table
  - Quick action buttons
- [ ] **5.1.3** Style dashboard dengan responsive grid
- [ ] **5.1.4** Add loading states dan error handling
- [ ] **5.1.5** Test dashboard performance dengan sample data

### Day 16-17: Settings Management
- [ ] **5.2.1** Create `src/routes/(protected)/settings/+page.server.ts`:
  - Load all settings by category
  - Settings update actions
- [ ] **5.2.2** Create Order Number Format Builder component:
  - Drag & drop interface untuk format components
  - Live preview
  - Validation logic
  - Save/reset functionality
- [ ] **5.2.3** Create Tracking Code Content Builder:
  - Template builder dengan variables
  - QR code preview
  - Test content generator
- [ ] **5.2.4** Create Print Settings panel:
  - Paper size selection
  - Preview toggle
  - Default visibility settings
- [ ] **5.2.5** Implement settings save functionality dengan optimistic updates

### Day 17-18: User Profile Management
- [ ] **5.3.1** Create `src/routes/(protected)/profile/+page.svelte`:
  - User info display dan edit
  - Password change form
  - Activity log (last login)
- [ ] **5.3.2** Implement password change logic:
  - Current password validation
  - New password confirmation
  - Secure password hashing
- [ ] **5.3.3** Add profile picture upload (optional, future enhancement)
- [ ] **5.3.4** Test user profile functionality

### Day 18-20: Measurement Labels Management
- [ ] **5.4.1** Create `src/routes/(protected)/measurements/labels/+page.server.ts`:
  - Load labels dengan filtering (active/inactive)
  - CRUD actions (create, update, soft delete, reactivate)
- [ ] **5.4.2** Create labels list page dengan:
  - DataTable integration
  - Search dan filter active/inactive
  - Add new label button
  - Edit/delete actions
- [ ] **5.4.3** Implement smart delete logic:
  - Check if label is used dalam templates
  - Soft delete if used, permanent delete if not
  - Confirmation dialog dengan explanation
- [ ] **5.4.4** Create label form modal dengan validation
- [ ] **5.4.5** Add reactivate inactive labels functionality
- [ ] **5.4.6** Test complete CRUD operations

### Day 20-22: Measurement Templates Management
- [ ] **5.5.1** Create `src/routes/(protected)/measurements/templates/+page.server.ts`:
  - Load templates dengan relations ke labels
  - Template CRUD actions
  - Clone template functionality
- [ ] **5.5.2** Create template list page:
  - Template cards atau table view
  - Search dan filter functionality
  - Add/Edit/Clone/Delete actions
- [ ] **5.5.3** Implement drag-drop template builder:
  - Available labels panel
  - Selected labels panel dengan ordering
  - Real-time preview
  - Save/cancel functionality
- [ ] **5.5.4** Implement template cloning:
  - Clone template structure only
  - Auto-generate new name
  - Preserve label ordering
- [ ] **5.5.5** Test template operations thoroughly

### Day 22-24: Customer Management
- [ ] **5.6.1** Create `src/routes/(protected)/customers/+page.server.ts`:
  - Load customers dengan pagination
  - Customer search functionality
  - Customer CRUD actions
- [ ] **5.6.2** Create customers list page:
  - DataTable dengan search
  - Customer type badges
  - Contact info display
  - Add/Edit/Delete actions
- [ ] **5.6.3** Create customer detail page:
  - Customer information display
  - Order history table
  - Edit customer functionality
- [ ] **5.6.4** Implement customer form dengan:
  - Type selection (individual/institution)
  - Conditional fields
  - Contact information
  - Validation dan error handling
- [ ] **5.6.5** Test customer management completely

## 📝 Phase 6: Order Management System
**Timeline: Week 4-5 (Days 25-35)**

### Day 25-27: Order Creation Flow
- [ ] **6.1.1** Create `src/routes/(protected)/orders/new/+page.server.ts`:
  - Load customers untuk selection
  - Load templates untuk selection
  - Order creation action
- [ ] **6.1.2** Create multi-step order creation wizard:
  - Step 1: Customer selection dengan search
  - Step 2: Template selection (multiple) dengan drag-drop ordering
  - Step 3: Measurement forms per template
  - Step 4: Review dan save
- [ ] **6.1.3** Implement dynamic measurement form generation:
  - Generate forms based on selected templates
  - Group measurements by template
  - Validation per measurement
  - Different values per template support
- [ ] **6.1.4** Implement order number generation:
  - Use admin-configured format
  - Auto-increment counter logic
  - Unique constraint handling
- [ ] **6.1.5** Generate unique tracking code (UUID-based)
- [ ] **6.1.6** Test complete order creation flow

### Day 27-28: Order Listing & Filtering
- [ ] **6.2.1** Create `src/routes/(protected)/orders/+page.server.ts`:
  - Load orders dengan pagination
  - Filter by status, customer, date range
  - Search by order number, customer name
- [ ] **6.2.2** Create orders list page:
  - DataTable dengan multiple filters
  - Status badges
  - Customer information
  - Quick action buttons (view, edit, print)
- [ ] **6.2.3** Implement advanced filtering:
  - Status filter (multiple selection)
  - Date range picker
  - Customer search
  - Template filter
- [ ] **6.2.4** Add bulk operations (optional):
  - Bulk status updates
  - Bulk print
- [ ] **6.2.5** Test filtering dan search functionality

### Day 28-30: Order Detail & Status Management
- [ ] **6.3.1** Create `src/routes/(protected)/orders/[id]/+page.server.ts`:
  - Load order dengan all relations
  - Status update actions
  - Progress tracking updates
- [ ] **6.3.2** Create order detail page:
  - Order information header
  - Customer details
  - Multiple templates display
  - Measurements per template
  - Progress tracking checkboxes
  - Status update controls
- [ ] **6.3.3** Implement progress tracking system:
  - Tukang ukur, potong, jahit checkboxes
  - Visual progress indicator
  - Timeline view of changes
- [ ] **6.3.4** Implement status update functionality:
  - Status change validation
  - Timestamp logging
  - Status history tracking
- [ ] **6.3.5** Add order editing functionality (measurements only)
- [ ] **6.3.6** Test complete order detail functionality

### Day 30-32: Print System Implementation
- [ ] **6.4.1** Create `src/routes/(protected)/print/[orderId]/+page.server.ts`:
  - Load order data for printing
  - Generate QR/barcode content
- [ ] **6.4.2** Create print layout component:
  - Responsive layout berdasarkan paper size setting
  - Order information header
  - Customer details section
  - Multiple templates layout
  - QR code/barcode placement (configurable)
- [ ] **6.4.3** Implement QR/Barcode generation:
  - Use qrcode library
  - Dynamic content berdasarkan settings
  - Error handling untuk generation failures
- [ ] **6.4.4** Implement print-specific CSS:
  ```css
  @media print {
    /* Print-specific styles */
    /* Hide navigation, optimize layout */
  }
  ```
- [ ] **6.4.5** Implement print status tracking:
  - Browser print event listeners
  - Auto status update logic
  - Manual print button fallback
- [ ] **6.4.6** Test print functionality across browsers

## ⚡ Phase 7: Advanced Features & Polish
**Timeline: Week 5-6 (Days 33-42)**

### Day 33-34: Custom Format Builder Enhancement
- [ ] **7.1.1** Enhance Order Number Format Builder:
  - More format components: `{YY}`, `{Q}` (quarter), custom separators
  - Format validation logic
  - Import/export format presets
- [ ] **7.1.2** Add format testing functionality:
  - Generate sample order numbers
  - Validate uniqueness constraints
- [ ] **7.1.3** Create format component library:
  - Date components
  - Counter components
  - Literal text components
- [ ] **7.1.4** Test format builder thoroughly

### Day 34-35: Print System Enhancements
- [ ] **7.2.1** Implement multiple paper size support:
  - A4, A5, thermal 80mm, thermal 58mm layouts
  - CSS variables untuk dynamic sizing
  - Print preview untuk each size
- [ ] **7.2.2** Enhance QR/Barcode system:
  - Multiple barcode types (Code128, Code39)
  - Size dan positioning controls
  - Error correction level settings
- [ ] **7.2.3** Add print template customization:
  - Logo upload (optional)
  - Custom header/footer text
  - Field visibility toggles
- [ ] **7.2.4** Implement print queue (future enhancement idea)

### Day 35-36: Search & Filter Enhancements
- [ ] **7.3.1** Implement global search:
  - Search across customers, orders, templates
  - Fuzzy search capabilities
  - Search result ranking
- [ ] **7.3.2** Add saved filter presets:
  - Save commonly used filter combinations
  - Quick filter buttons
  - Filter preset management
- [ ] **7.3.3** Enhance DataTable functionality:
  - Column sorting
  - Column show/hide
  - Export functionality (CSV, PDF)
- [ ] **7.3.4** Add search performance optimizations

### Day 36-37: UI/UX Polish
- [ ] **7.4.1** Implement comprehensive loading states:
  - Skeleton loaders untuk tables
  - Button loading states
  - Page loading indicators
- [ ] **7.4.2** Add error boundaries dan error handling:
  - Global error boundary
  - Form error displays
  - Network error handling
- [ ] **7.4.3** Implement toast notification system:
  - Success notifications
  - Error notifications
  - Progress notifications
- [ ] **7.4.4** Add keyboard shortcuts (optional):
  - Ctrl+N untuk new order
  - Ctrl+P untuk print current page
  - Escape untuk close modals
- [ ] **7.4.5** Optimize responsive design:
  - Mobile navigation improvements
  - Touch-friendly interfaces
  - Tablet-optimized layouts

### Day 37-38: Performance Optimization
- [ ] **7.5.1** Database query optimization:
  - Add database indexes untuk frequently queried fields
  - Optimize complex joins
  - Implement query result caching
- [ ] **7.5.2** Frontend performance:
  - Code splitting untuk large pages
  - Image optimization
  - Lazy loading untuk tables
- [ ] **7.5.3** Bundle size optimization:
  - Tree shaking unused code
  - Analyze bundle dengan `pnpm dlx vite-bundle-analyzer`
  - Optimize dependencies
- [ ] **7.5.4** Add performance monitoring (basic)

### Day 38-39: Data Validation & Security
- [ ] **7.6.1** Enhance input validation:
  - Server-side validation untuk all forms
  - File upload validation (if implemented)
  - Rate limiting untuk API endpoints
- [ ] **7.6.2** Add security headers:
  - CSRF protection
  - Content Security Policy
  - Secure cookie settings
- [ ] **7.6.3** Implement audit logging:
  - Track important data changes
  - User activity logging
  - Data export untuk compliance
- [ ] **7.6.4** Add backup/restore functionality planning

## 🧪 Phase 8: Testing & Quality Assurance
**Timeline: Week 6-7 (Days 39-49)**

### Day 39-40: Unit Testing Setup
- [ ] **8.1.1** Install testing dependencies:
  ```bash
  pnpm install -D @playwright/test vitest
  pnpm install -D @testing-library/svelte
  pnpm install -D jsdom happy-dom
  ```
- [ ] **8.1.2** Configure Vitest dalam `vite.config.js`:
  ```js
  test: {
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
  }
  ```
- [ ] **8.1.3** Create test utilities dan setup files
- [ ] **8.1.4** Write database utility tests
- [ ] **8.1.5** Write validation schema tests

### Day 40-41: Component Testing
- [ ] **8.2.1** Write tests untuk reusable components:
  - DataTable component
  - FormDialog component
  - StatusBadge component
  - SearchInput component
- [ ] **8.2.2** Write tests untuk form components:
  - CustomerForm validation
  - MeasurementLabelForm validation
  - TemplateForm functionality
- [ ] **8.2.3** Test component error handling
- [ ] **8.2.4** Test component accessibility basics

### Day 41-42: Integration Testing
- [ ] **8.3.1** Setup Playwright untuk E2E testing
- [ ] **8.3.2** Write authentication flow tests:
  - Login dengan valid credentials
  - Login dengan invalid credentials
  - Logout functionality
  - Protected route access
- [ ] **8.3.3** Write critical user journey tests:
  - Complete order creation flow
  - Print order functionality
  - Customer management CRUD
  - Template management CRUD
- [ ] **8.3.4** Test responsive behavior

### Day 42-43: Database Testing
- [ ] **8.4.1** Write database operation tests:
  - CRUD operations untuk all entities
  - Foreign key constraints
  - Soft delete functionality
- [ ] **8.4.2** Write migration tests:
  - Schema changes
  - Data migration scripts
  - Rollback scenarios
- [ ] **8.4.3** Test database performance dengan large datasets
- [ ] **8.4.4** Test concurrent access scenarios

### Day 43-44: Print System Testing
- [ ] **8.5.1** Test print layout rendering:
  - Different paper sizes
  - QR code generation
  - Multiple templates layout
- [ ] **8.5.2** Test browser print functionality:
  - Different browsers (Chrome, Firefox, Safari)
  - Print event detection
  - Status update logic
- [ ] **8.5.3** Test print error scenarios:
  - QR generation failures
  - Missing data handling
  - Network interruptions

### Day 44-45: User Acceptance Testing
- [ ] **8.6.1** Create UAT test scenarios document
- [ ] **8.6.2** Setup staging environment untuk testing
- [ ] **8.6.3** Conduct user workflow testing:
  - Admin daily workflow simulation
  - Edge case scenario testing
  - Data integrity verification
- [ ] **8.6.4** Collect feedback dan create bug tracking list
- [ ] **8.6.5** Performance testing dengan realistic data volumes

## 🚀 Phase 9: Deployment & Documentation
**Timeline: Week 7 (Days 45-49)**

### Day 45: Production Environment Setup
- [ ] **9.1.1** Setup production Turso database:
  - Create production database instance
  - Configure production environment variables
  - Setup database replication (if needed)
- [ ] **9.1.2** Configure Vercel deployment:
  ```bash
  pnpm install -D @vercel/adapter-vercel
  ```
- [ ] **9.1.3** Update `vite.config.js` untuk production:
  ```js
  import adapter from '@vercel/adapter-vercel';
  export default {
    kit: {
      adapter: adapter()
    }
  };
  ```
- [ ] **9.1.4** Setup environment variables di Vercel dashboard
- [ ] **9.1.5** Configure domain dan SSL settings

### Day 45-46: Production Deployment
- [ ] **9.2.1** Create production build locally:
  ```bash
  pnpm run build
  pnpm run preview
  ```
- [ ] **9.2.2** Test production build functionality
- [ ] **9.2.3** Deploy to Vercel:
  - Connect GitHub repository
  - Configure build settings
  - Deploy dari main branch
- [ ] **9.2.4** Run production migration scripts
- [ ] **9.2.5** Seed production database dengan initial data
- [ ] **9.2.6** Test complete production deployment

### Day 46: Production Testing & Monitoring
- [ ] **9.3.1** Perform production smoke tests:
  - Authentication functionality
  - Core CRUD operations
  - Print functionality
  - Performance benchmarks
- [ ] **9.3.2** Setup basic monitoring:
  - Vercel analytics
  - Error tracking setup
  - Performance monitoring
- [ ] **9.3.3** Test production backup procedures
- [ ] **9.3.4** Create production incident response plan

### Day 47-48: Documentation Creation
- [ ] **9.4.1** Create user documentation:
  - Admin user guide
  - Feature walkthrough dengan screenshots
  - Troubleshooting guide
  - FAQ section
- [ ] **9.4.2** Create technical documentation:
  - API documentation
  - Database schema documentation
  - Deployment guide
  - Development setup guide
- [ ] **9.4.3** Create maintenance documentation:
  - Backup procedures
  - Update procedures
  - Security maintenance checklist
- [ ] **9.4.4** Record demo videos (optional):
  - Complete order workflow
  - Admin features demonstration
  - Print functionality showcase

### Day 48-49: Final Testing & Handover
- [ ] **9.5.1** Conduct final user acceptance testing
- [ ] **9.5.2** Create user training session materials
- [ ] **9.5.3** Setup user feedback collection system
- [ ] **9.5.4** Create post-launch support plan
- [ ] **9.5.5** Final code review dan cleanup
- [ ] **9.5.6** Project handover documentation

## ✅ Project Completion Checklist

### Core Functionality ✅
- [ ] Authentication system working
- [ ] Customer management complete
- [ ] Measurement labels & templates management
- [ ] Multi-template order creation
- [ ] Print system dengan QR codes
- [ ] Progress tracking
- [ ] Settings management

### Quality Assurance ✅
- [ ] All critical paths tested
- [ ] Responsive design verified
- [ ] Performance optimized
- [ ] Security measures implemented
- [ ] Error handling robust
- [ ] Data validation comprehensive

### Production Ready ✅
- [ ] Production deployment successful
- [ ] Database migrations completed
- [ ] Monitoring systems active
- [ ] Documentation complete
- [ ] User training conducted
- [ ] Support procedures established

### Post-Launch Tasks
- [ ] Monitor application performance
- [ ] Collect user feedback
- [ ] Plan iteration improvements
- [ ] Schedule regular maintenance
- [ ] Document lessons learned

---

## 🎯 Current State Tracking

**Phase**: 4 - Core Components Development
**Current Day**: 14
Last Completed Task: 4.4.4 Test all form components dengan validation
Next Priority Task: 5.1.1 Create `src/routes/(protected)/dashboard/+page.server.ts`
**Blockers**: None
**Notes**: All form components have been successfully created and their basic rendering and label accessibility have been validated with Vitest Browser Mode. The project is now ready to proceed with Phase 5: Feature Implementation - Master Data.

---

*This detailed checklist ensures no task is forgotten and provides clear progress tracking for the entire development lifecycle.*