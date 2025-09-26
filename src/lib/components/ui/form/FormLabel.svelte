<script lang="ts">
    import type { Snippet } from "svelte";

    let { children, alt } = $props<{ children: Snippet; alt?: Snippet }>();
</script>

<label class="label">
    <span class="label-text">{@render children()}</span>
    {#if alt}
        <span class="label-text-alt">{@render alt()}</span>
    {/if}
</label>
