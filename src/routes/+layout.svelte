<script lang="ts">
    import "../app.css";
    import { Toast } from "$lib/components/ui";
    import { toasts, removeToast } from "$lib/stores/toast";
</script>

<div class="font-sans">
    <slot />
</div>

<Toast toasts={$toasts} onDismiss={removeToast} />
