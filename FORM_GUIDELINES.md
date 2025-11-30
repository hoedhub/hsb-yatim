# Form Development Guidelines

## 📋 Overview

Project ini mendukung dua pendekatan untuk form management:
1. **Native SvelteKit Forms** dengan `use:enhance`
2. **svelte-simple-form** library

Panduan ini menjelaskan kapan menggunakan masing-masing approach.

---

## 🎯 Decision Tree

```
Apakah form memiliki:
├─ Drag-and-drop functionality? ────────────────► use svelte-simple-form
├─ Multi-step wizard? ──────────────────────────► use svelte-simple-form  
├─ Dynamic fields (add/remove)? ────────────────► use svelte-simple-form
├─ Complex client-side validation logic? ───────► use svelte-simple-form
└─ Simple CRUD (< 8 fields)? ───────────────────► use Native SvelteKit Forms
```

---

## ✅ Native SvelteKit Forms (Recommended untuk Simple Forms)

### Kapan Menggunakan:
- ✅ Simple CRUD operations (Create, Read, Update, Delete)
- ✅ Forms dengan < 8 fields
- ✅ Straightforward validation
- ✅ Progressive enhancement penting (form harus bekerja tanpa JavaScript)

### Keuntungan:
- 🚀 **Progressive Enhancement**: Bekerja tanpa JavaScript
- 🔒 **Type-Safe**: Terintegrasi dengan SvelteKit's form actions
- 🎯 **Server-side Validation**: Built-in
- 📦 **No Extra Dependencies**: Bundle size lebih kecil
- ⚡ **SvelteKit Best Practice**

### Contoh Implementasi:

#### 1. Server-side (`+page.server.ts`):
```typescript
import { fail } from '@sveltejs/kit';
import { mySchema } from '$lib/schemas';

export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const data = {
            name: formData.get('name'),
            email: formData.get('email')
        };

        // Server-side validation
        const result = mySchema.safeParse(data);
        if (!result.success) {
            return fail(400, { 
                errors: result.error.flatten().fieldErrors,
                message: 'Validation failed' 
            });
        }

        // Save to database
        await db.insert(table).values(result.data);

        return { success: true };
    }
};
```

#### 2. Client-side (`+page.svelte`):
```svelte
<script lang="ts">
    import { enhance } from '$app/forms';

    let formData = $state({ name: '', email: '' });
    let isSubmitting = $state(false);
</script>

<form 
    method="POST" 
    action="?/create"
    use:enhance={() => {
        isSubmitting = true;
        return async ({ result, update }) => {
            isSubmitting = false;
            if (result.type === 'success') {
                // Handle success (e.g., close modal)
            }
            await update();
        };
    }}
>
    <input name="name" bind:value={formData.name} required />
    <input name="email" type="email" bind:value={formData.email} required />
    
    <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
    </button>
</form>
```

### Real Examples dalam Project:
- ✅ **Profile Page** (`/routes/(protected)/profile/`)
- ✅ **Measurement Labels** (`/routes/(protected)/measurements/labels/`)

---

## 🔧 svelte-simple-form (untuk Complex Forms)

### Kapan Menggunakan:
- ✅ **Drag-and-drop** interfaces
- ✅ **Multi-step wizards**
- ✅ **Dynamic fields** (user bisa add/remove fields)
- ✅ **Complex client-side state** (isDirty, isTouched, per-field errors)
- ✅ Forms dengan > 8 fields yang butuh complex validation

### Keuntungan:
- 🎨 **Built-in State Management**: isDirty, isTouched, isSubmitting
- ✅ **Client-side Validation**: Terintegrasi dengan Zod
- 🔄 **Helper Functions**: reset, setInitialValues, setError
- 📊 **Per-field Error Handling**: Lebih granular

### Kekurangan:
- ❌ **No Progressive Enhancement**: Butuh JavaScript
- 📦 **Extra Dependency**: Bundle size lebih besar
- 🔧 **Manual Submission Handling**: Harus handle fetch sendiri

### Contoh Implementasi:

```svelte
<script lang="ts">
    import { useForm } from 'svelte-simple-form';
    import { mySchema } from '$lib/schemas';

    const { form } = useForm({
        initialValues: { name: '', email: '' },
        validation: { zod: mySchema },
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);

            const response = await fetch('?/create', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Handle success
            }
        }
    });
</script>

<form use:form.handler>
    <Input 
        name="name" 
        bind:value={form.data.name} 
    />
    {#if form.errors.name}
        <span class="error">{form.errors.name[0]}</span>
    {/if}

    <button type="submit" disabled={form.isSubmitting}>
        Save
    </button>
</form>
```

### Real Examples dalam Project:
- ✅ **TemplateForm** (`/lib/components/forms/TemplateForm.svelte`) - Complex dengan drag-and-drop

---

## 🔄 Migration Path

Jika Anda menemukan form yang menggunakan approach yang salah:

### Dari svelte-simple-form → Native (untuk simple forms):
1. Pindahkan submission logic ke `+page.server.ts` actions
2. Remove `useForm` hook
3. Replace dengan native `<form method="POST">` + `use:enhance`
4. Update state management manual jika perlu

### Dari Native → svelte-simple-form (untuk complex forms):
1. Install `svelte-simple-form` jika belum
2. Wrap logic dengan `useForm` hook
3. Update form tag: `<form use:form.handler>`
4. Implement `onSubmit` handler

---

## 📚 Additional Resources

- [SvelteKit Form Actions](https://kit.svelte.dev/docs/form-actions)
- [SvelteKit use:enhance](https://kit.svelte.dev/docs/modules#$app-forms-enhance)
- [svelte-simple-form Docs](https://www.npmjs.com/package/svelte-simple-form)
- [Zod Validation](https://zod.dev/)

---

## 🎓 Best Practices

1. **Always use server-side validation** (bahkan jika ada client-side validation)
2. **Use Zod schemas** untuk consistency antara client & server
3. **Implement loading states** untuk UX yang lebih baik
4. **Handle errors gracefully** dengan toast/alert notifications
5. **Reset forms** setelah successful submission
6. **Use TypeScript** untuk type safety

---

## ✨ Quick Reference

| Aspect | Native SvelteKit | svelte-simple-form |
|--------|-----------------|-------------------|
| Bundle Size | ✅ Smaller | ⚠️ Larger |
| Progressive Enhancement | ✅ Yes | ❌ No |
| Type Safety | ✅ Built-in | ✅ Via Zod |
| State Management | ⚠️ Manual | ✅ Automatic |
| Validation | ✅ Server-side | ✅ Client + Server |
| Learning Curve | ✅ Low | ⚠️ Medium |
| Best For | Simple CRUD | Complex interactions |

---

**Last Updated**: 2025-11-30  
**Maintainer**: Development Team
