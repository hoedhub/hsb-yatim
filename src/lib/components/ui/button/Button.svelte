<script lang="ts">
  let {
    type = "button",
    variant = "primary", // Default variant is "primary"
    onclick = () => {},
    disabled = false, // This prop is passed
    children,
    ...rest
  } = $props<{
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "outline";
    onclick?: (event: MouseEvent) => void;
    disabled?: boolean;
    children?: any; // For slot content
    [key: string]: any; // Allow arbitrary HTML attributes
  }>();

  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
</script>

<button
  type={type}
  class="{baseClasses} {disabled ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400' :
    variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600' :
    variant === 'secondary' ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:outline-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600' :
    variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600 dark:bg-red-700 dark:hover:bg-red-600' :
    variant === 'outline' ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:outline-gray-400 dark:text-gray-900 dark:border-gray-700 dark:hover:bg-gray-800' :
    'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600'}"
  onclick={onclick}
  disabled={disabled}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</button>