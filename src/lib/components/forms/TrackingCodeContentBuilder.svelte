<script lang="ts">
  import QRCode from "qrcode";
  import Button from "$lib/components/ui/button/Button.svelte";
  import Input from "$lib/components/ui/input/Input.svelte";
  import Label from "$lib/components/ui/label/Label.svelte";
  import RichTextEditor from "$lib/components/ui/rich-text/RichTextEditor.svelte";
  import Separator from "$lib/components/ui/separator/Separator.svelte";

  let {
    initialContent = "{tracking_code}",
    onSave,
    onCancel,
    previewOrderNumber = "ORD-20251005-001",
  } = $props<{
    initialContent?: string;
    onSave: (content: string) => void;
    onCancel: () => void;
    previewOrderNumber?: string;
  }>();

  let content = $state(initialContent);
  let qrCodeDataUrl = $state("");
  let testCustomerName = $state("John Doe");
  let editorRef: RichTextEditor;

  const availableVariables = [
    "{tracking_code}",
    "{order_number}",
    "{customer_name}",
    "{order_status}",
  ];

  $effect(() => {
    // Regenerate QR code when generatedContent changes
    generateQrCode(generatedContent);
  });

  const generatedContent = $derived(
    content
      .replace(/{tracking_code}/g, "TRK-123456789")
      .replace(/{order_number}/g, previewOrderNumber)
      .replace(/{customer_name}/g, testCustomerName)
      .replace(/{order_status}/g, "in_progress"),
  );

  async function generateQrCode(text: string) {
    console.log("Generating QR code for:", text);
    try {
      qrCodeDataUrl = await QRCode.toDataURL(text, {
        errorCorrectionLevel: "H",
        width: 256,
      });
    } catch (err) {
      console.error("Failed to generate QR code", err);
      qrCodeDataUrl = "";
    }
  }

  function handleSave() {
    onSave(content);
  }
</script>

<div class="card bg-base-100 shadow-xl p-4">
  <h2 class="card-title">Tracking Code Content Builder</h2>
  <p class="text-sm text-gray-500 mb-4">
    Define the content that will be embedded in the QR code.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label for="content-template" class="mb-2">Content Template</Label>
      <RichTextEditor
        bind:this={editorRef}
        bind:value={content}
        {availableVariables}
      />

      <h3 class="text-lg font-semibold mb-2 mt-4">Available Variables</h3>
      <div class="flex flex-wrap gap-2 mb-4">
        {#each availableVariables as variable}
          <Button
            variant="outline"
            size="sm"
            onclick={() => editorRef?.insertVariable(variable)}
            >{variable}</Button
          >
        {/each}
      </div>

      <Separator class="my-4" />

      <h3 class="text-lg font-semibold mb-2">Test Content Generator</h3>
      <div class="space-y-2">
        <div>
          <Label for="test-customer-name">Customer Name</Label>
          <Input id="test-customer-name" bind:value={testCustomerName} />
        </div>
        <!-- Add more test variables as needed -->
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Generated Content Preview</h3>
      <Input type="text" value={generatedContent} readonly class="mb-4" />

      <h3 class="text-lg font-semibold mb-2">QR Code Preview</h3>
      <div
        class="flex justify-center items-center border border-base-300 rounded-md p-4 min-h-64"
      >
        {#if qrCodeDataUrl}
          <img
            src={qrCodeDataUrl}
            alt="QR Code Preview"
            class="max-w-full max-h-full"
          />
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
