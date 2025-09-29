<script lang="ts">
    type StatusType = "default" | "primary" | "secondary" | "accent" | "ghost" | "info" | "success" | "warning" | "error" | "outline";

    let {
        value = "default" as StatusType,
    }: {
        value?: StatusType;
    } = $props();

    let baseClasses = "badge";

    let statusClasses = $derived(
        value === "primary"
            ? "badge-primary"
            : value === "secondary"
              ? "badge-secondary"
              : value === "accent"
                ? "badge-accent"
                : value === "ghost"
                  ? "badge-ghost"
                  : value === "info"
                    ? "badge-info"
                    : value === "success"
                      ? "badge-success"
                      : value === "warning"
                        ? "badge-warning"
                        : value === "error"
                          ? "badge-error"
                          : value === "outline"
                            ? "badge-outline"
                            : "badge-neutral",
    );

    let classes = $derived(`${baseClasses} ${statusClasses}`);
</script>

<span class={classes}>
    {value}
</span>