<script lang="ts">
  import QRCode from 'qrcode';
  import Button from '$lib/components/ui/button/Button.svelte';
  import Input from '$lib/components/ui/input/Input.svelte';
  import Label from '$lib/components/ui/label/Label.svelte';
  import Textarea from '$lib/components/ui/textarea/Textarea.svelte';
  import Separator from '$lib/components/ui/separator/Separator.svelte';

  let { initialContent = '{tracking_code}', onSave, onCancel } = $props<{ 
    initialContent?: string;
    onSave: (content: string) => void;
    onCancel: () => void;
  }>();

  let content = $state(initialContent);
  let qrCodeDataUrl = $state('');
  let testTrackingCode = $state('TRK-123456789');
  let testOrderNumber = $state('ORD-20251005-001');

  const availableVariables = [
    '{tracking_code}',
    '{order_number}',
    '{customer_name}',
    '{order_status}',
  ];

  $effect(() => {
    generateQrCode(generatedContent());
  });

  $effect(() => {
    // Regenerate QR code when test variables change
    generateQrCode(generatedContent());
  });

  const generatedContent = $derived(() => {
    let result = content;
    result = result.replace(/{tracking_code}/g, testTrackingCode);
    result = result.replace(/{order_number}/g, testOrderNumber);
    result = result.replace(/{customer_name}/g, 'John Doe'); // Placeholder
    result = result.replace(/{order_status}/g, 'in_progress'); // Placeholder
    return result;
  });

  async function generateQrCode(text: string) {
    console.log('Generating QR code for:', text);
    try {
      qrCodeDataUrl = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H', width: 256 });
    } catch (err) {
      console.error('Failed to generate QR code', err);
      qrCodeDataUrl = '';
    }
  }

  function insertVariable(variable: string) {
    content += variable;
  }

  function handleSave() {
    onSave(content);
  }
</script>

<div class="card bg-base-100 shadow-xl p-4">
  <h2 class="card-title">Tracking Code Content Builder</h2>
  <p class="text-sm text-gray-500 mb-4">Define the content that will be embedded in the QR code.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label for="content-template" class="mb-2">Content Template</Label>
      <Textarea id="content-template" bind:value={content} class="mb-4 h-32" />

      <h3 class="text-lg font-semibold mb-2">Available Variables</h3>
      <div class="flex flex-wrap gap-2 mb-4">
        {#each availableVariables as variable}
          <Button variant="outline" size="sm" onclick={() => insertVariable(variable)}>{variable}</Button>
        {/each}
      </div>

      <Separator class="my-4" />

      <h3 class="text-lg font-semibold mb-2">Test Content Generator</h3>
      <div class="space-y-2">
        <div>
          <Label for="test-tracking-code">Tracking Code</Label>
          <Input id="test-tracking-code" bind:value={testTrackingCode} />
        </div>
        <div>
          <Label for="test-order-number">Order Number</Label>
          <Input id="test-order-number" bind:value={testOrderNumber} />
        </div>
        <!-- Add more test variables as needed -->
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Generated Content Preview</h3>
      <Input type="text" value={generatedContent as unknown as string} readonly class="mb-4" />

      <h3 class="text-lg font-semibold mb-2">QR Code Preview</h3>
      <div class="flex justify-center items-center border border-base-300 rounded-md p-4 min-h-64">
        {#if qrCodeDataUrl}
          <img src={qrCodeDataUrl as string} alt="QR Code Preview" class="max-w-full max-h-full" />
        {:else}
          <p class="text-gray-500">QR Code will appear here</p>
        {/if}
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button variant="outline" onclick={onCancel}>Cancel</Button>
        <Button onclick={handleSave}>Save Content</Button>
      </div>
    </div>
  </div>
</div>