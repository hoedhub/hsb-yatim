
# Coding Standards

## File Naming Conventions

*   `components/`: `PascalCase.svelte`
*   `routes/`: `kebab-case/`
*   `utils/`: `camelCase.ts`
*   `types/`: `PascalCase.ts` (interfaces)
*   `schemas/`: `camelCase.ts`

## Code Organization

*   **Import Order**:
    1.  Svelte/framework imports
    2.  Type imports
    3.  Internal library imports (`$lib`)
    4.  Component imports
    5.  Style imports

*   **Export Order**:
    1.  Props
    2.  Optional props

*   **Component Logic**:
    1.  Local state
    2.  Typed variables
    3.  Lifecycle hooks
    4.  Event handlers

## TypeScript Best Practices

*   Use explicit return types for functions.
*   Use interfaces for complex objects.
*   Implement proper error handling.
*   Avoid using the `any` type.
