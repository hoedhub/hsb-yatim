<script lang="ts">
    import type { Snippet } from "svelte";

    let { children } = $props<{ children: Snippet }>();
</script>

<div class="form-control w-full">
    {@render children()}
</div>
