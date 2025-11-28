<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import OrderNumberFormatBuilder from "$lib/components/forms/OrderNumberFormatBuilder.svelte";
  import PrintSettingsPanel from "$lib/components/forms/PrintSettingsPanel.svelte";
  import { Settings as SettingsIcon, Save, AlertCircle } from "lucide-svelte";
  import type { Settings } from "$lib/server/db/schema";

  let { data } = $props();

  // Toast notification state
  let toast = $state<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  function showToast(
    message: string,
    type: "success" | "error" | "info" = "success",
  ) {
    toast = { show: true, message, type };
    setTimeout(() => {
      toast = { show: false, message: "", type: "success" };
    }, 3000);
  }

  let orderSettings = $state(data.settings.order || []);
  let printSettings = $state(data.settings.print || []);

  let initialOrderNumberFormat =
    orderSettings.find((s: Settings) => s.key === "order_number_format")
      ?.value || "ORD-{YYYY}{MM}{DD}-{XXX}";
  let initialPrintSettings = {
    print_paper_size:
      printSettings.find((s: Settings) => s.key === "print_paper_size")
        ?.value || "A4",
    show_print_preview:
      printSettings.find((s: Settings) => s.key === "show_print_preview")
        ?.value === "true",
    tracking_code_content:
      printSettings.find((s: Settings) => s.key === "tracking_code_content")
        ?.value || "{tracking_code}",
  };

  let isSaving = $state(false);

  async function handleOrderNumberFormatSave(format: string) {
    const setting = orderSettings.find(
      (s: Settings) => s.key === "order_number_format",
    );
    if (setting) {
      isSaving = true;
      const originalValue = setting.value;
      setting.value = format;

      const formData = new FormData();
      formData.append("key", setting.key);
      formData.append("value", format);

      try {
        const response = await fetch("?/update", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          setting.value = originalValue;
          showToast("Gagal memperbarui format nomor pesanan", "error");
        } else {
          await invalidateAll();
          showToast("Format nomor pesanan berhasil diperbarui!", "success");
        }
      } catch (error) {
        setting.value = originalValue;
        showToast("Terjadi kesalahan saat menyimpan", "error");
      } finally {
        isSaving = false;
      }
    }
  }

  async function handlePrintSettingsSave(
    newPrintSettings: typeof initialPrintSettings,
  ) {
    const updates: { key: string; value: string }[] = [];
    const originalValues: { key: string; value: string }[] = [];

    for (const key in newPrintSettings) {
      const settingKey = key as keyof typeof newPrintSettings;
      const setting = printSettings.find((s: Settings) => s.key === settingKey);
      const newValue = String(newPrintSettings[settingKey]);

      if (setting) {
        if (setting.value !== newValue) {
          originalValues.push({ key: setting.key, value: setting.value || "" });
          setting.value = newValue;
          updates.push({ key: setting.key, value: newValue });
        }
      } else {
        // Handle new setting that doesn't exist in DB yet
        updates.push({ key: settingKey, value: newValue });
        // Optimistically add to local state
        printSettings.push({
          key: settingKey,
          value: newValue,
          category: "print",
          data_type: "string",
        });
      }
    }

    if (updates.length > 0) {
      isSaving = true;
      const formData = new FormData();
      updates.forEach((update) => {
        formData.append("key", update.key);
        formData.append("value", update.value);
      });

      try {
        const response = await fetch("?/update", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          originalValues.forEach((u: { key: string; value: string }) => {
            const setting = printSettings.find(
              (s: Settings) => s.key === u.key,
            );
            if (setting) setting.value = u.value;
          });
          showToast("Gagal memperbarui pengaturan cetak", "error");
        } else {
          await invalidateAll();
          showToast("Pengaturan cetak berhasil diperbarui!", "success");
        }
      } catch (error) {
        originalValues.forEach((u: { key: string; value: string }) => {
          const setting = printSettings.find((s: Settings) => s.key === u.key);
          if (setting) setting.value = u.value;
        });
        showToast("Terjadi kesalahan saat menyimpan", "error");
      } finally {
        isSaving = false;
      }
    }
  }
  let currentPreviewOrderNumber = $state("");
</script>

<div class="min-h-screen bg-base-200/30">
  <!-- Toast Notification -->
  {#if toast.show}
    <div class="toast toast-top toast-end z-50">
      <div
        class="alert {toast.type === 'success'
          ? 'alert-success'
          : toast.type === 'error'
            ? 'alert-error'
            : 'alert-info'} shadow-lg"
      >
        <div class="flex items-center gap-2">
          {#if toast.type === "error"}
            <AlertCircle class="h-5 w-5" />
          {:else if toast.type === "success"}
            <Save class="h-5 w-5" />
          {:else}
            <AlertCircle class="h-5 w-5" />
          {/if}
          <span>{toast.message}</span>
        </div>
      </div>
    </div>
  {/if}

  <PageHeader
    title="Pengaturan"
    subtitle="Kelola konfigurasi aplikasi dan preferensi sistem Anda"
  >
    {#snippet actions()}
      <div class="flex items-center gap-2">
        <div class="badge badge-primary gap-2">
          <SettingsIcon class="h-3 w-3" />
          Konfigurasi
        </div>
      </div>
    {/snippet}
  </PageHeader>

  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <!-- Order Number Format Section -->
      <div class="settings-card settings-section">
        <OrderNumberFormatBuilder
          initialFormat={initialOrderNumberFormat}
          onSave={handleOrderNumberFormatSave}
          onCancel={() => {
            /* Optional cancel logic */
          }}
          {isSaving}
          bind:currentPreviewOrderNumber
        />
      </div>

      <!-- Print Settings Section -->
      <div class="settings-card settings-section">
        <PrintSettingsPanel
          initialSettings={initialPrintSettings}
          onSave={handlePrintSettingsSave}
          {isSaving}
          previewOrderNumber={currentPreviewOrderNumber}
        />
      </div>
    </div>

    <!-- Info Banner -->
    <div class="mt-8">
      <div class="alert shadow-lg bg-base-100 border border-base-300">
        <div class="flex items-start gap-3">
          <AlertCircle class="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h3 class="font-semibold text-base-content">Tips Pengaturan</h3>
            <div class="text-sm text-base-content/70 mt-1">
              <ul class="list-disc list-inside space-y-1">
                <li>
                  Format nomor pesanan akan diterapkan untuk semua pesanan baru
                </li>
                <li>Preview akan menampilkan contoh dengan data hari ini</li>
                <li>
                  Pengaturan cetak mempengaruhi tampilan dokumen yang dicetak
                </li>
                <li>
                  Perubahan disimpan secara otomatis setelah klik tombol simpan
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .settings-card {
    animation: slideInRight 0.5s ease-out forwards;
    opacity: 0;
  }

  .settings-card:nth-child(1) {
    animation-delay: 0.1s;
  }

  .settings-card:nth-child(2) {
    animation-delay: 0.2s;
  }

  .toast {
    animation: slideDown 0.3s ease-out;
  }

  :global(.settings-section) {
    scroll-margin-top: 2rem;
  }
</style>
