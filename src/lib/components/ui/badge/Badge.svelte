<script lang="ts">
  import type { Snippet } from "svelte";

  type BadgeVariant =
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "outline";

  type BadgeSize = "sm" | "md" | "lg";

  let {
    variant = "primary" as BadgeVariant,
    size = "md" as BadgeSize,
    class: className = "",
    children,
  }: {
    variant?: BadgeVariant;
    size?: BadgeSize;
    class?: string;
    children: Snippet;
  } = $props();

  let baseClasses = "badge whitespace-nowrap shrink-0";

  let variantClasses = $derived(
    variant === "primary"
      ? "badge-primary"
      : variant === "secondary"
        ? "badge-secondary"
        : variant === "accent"
          ? "badge-accent"
          : variant === "ghost"
            ? "badge-ghost"
            : variant === "info"
              ? "badge-info"
              : variant === "success"
                ? "badge-success"
                : variant === "warning"
                  ? "badge-warning"
                  : variant === "error"
                    ? "badge-error"
                    : variant === "outline"
                      ? "badge-outline"
                      : "badge-primary",
  );

  let sizeClasses = $derived(
    size === "sm" ? "badge-sm" : size === "lg" ? "badge-lg" : "",
  );

  let classes = $derived(
    `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`,
  );
</script>

<span class={classes}>
  {@render children()}
</span>
