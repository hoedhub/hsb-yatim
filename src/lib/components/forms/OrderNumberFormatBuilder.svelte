<script lang="ts">
  import Button from "$lib/components/ui/button/Button.svelte";
  import Badge from "$lib/components/ui/badge/Badge.svelte";
  import Input from "$lib/components/ui/input/Input.svelte";
  import Label from "$lib/components/ui/label/Label.svelte";
  import {
    Trash2,
    GripVertical,
    Plus,
    RotateCcw,
    Save,
    Calendar,
    Hash,
    Type,
  } from "lucide-svelte";
  import { dndzone } from "svelte-dnd-action";
  import SortableFormatItem from "./SortableFormatItem.svelte";

  interface FormatComponent {
    id: string;
    type: "text" | "year" | "month" | "day" | "counter";
    value?: string;
  }

  let {
    initialFormat = "ORD-{YYYY}{MM}{DD}-{XXX}",
    onSave,
    onCancel,
    isSaving = false,
    currentPreviewOrderNumber = $bindable(""),
  } = $props<{
    initialFormat?: string;
    onSave: (format: string) => void;
    onCancel: () => void;
    isSaving?: boolean;
    currentPreviewOrderNumber?: string;
  }>();

  let components: FormatComponent[] = $state([]);
  let hasChanges = $state(false);

  $effect(() => {
    parseFormatString(initialFormat);
  });

  $effect(() => {
    const currentFormat = generatedFormat;
    hasChanges = currentFormat !== initialFormat;
  });

  function parseFormatString(formatString: string) {
    // Split by known tags, keeping them in the result
    const parts = formatString.split(/({(?:YYYY|MM|DD|XXX)})/g);
    const parsedComponents: FormatComponent[] = [];
    let idCounter = 0;

    for (const part of parts) {
      if (!part) continue;

      if (part === "{YYYY}") {
        parsedComponents.push({ id: `year-${idCounter++}`, type: "year" });
      } else if (part === "{MM}") {
        parsedComponents.push({ id: `month-${idCounter++}`, type: "month" });
      } else if (part === "{DD}") {
        parsedComponents.push({ id: `day-${idCounter++}`, type: "day" });
      } else if (part === "{XXX}") {
        parsedComponents.push({
          id: `counter-${idCounter++}`,
          type: "counter",
          value: "XXX",
        });
      } else {
        // Treat everything else as a text component
        parsedComponents.push({
          id: `text-${idCounter++}`,
          type: "text",
          value: part,
        });
      }
    }
    components = parsedComponents;
  }

  function handleDndConsider(e: CustomEvent<any>) {
    const { items } = e.detail;
    components = items;
  }

  function handleDndFinalize(e: CustomEvent<any>) {
    const { items } = e.detail;
    components = items;
  }

  function addComponent(type: FormatComponent["type"]) {
    const newId = `${type}-${Date.now()}`;
    let newComponent: FormatComponent;

    if (type === "text") {
      newComponent = { id: newId, type, value: "TEXT" };
    } else if (type === "counter") {
      newComponent = { id: newId, type, value: "XXX" };
    } else {
      newComponent = { id: newId, type };
    }
    components = [...components, newComponent];
  }

  function removeComponent(id: string) {
    components = components.filter((comp: FormatComponent) => comp.id !== id);
  }

  function updateTextComponent(id: string, value: string) {
    components = components.map((comp: FormatComponent) =>
      comp.id === id ? { ...comp, value } : comp,
    );
  }

  const generatedFormat = $derived.by(() => {
    return components
      .map((comp: FormatComponent) => {
        if (comp.type === "text") return comp.value;
        if (comp.type === "year") return "{YYYY}";
        if (comp.type === "month") return "{MM}";
        if (comp.type === "day") return "{DD}";
        if (comp.type === "counter") return "{XXX}";
        return "";
      })
      .join("");
  });

  const previewOrderNumber = $derived.by(() => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    let counter = 123;

    return components
      .map((comp: FormatComponent) => {
        if (comp.type === "text") return comp.value;
        if (comp.type === "year") return year;
        if (comp.type === "month") return month;
        if (comp.type === "day") return day;
        if (comp.type === "counter") return counter.toString().padStart(3, "0");
        return "";
      })
      .join("");
  });

  $effect(() => {
    currentPreviewOrderNumber = previewOrderNumber;
  });

  function handleSave() {
    onSave(generatedFormat);
  }

  function handleReset() {
    parseFormatString(initialFormat);
  }
</script>

<div
  class="card bg-gradient-to-br from-base-100 to-base-200/50 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300"
