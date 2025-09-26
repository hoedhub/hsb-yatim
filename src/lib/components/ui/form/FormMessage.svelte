<script lang="ts">
    import type { Snippet } from "svelte";

    let { error = false, children } = $props<{ error?: boolean; children: Snippet }>();
</script>

<label class="label">
    <span class="label-text-alt" class:text-error={error}>
        {@render children()}
    </span>
</label>
