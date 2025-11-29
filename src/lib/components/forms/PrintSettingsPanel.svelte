<script lang="ts">
  import Button from "$lib/components/ui/button/Button.svelte";
  import Badge from "$lib/components/ui/badge/Badge.svelte";
  import Label from "$lib/components/ui/label/Label.svelte";
  import Select from "$lib/components/ui/select/Select.svelte";
  import Switch from "$lib/components/ui/switch/Switch.svelte";
  import TrackingCodeContentBuilder from "./TrackingCodeContentBuilder.svelte";
  import { Printer, Save, FileText, QrCode, Eye, EyeOff } from "lucide-svelte";
  let {
    initialSettings,
    onSave,
    isSaving = false,
    previewOrderNumber = "ORD-20251005-001",
    previewTrackingCode = "TRK-20251005-001",
  } = $props<{
    initialSettings: {
      print_paper_size: string;
      show_print_preview: boolean;
      tracking_code_content: string;
    };
    onSave: (settings: typeof initialSettings) => void;
    isSaving?: boolean;
    previewOrderNumber?: string;
    previewTrackingCode?: string;
  }>();

  let paperSize = $state(initialSettings.print_paper_size);
  let showPreview = $state(initialSettings.show_print_preview);
  let trackingCodeContent = $state(initialSettings.tracking_code_content);
  let hasChanges = $state(false);

  $effect(() => {
    hasChanges =
      paperSize !== initialSettings.print_paper_size ||
      showPreview !== initialSettings.show_print_preview ||
      trackingCodeContent !== initialSettings.tracking_code_content;
  });

  const paperSizeOptions = [
    { value: "A4", label: "A4 (210 × 297 mm)" },
    { value: "A5", label: "A5 (148 × 210 mm)" },
    { value: "Thermal80", label: "Thermal 80mm" },
    { value: "Thermal58", label: "Thermal 58mm" },
  ];

  function handleTrackingCodeContentSave(content: string) {
    trackingCodeContent = content;
  }

  function handleSave() {
    onSave({
      print_paper_size: paperSize,
      show_print_preview: showPreview,
      tracking_code_content: trackingCodeContent,
    });
  }
</script>

<div
  class="card bg-gradient-to-br from-base-100 to-base-200/50 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300"
>
  <div class="card-body p-6 lg:p-8">
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-secondary/10 rounded-xl">
          <Printer class="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-base-content">Pengaturan Cetak</h2>
          <p class="text-sm text-base-content/60 mt-1">
            Konfigurasi preferensi pencetakan dokumen
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

    <div class="space-y-6">
      <!-- Paper Size Setting -->
      <div
        class="settings-item rounded-xl p-4 border {hasChanges
          ? 'has-changes border-primary/30'
          : 'border-base-300'} bg-base-100"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 bg-primary/10 rounded-lg mt-1">
            <FileText class="h-5 w-5 text-primary" />
          </div>
          <div class="flex-1">
            <Label
              for="paper-size"
              class="text-base font-semibold text-base-content mb-1 block"
            >
              Ukuran Kertas Default
            </Label>
            <p class="text-sm text-base-content/60 mb-3">
              Pilih ukuran kertas yang akan digunakan untuk mencetak dokumen
            </p>
            <Select
              id="paper-size"
              bind:value={paperSize}
              options={paperSizeOptions}
              class="w-full max-w-xs"
            />
          </div>
        </div>
      </div>

      <!-- Preview Toggle Setting -->
      <div
        class="settings-item rounded-xl p-4 border {hasChanges
          ? 'has-changes border-primary/30'
          : 'border-base-300'} bg-base-100"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-start gap-3 flex-1">
            <div class="p-2 bg-secondary/10 rounded-lg">
              {#if showPreview}
                <Eye class="h-5 w-5 text-secondary" />
              {:else}
                <EyeOff class="h-5 w-5 text-base-content/50" />
              {/if}
            </div>
            <div class="flex-1">
              <Label
                for="show-preview"
                class="text-base font-semibold text-base-content mb-1 block"
              >
                Tampilkan Preview Cetak
              </Label>
              <p class="text-sm text-base-content/60">
                Aktifkan untuk melihat preview sebelum mencetak dokumen
              </p>
            </div>
          </div>
          <Switch id="show-preview" bind:checked={showPreview} class="ml-4" />
        </div>
      </div>

      <!-- Divider -->
      <div class="divider text-xs text-base-content/40">Konten QR Code</div>

      <!-- Tracking Code Content Builder -->
      <div class="bg-base-200/30 rounded-xl p-4 border border-base-300">
        <div class="flex items-center gap-2 mb-4">
          <div class="p-2 bg-accent/10 rounded-lg">
            <QrCode class="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-base-content">
              Builder Konten QR Code
            </h3>
            <p class="text-sm text-base-content/60">
              Atur konten yang akan ditampilkan dalam QR code
            </p>
          </div>
        </div>

        <TrackingCodeContentBuilder
          initialContent={trackingCodeContent}
          onSave={handleTrackingCodeContentSave}
          onCancel={() => {
            /* No-op for now */
          }}
          {previewOrderNumber}
          {previewTrackingCode}
        />
      </div>

      <!-- Action Buttons -->
      <div
        class="flex flex-wrap gap-2 justify-end pt-4 border-t border-base-300"
      >
        <Button
          onclick={handleSave}
          disabled={isSaving || !hasChanges}
          class="gap-2 min-w-[150px]"
        >
          {#if isSaving}
            <span class="loading loading-spinner loading-sm"></span>
            Menyimpan...
          {:else}
            <Save class="h-4 w-4" />
            Simpan Pengaturan
          {/if}
        </Button>
      </div>
    </div>
  </div>
</div>

<style>
  .settings-item {
    transition: all 0.2s ease;
  }

  .settings-item:hover {
    background: rgba(var(--base-content), 0.02);
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
