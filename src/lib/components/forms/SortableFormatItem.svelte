<script lang="ts">
  import { Trash2, GripVertical, Type, Calendar, Hash } from "lucide-svelte";
  import Input from "$lib/components/ui/input/Input.svelte";

  interface FormatComponent {
    id: string;
    type: "text" | "year" | "month" | "day" | "counter";
    value?: string;
  }

  let { component, onRemove, onUpdateText } = $props<{
    component: FormatComponent;
    onRemove: (id: string) => void;
    onUpdateText: (id: string, value: string) => void;
  }>();

  const typeConfig = {
    text: {
      label: "Teks",
      color: "primary",
      icon: Type,
      bgClass: "bg-primary/10",
      borderClass: "border-primary/30",
      textClass: "text-primary",
    },
    year: {
      label: "Tahun",
      color: "secondary",
      icon: Calendar,
      bgClass: "bg-secondary/10",
      borderClass: "border-secondary/30",
      textClass: "text-secondary",
    },
    month: {
      label: "Bulan",
      color: "accent",
      icon: Calendar,
      bgClass: "bg-accent/10",
      borderClass: "border-accent/30",
      textClass: "text-accent",
    },
    day: {
      label: "Hari",
      color: "info",
      icon: Calendar,
      bgClass: "bg-info/10",
      borderClass: "border-info/30",
      textClass: "text-info",
    },
    counter: {
      label: "Counter",
      color: "success",
      icon: Hash,
      bgClass: "bg-success/10",
      borderClass: "border-success/30",
      textClass: "text-success",
    },
  };

  const config = typeConfig[component.type as keyof typeof typeConfig];
  const Icon = config.icon;
</script>

<div
  class="format-item flex items-center gap-2 bg-base-100 rounded-lg p-2 border-2 {config.borderClass} shadow-sm group max-w-full"
>
  <!-- Drag Handle -->
  <button
    class="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-base-200 rounded transition-colors"
    aria-label="Drag to reorder"
  >
    <GripVertical class="h-4 w-4 text-base-content/40" />
  </button>

  <!-- Icon -->
  <div class="p-1.5 {config.bgClass} rounded">
    <Icon class="h-3.5 w-3.5 {config.textClass}" />
  </div>

  <!-- Content -->
  {#if component.type === "text"}
    <Input
      type="text"
      value={component.value || ""}
      oninput={(e) => onUpdateText(component.id, e.currentTarget.value)}
      placeholder="Teks..."
      class="flex-1 h-8 text-sm px-2 min-w-0"
    />
  {:else}
    <div class="flex-1 flex items-center gap-2">
      <span class="text-sm font-medium {config.textClass}">{config.label}</span>
      <span class="text-xs text-base-content/50 font-mono">
        {component.type === "year"
          ? "{YYYY}"
          : component.type === "month"
            ? "{MM}"
            : component.type === "day"
              ? "{DD}"
              : "{XXX}"}
      </span>
    </div>
  {/if}

  <!-- Delete Button -->
  <button
    onclick={() => onRemove(component.id)}
    class="delete-btn p-1.5 hover:bg-error/10 rounded transition-all"
    aria-label="Hapus komponen"
  >
    <Trash2 class="h-3.5 w-3.5 text-error" />
  </button>
</div>

<style>
  .format-item {
    transition: all 0.2s ease;
  }

  .format-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .format-item:active {
    transform: scale(0.98);
  }

  .delete-btn {
    opacity: 0;
    transition: all 0.2s ease;
  }

  .format-item:hover .delete-btn {
    opacity: 1;
  }
</style>