>
  <div class="card-body p-6 lg:p-8">
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-primary/10 rounded-xl">
          <Hash class="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-base-content">
            Format Nomor Pesanan
          </h2>
          <p class="text-sm text-base-content/60 mt-1">
            Atur format unik untuk nomor pesanan Anda
          </p>
        </div>
      </div>
      {#if hasChanges}
        <Badge variant="warning" class="h-auto py-1.5 gap-2">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            Belum disimpan
          </span>
        </Badge>
      {/if}
    </div>

    <div class="grid grid-cols-1 gap-6">
      <!-- Component Buttons -->
      <div class="bg-base-200/50 rounded-xl p-4 border border-base-300">
        <Label class="text-sm font-semibold text-base-content/80 mb-3">
          <span class="flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Komponen Tersedia
          </span>
        </Label>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <Button
            onclick={() => addComponent("text")}
            variant="outline"
            size="sm"
            class="component-button hover:bg-primary/10 hover:text-primary hover:border-primary/50"
          >
            <Type class="h-4 w-4" />
            Teks
          </Button>
          <Button
            onclick={() => addComponent("year")}
            variant="outline"
            size="sm"
            class="component-button hover:bg-secondary/10 hover:text-secondary hover:border-secondary/50"
          >
            <Calendar class="h-4 w-4" />
            Tahun
          </Button>
          <Button
            onclick={() => addComponent("month")}
            variant="outline"
            size="sm"
            class="component-button hover:bg-accent/10 hover:text-accent hover:border-accent/50"
          >
            <Calendar class="h-4 w-4" />
            Bulan
          </Button>
          <Button
            onclick={() => addComponent("day")}
            variant="outline"
            size="sm"
            class="component-button hover:bg-info/10 hover:text-info hover:border-info/50"
          >
            <Calendar class="h-4 w-4" />
            Hari
          </Button>
          <Button
            onclick={() => addComponent("counter")}
            variant="outline"
            size="sm"
            class="component-button hover:bg-success/10 hover:text-success hover:border-success/50"
          >
            <Hash class="h-4 w-4" />
            Counter
          </Button>
        </div>
      </div>

      <!-- Drop Zone -->
      <div
        class="bg-base-100 rounded-xl p-4 border-2 border-dashed {hasChanges
          ? 'has-changes border-primary/30'
          : 'border-base-300'}"
      >
        <Label class="text-sm font-semibold text-base-content/80 mb-3">
          <span class="flex items-center gap-2">
            <GripVertical class="h-4 w-4" />
            Format Saat Ini (Seret untuk mengatur ulang)
          </span>
        </Label>
        <div
          use:dndzone={{ items: components }}
          onconsider={handleDndConsider}
          onfinalize={handleDndFinalize}
          class="drop-zone min-h-[120px] flex flex-wrap gap-2 p-3 rounded-lg bg-base-200/30"
        >
          {#each components as component (component.id)}
            <SortableFormatItem
              {component}
              onRemove={removeComponent}
              onUpdateText={updateTextComponent}
            />
          {/each}
        </div>
      </div>

      <!-- Preview Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-base-200/50 rounded-xl p-4 border border-base-300">
          <Label
            for="format-string"
            class="text-sm font-semibold text-base-content/80 mb-2 block"
          >
            String Format
          </Label>
          <Input
            id="format-string"
            type="text"
            value={generatedFormat}
            readonly
            class="font-mono text-sm bg-base-100"
          />
        </div>

        <div class="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <Label
            for="preview"
            class="text-sm font-semibold text-primary mb-2 block"
          >
            <span class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              Preview Live
            </span>
          </Label>
          <Input
            id="preview"
            type="text"
            value={previewOrderNumber}
            readonly
            class="font-mono text-lg font-bold bg-base-100 text-primary"
          />
          <p class="text-xs text-base-content/50 mt-2">
            Preview menggunakan tanggal: {new Date().toLocaleDateString(
              "id-ID",
            )}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex flex-wrap gap-2 justify-end pt-4 border-t border-base-300"
      >
        <Button
          variant="ghost"
          onclick={handleReset}
          disabled={isSaving || !hasChanges}
          class="gap-2"
        >
          <RotateCcw class="h-4 w-4" />
          Reset
        </Button>
        <Button
          onclick={handleSave}
          disabled={isSaving || !hasChanges}
          class="gap-2 min-w-[120px]"
        >
          {#if isSaving}
            <span class="loading loading-spinner loading-sm"></span>
            Menyimpan...
          {:else}
            <Save class="h-4 w-4" />
            Simpan Format
          {/if}
        </Button>
      </div>
    </div>
  </div>
</div>

<style>
  .drop-zone {
    transition: all 0.3s ease;
  }

  .drop-zone:empty::before {
    content: "Tarik komponen ke sini atau tambahkan dari tombol di atas";
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.875rem;
  }

  @keyframes pulse-border {
    0%,
    100% {
      border-color: rgba(var(--primary), 0.3);
    }
    50% {
      border-color: rgba(var(--primary), 0.6);
    }
  }

  .has-changes {
    animation: pulse-border 2s ease-in-out infinite;
  }
</style>
