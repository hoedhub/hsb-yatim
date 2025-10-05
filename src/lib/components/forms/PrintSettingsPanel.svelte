<script lang="ts">
  import Button from '$lib/components/ui/button/Button.svelte';
  import Label from '$lib/components/ui/label/Label.svelte';
  import Select from '$lib/components/ui/select/Select.svelte';
  import Switch from '$lib/components/ui/switch/Switch.svelte';
  import Separator from '$lib/components/ui/separator/Separator.svelte';
  import TrackingCodeContentBuilder from './TrackingCodeContentBuilder.svelte';

  let { initialSettings, onSave } = $props<{ 
    initialSettings: { 
      print_paper_size: string;
      show_print_preview: boolean;
      tracking_code_content: string;
    };
    onSave: (settings: typeof initialSettings) => void;
  }>();

  let paperSize = $state(initialSettings.print_paper_size);
  let showPreview = $state(initialSettings.show_print_preview);
  let trackingCodeContent = $state(initialSettings.tracking_code_content);

  const paperSizeOptions = [
    { value: 'A4', label: 'A4' },
    { value: 'A5', label: 'A5' },
    { value: 'Thermal80', label: 'Thermal 80mm' },
    { value: 'Thermal58', label: 'Thermal 58mm' },
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

<div class="card bg-base-100 shadow-xl p-4">
  <h2 class="card-title">Print Settings</h2>
  <p class="text-sm text-gray-500 mb-4">Configure print-related settings.</p>

  <div class="space-y-6">
    <div>
      <Label for="paper-size" class="mb-2">Default Paper Size</Label>
      <Select id="paper-size" bind:value={paperSize} options={paperSizeOptions} />
    </div>

    <div class="flex items-center justify-between">
      <Label for="show-preview">Show Print Preview</Label>
      <Switch id="show-preview" bind:checked={showPreview} />
    </div>

    <Separator class="my-4" />

    <TrackingCodeContentBuilder 
      initialContent={trackingCodeContent}
      onSave={handleTrackingCodeContentSave}
      onCancel={() => { /* No-op for now, or implement specific cancel logic */ }}
    />

    <div class="flex justify-end gap-2 mt-4">
      <Button onclick={handleSave}>Save Print Settings</Button>
    </div>
  </div>
</div>