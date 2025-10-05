<script lang="ts">
  import Button from '$lib/components/ui/button/Button.svelte';
  import Input from '$lib/components/ui/input/Input.svelte';
  import Label from '$lib/components/ui/label/Label.svelte';
  import Separator from '$lib/components/ui/separator/Separator.svelte';
  import { Trash2, GripVertical } from 'lucide-svelte';
  import { dndzone } from 'svelte-dnd-action';
  import SortableFormatItem from './SortableFormatItem.svelte';

  interface FormatComponent {
    id: string;
    type: 'text' | 'year' | 'month' | 'day' | 'counter';
    value?: string;
  }

  let { initialFormat = 'ORD-{YYYY}{MM}{DD}-{XXX}', onSave, onCancel } = $props<{ 
    initialFormat?: string;
    onSave: (format: string) => void;
    onCancel: () => void;
  }>();

  let components: FormatComponent[] = $state([]);

  const defaultComponents: FormatComponent[] = [
    { id: 'text-1', type: 'text', value: 'ORD-' },
    { id: 'year', type: 'year' },
    { id: 'month', type: 'month' },
    { id: 'day', type: 'day' },
    { id: 'counter', type: 'counter', value: 'XXX' },
  ];

  $effect(() => {
    parseFormatString(initialFormat);
  });

  function parseFormatString(formatString: string) {
    const regex = /{(\w+)}|([^}]+)/g;
    let match;
    const parsedComponents: FormatComponent[] = [];
    let idCounter = 0;

    while ((match = regex.exec(formatString)) !== null) {
      if (match[1]) { // Matched a {KEY} component
        const key = match[1];
        if (key === 'YYYY') parsedComponents.push({ id: `year-${idCounter++}`, type: 'year' });
        else if (key === 'MM') parsedComponents.push({ id: `month-${idCounter++}`, type: 'month' });
        else if (key === 'DD') parsedComponents.push({ id: `day-${idCounter++}`, type: 'day' });
        else if (key === 'XXX') parsedComponents.push({ id: `counter-${idCounter++}`, type: 'counter', value: 'XXX' });
        else parsedComponents.push({ id: `text-${idCounter++}`, type: 'text', value: `{${key}}` }); // Fallback for unknown keys
      } else if (match[2]) { // Matched plain text
        parsedComponents.push({ id: `text-${idCounter++}`, type: 'text', value: match[2] });
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

  function addComponent(type: FormatComponent['type']) {
    const newId = `${type}-${Date.now()}`;
    let newComponent: FormatComponent;
    if (type === 'text') {
      newComponent = { id: newId, type, value: '' };
    } else if (type === 'counter') {
      newComponent = { id: newId, type, value: 'XXX' };
    } else {
      newComponent = { id: newId, type };
    }
    components = [...components, newComponent];
  }

  function removeComponent(id: string) {
    components = components.filter((comp: FormatComponent) => comp.id !== id);
  }

  function updateTextComponent(id: string, value: string) {
    components = components.map((comp: FormatComponent) => (comp.id === id ? { ...comp, value } : comp));
  }

  const generatedFormat = $derived(() => {
    return components.map((comp: FormatComponent) => {
      if (comp.type === 'text') return comp.value;
      if (comp.type === 'year') return '{YYYY}';
      if (comp.type === 'month') return '{MM}';
      if (comp.type === 'day') return '{DD}';
      if (comp.type === 'counter') return '{XXX}'; // Assuming fixed counter representation
      return '';
    }).join('');
  });

  const previewOrderNumber = $derived(() => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    let counter = 123; // Example counter

    return components.map((comp: FormatComponent) => {
      if (comp.type === 'text') return comp.value;
      if (comp.type === 'year') return year;
      if (comp.type === 'month') return month;
      if (comp.type === 'day') return day;
      if (comp.type === 'counter') return comp.value || 'XXX'; // Use value if available, else XXX
      return '';
    }).join('');
  });

  function handleSave() {
    onSave(generatedFormat);
  }

  function handleReset() {
    parseFormatString(initialFormat);
  }
</script>

<div class="card bg-base-100 shadow-xl p-4">
  <h2 class="card-title">Order Number Format Builder</h2>
  <p class="text-sm text-gray-500 mb-4">Drag and drop components to build your order number format.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <h3 class="text-lg font-semibold mb-2">Available Components</h3>
      <div class="flex flex-wrap gap-2 mb-4">
        <Button onclick={() => addComponent('text')}>Add Text</Button>
        <Button onclick={() => addComponent('year')}>Add Year</Button>
        <Button onclick={() => addComponent('month')}>Add Month</Button>
        <Button onclick={() => addComponent('day')}>Add Day</Button>
        <Button onclick={() => addComponent('counter')}>Add Counter</Button>
      </div>

      <h3 class="text-lg font-semibold mb-2">Current Format</h3>
      <div
        use:dndzone={{ items: components }}
        onconsider={handleDndConsider}
        onfinalize={handleDndFinalize}
        class="min-h-[100px] border-2 border-dashed border-base-300 rounded-md p-2"
      >
        {#each components as component (component.id)}
          <SortableFormatItem {component} onRemove={removeComponent} onUpdateText={updateTextComponent} />
        {:else}
          <p class="text-center text-gray-500">Drag components here or add from above</p>
        {/each}
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Generated Format String</h3>
      <Input type="text" value={generatedFormat as unknown as string} readonly class="mb-4" />

      <h3 class="text-lg font-semibold mb-2">Preview Order Number</h3>
      <Input type="text" value={previewOrderNumber as unknown as string} readonly class="mb-4" />

      <div class="flex justify-end gap-2">
        <Button variant="outline" onclick={onCancel}>Cancel</Button>
        <Button variant="ghost" onclick={handleReset}>Reset</Button>
        <Button onclick={handleSave}>Save Format</Button>
      </div>
    </div>
  </div>
</div>
