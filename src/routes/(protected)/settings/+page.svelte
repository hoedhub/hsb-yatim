<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import PageHeader from '$lib/components/layout/PageHeader.svelte';
  import OrderNumberFormatBuilder from '$lib/components/forms/OrderNumberFormatBuilder.svelte';
  import PrintSettingsPanel from '$lib/components/forms/PrintSettingsPanel.svelte';
  import { enhance } from '$app/forms';
  import type { Settings } from '$lib/server/db/schema';

  let { data } = $props();

  // Group settings by category for easier access
  let orderSettings = $state(data.settings.order || []);
  let printSettings = $state(data.settings.print || []);

  // Extract specific settings for components
  let initialOrderNumberFormat = orderSettings.find((s: Settings) => s.key === 'order_number_format')?.value || 'ORD-{YYYY}{MM}{DD}-{XXX}';
  let initialPrintSettings = {
    print_paper_size: printSettings.find((s: Settings) => s.key === 'print_paper_size')?.value || 'A4',
    show_print_preview: printSettings.find((s: Settings) => s.key === 'show_print_preview')?.value === 'true',
    tracking_code_content: printSettings.find((s: Settings) => s.key === 'tracking_code_content')?.value || '{tracking_code}',
  };

  async function handleOrderNumberFormatSave(format: string) {
    const setting = orderSettings.find((s: Settings) => s.key === 'order_number_format');
    if (setting) {
      const originalValue = setting.value;
      setting.value = format; // Optimistic update

      const formData = new FormData();
      formData.append('key', setting.key);
      formData.append('value', format);

      const response = await fetch('?/update', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setting.value = originalValue; // Rollback
        alert('Failed to update order number format.'); // Replace with toast notification
      } else {
        invalidateAll(); // Invalidate data to refetch from server
        alert('Order number format updated successfully!'); // Replace with toast notification
      }
    }
  }

  async function handlePrintSettingsSave(newPrintSettings: typeof initialPrintSettings) {
    const updates: { key: string; value: string }[] = [];
    const originalValues: { key: string; value: string }[] = [];

    for (const key in newPrintSettings) {
      const settingKey = key as keyof typeof newPrintSettings;
      const setting = printSettings.find((s: Settings) => s.key === settingKey);
      if (setting) {
        const newValue = String(newPrintSettings[settingKey]);
        if (setting.value !== newValue) {
          originalValues.push({ key: setting.key, value: setting.value || '' });
          setting.value = newValue; // Optimistic update
          updates.push({ key: setting.key, value: newValue });
        }
      }
    }

    if (updates.length > 0) {
      const formData = new FormData();
      updates.forEach(update => {
        formData.append('key', update.key);
        formData.append('value', update.value);
      });

      const response = await fetch('?/update', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        originalValues.forEach((u: { key: string; value: string }) => {
          const setting = printSettings.find((s: Settings) => s.key === u.key);
          if (setting) setting.value = u.value; // Rollback
        });
        alert('Failed to update print settings.'); // Replace with toast notification
      } else {
        invalidateAll(); // Invalidate data to refetch from server
        alert('Print settings updated successfully!'); // Replace with toast notification
      }
    }
  }
</script>

<PageHeader title="Settings" subtitle="Manage application settings" />

<div class="container mx-auto py-8">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <OrderNumberFormatBuilder 
      initialFormat={initialOrderNumberFormat}
      onSave={handleOrderNumberFormatSave}
      onCancel={() => { /* Implement cancel logic if needed */ }}
    />

    <PrintSettingsPanel 
      initialSettings={initialPrintSettings}
      onSave={handlePrintSettingsSave}
    />
  </div>
</div>