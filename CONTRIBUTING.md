# 🤝 Contributing Guide - Aplikasi Tiket Jahit

## 📋 Table of Contents
- [Team Workflow](#-team-workflow)
- [Git Standards](#-git-standards)
- [Code Review Process](#-code-review-process)
- [Definition of Done](#-definition-of-done)
- [Development Environment](#-development-environment)
- [Coding Standards](#-coding-standards)
- [Testing Requirements](#-testing-requirements)
- [Communication](#-communication)

## 🔄 Team Workflow

### Branch Strategy (Git Flow Simplified)

```
main (production)
├── develop (staging)
    ├── feature/TJ-123-order-management
    ├── feature/TJ-124-print-system  
    ├── bugfix/TJ-125-auth-issue
    └── hotfix/TJ-126-critical-bug
```

### Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| **Feature** | `feature/TJ-[ticket]-[description]` | `feature/TJ-123-multi-template-orders` |
| **Bugfix** | `bugfix/TJ-[ticket]-[description]` | `bugfix/TJ-124-print-status-update` |
| **Hotfix** | `hotfix/TJ-[ticket]-[description]` | `hotfix/TJ-125-auth-session-timeout` |
| **Chore** | `chore/[description]` | `chore/update-dependencies` |

### Ticket System Integration
- Setiap branch harus terkait dengan ticket (Jira/GitHub Issues)
- Format: `TJ-[number]` (Tiket Jahit)
- Include ticket number dalam branch name dan commit messages

## 🔧 Git Standards

### Commit Message Format (Conventional Commits)

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code refactor (no feature change)
- `test`: Adding or updating tests
- `chore`: Build process, dependencies

**Examples:**
```bash
feat(orders): add multi-template support (TJ-123)
fix(print): resolve QR code generation issue (TJ-124)
docs(readme): update installation guide
test(auth): add login flow E2E tests (TJ-125)
```

### Pre-commit Checklist

Before committing, ensure:
- [ ] Code follows project standards
- [ ] All tests pass locally
- [ ] No console.log or debugging code
- [ ] TypeScript compilation successful
- [ ] ESLint warnings resolved
- [ ] Formatted with Prettier

### Push Guidelines

```bash
# ALWAYS rebase before pushing
git fetch origin
git rebase origin/develop

# Push feature branch
git push origin feature/TJ-123-description

# Create PR immediately after first push
```

## 📝 Code Review Process

### PR Requirements

**Before Creating PR:**
- [ ] Feature branch rebased on latest `develop`
- [ ] All automated checks passing
- [ ] Self-review completed
- [ ] Screenshots/videos for UI changes
- [ ] Migration scripts (if database changes)

**PR Title Format:**
```
[TJ-123] Add multi-template order support
```

**PR Description Template:**
```markdown
## 🎯 Purpose
Brief description of changes

## 📋 Changes Made
- [ ] Feature implementation
- [ ] Tests added
- [ ] Documentation updated

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## 📸 Screenshots (if applicable)
[Add screenshots for UI changes]

## ⚠️ Breaking Changes
- None / List breaking changes

## 📝 Notes
Additional context for reviewers
```

### Review Process

1. **Author Assigns Reviewers** (minimum 2 reviewers)
2. **Automated Checks** must pass before review
3. **Code Review** within 24 hours
4. **Address Feedback** and re-request review
5. **Approval** from 2+ reviewers required
6. **Merge** using "Squash and merge"

### Review Focus Areas

**Reviewers Should Check:**
- [ ] **Functionality**: Does it work as intended?
- [ ] **Code Quality**: Clean, readable, maintainable?
- [ ] **Performance**: Any performance implications?
- [ ] **Security**: Security vulnerabilities?
- [ ] **Tests**: Adequate test coverage?
- [ ] **Documentation**: Documentation updated?

**Review Comments Format:**
```markdown
**Issue**: Description of the problem
**Suggestion**: Specific recommendation
**Impact**: Why this matters (optional)
```

## ✅ Definition of Done

### Feature Completion Checklist

**Development:**
- [ ] Feature implemented according to requirements
- [ ] Code follows project coding standards
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Loading states added (for UI)
- [ ] Responsive design (mobile/tablet)

**Testing:**
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests for critical paths
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Error scenarios tested

**Documentation:**
- [ ] Code comments for complex logic
- [ ] API documentation updated (if applicable)
- [ ] User-facing changes documented
- [ ] Migration guide (if breaking changes)

**Quality Assurance:**
- [ ] ESLint warnings resolved
- [ ] TypeScript compilation successful
- [ ] No console.log or debug code
- [ ] Performance implications considered
- [ ] Security review completed

**Deployment Ready:**
- [ ] Environment variables documented
- [ ] Database migrations (if needed)
- [ ] Deployment instructions updated
- [ ] Rollback plan documented

### Bug Fix Checklist

- [ ] Root cause identified and documented
- [ ] Fix implemented with minimal scope
- [ ] Regression tests added
- [ ] Similar issues checked (pattern analysis)
- [ ] Fix verified in staging environment

## 🛠️ Development Environment

### Required Tools

```bash
# Node.js & Package Manager
node --version   # v18+
pnpm --version   # v8+

# Database
turso --version  # Latest

# Code Quality
git --version    # v2.30+
```

### IDE Setup (Recommended)

**VS Code Extensions:**
- Svelte for VS Code
- TypeScript Hero
- ESLint
- Prettier
- GitLens
- Thunder Client (API testing)

**Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "svelte.enable-ts-plugin": true,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Local Development Setup

```bash
# 1. Clone and setup
git clone <repository-url>
cd tiket-jahit
pnpm install

# 2. Environment
cp .env.example .env
# Configure .env variables

# 3. Database
pnpm db:push
pnpm db:seed

# 4. Start development
pnpm dev
```

## 📏 Coding Standards

### File Naming Conventions

```
components/     PascalCase.svelte
routes/        kebab-case/
utils/         camelCase.ts
types/         PascalCase.ts (interfaces)
schemas/       camelCase.ts
```

### Code Organization

```typescript
// Import order
import { onMount } from 'svelte';           // 1. Svelte/framework
import type { PageData } from './$types';  // 2. Types
import { db } from '$lib/server/db';        // 3. Internal libs
import Button from '$lib/components/ui/Button.svelte'; // 4. Components
import './styles.css';                      // 5. Styles

// Export order
export let data: PageData;  // 1. Props
export let className = ''; // 2. Optional props

// Component logic
let loading = false;        // 3. Local state
let items: Item[] = [];     // 4. Typed variables

onMount(() => {             // 5. Lifecycle
  // initialization
});

const handleSubmit = () => { // 6. Event handlers
  // logic
};
```

### Svelte 5 Component Rendering

In Svelte 5 runes mode, components are dynamic by default. When passing a Svelte component (like a `lucide-svelte` icon) as a prop to another component:

1.  **Passing the Component (Parent Component):** Pass the component constructor directly as a prop.
    ```svelte
    <ChildComponent icon={MyIconComponent} />
    ```
2.  **Receiving and Rendering (Child Component):** Receive the component via `$props()` and render it directly using its capitalized prop name.
    ```svelte
    <script lang="ts">
        import type { SvelteComponent } from 'svelte';
        let { icon: IconComponent }: { icon: typeof SvelteComponent } = $props();
    </script>

    <IconComponent />
    ```

*   **Avoid `<svelte:component>`:** This directive is deprecated in runes mode.
*   **Snippets (`{@render}`):** Use snippets for passing blocks of markup or parameterized content, not for rendering entire Svelte components directly.

### TypeScript Best Practices

```typescript
// ✅ Good: Explicit return types for functions
export async function loadOrders(): Promise<Order[]> {
  return db.select().from(order);
}

// ✅ Good: Interface for complex objects
interface OrderFormData {
  customerId: number;
  templates: TemplateSelection[];
  notes?: string;
}

// ✅ Good: Proper error handling
export async function createOrder(data: OrderFormData) {
  try {
    const result = await db.insert(order).values(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

// ❌ Avoid: any types
const data: any = fetchData(); // Use proper typing instead
```

## 🧪 Testing Requirements

### Test Coverage Expectations

- **Unit Tests**: >80% coverage untuk utils dan business logic
- **Component Tests**: Critical UI components
- **Integration Tests**: API endpoints dan database operations
- **E2E Tests**: Critical user journeys

### Test Naming Convention

```typescript
// Unit tests
describe('OrderService', () => {
  describe('createOrder', () => {
    it('should create order with valid data', () => {});
    it('should throw error with invalid customer ID', () => {});
  });
});

// Component test example (using vitest-browser-svelte)
test('renders status badge correctly', async () => {
  const { getByText } = render(StatusBadge, { props: { status: 'new' } });
  await expect(getByText('New')).toBeInTheDocument();
});

// E2E test example  
test('complete order creation flow', async ({ page }) => {
  // test implementation
});
```

### Running Tests Before Push

```bash
# Required before pushing
pnpm test           # Unit/Component tests must pass (browser mode)
pnpm test:e2e       # Critical E2E tests
pnpm lint           # No linting errors
pnpm check          # TypeScript compilation
```

## 💬 Communication

### Daily Standups (if applicable)
- **When**: Every weekday 9:00 AM
- **Duration**: 15 minutes max
- **Format**: What did you do? What will you do? Any blockers?

### Team Communication Channels

| Topic | Channel | Response Time |
|-------|---------|---------------|
| **Urgent Issues** | Direct message/Phone | Immediate |
| **Development Questions** | #dev-help | 2 hours |
| **PR Reviews** | GitHub notifications | 24 hours |
| **General Updates** | #general | No expectation |

### Escalation Process

1. **Level 1**: Ask team members in chat
2. **Level 2**: Create GitHub issue with details
3. **Level 3**: Involve tech lead/PM
4. **Level 4**: Schedule team discussion

### Documentation Responsibility

- **Feature Author**: Initial documentation
- **PR Reviewers**: Documentation completeness check
- **Tech Lead**: Architecture decision records
- **All Team Members**: Keep README and guides updated

---

## 🚨 Important Reminders

### Never Push to Main
- All changes must go through PR process
- Direct pushes to `main` are blocked
- Hotfixes still require emergency PR

### Database Changes
- Always create migration scripts
- Test migrations on staging first
- Include rollback procedures
- Document schema changes

### Security Considerations
- Never commit secrets in code
- Use environment variables
- Validate all user inputs
- Follow OWASP guidelines

### Performance Guidelines
- Optimize database queries
- Use proper indexes
- Implement pagination
- Monitor bundle size

---

**Remember**: Code is read more than it's written. Prioritize clarity and maintainability over cleverness. 

**Questions?** Create an issue or ask in team chat. We're here to help! 🤝