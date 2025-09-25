<script lang="ts">
    import type { Snippet } from "svelte";

    type StatusType = "default" | "primary" | "secondary" | "accent" | "ghost" | "info" | "success" | "warning" | "error" | "outline";

    let {
        status = "default" as StatusType,
        children,
    }: {
        status?: StatusType;
        children: Snippet;
    } = $props();

    let baseClasses = "badge";

    let statusClasses = $derived(
        status === "primary"
            ? "badge-primary"
            : status === "secondary"
              ? "badge-secondary"
              : status === "accent"
                ? "badge-accent"
                : status === "ghost"
                  ? "badge-ghost"
                  : status === "info"
                    ? "badge-info"
                    : status === "success"
                      ? "badge-success"
                      : status === "warning"
                        ? "badge-warning"
                        : status === "error"
                          ? "badge-error"
                          : status === "outline"
                            ? "badge-outline"
                            : "badge-neutral",
    );

    let classes = $derived(`${baseClasses} ${statusClasses}`);
</script>

<span class={classes}>
    {@render children()}
</span>
