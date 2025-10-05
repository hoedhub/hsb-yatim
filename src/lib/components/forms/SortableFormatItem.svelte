<script lang="ts">
  import { Trash2, GripVertical } from 'lucide-svelte';
  import Button from '$lib/components/ui/button/Button.svelte';
  import Input from '$lib/components/ui/input/Input.svelte';

  let { component, onRemove, onUpdateText } = $props<{ 
    component: { id: string; type: 'text' | 'year' | 'month' | 'day' | 'counter'; value?: string; };
    onRemove: (id: string) => void;
    onUpdateText: (id: string, value: string) => void;
  }>();
</script>

<div class="flex items-center gap-2 p-2 border rounded-md bg-base-200 mb-2">
  <button class="cursor-grab text-gray-500 handle">
    <GripVertical class="w-4 h-4" />
  </button>
  {#if component.type === 'text'}
    <Input
      type="text"
      value={component.value}
      oninput={(e: Event) => onUpdateText(component.id, (e.target as HTMLInputElement).value)}
      class="flex-grow"
    />
  {:else if component.type === 'year'}
    <span class="badge badge-info">Year (YYYY)</span>
  {:else if component.type === 'month'}
    <span class="badge badge-info">Month (MM)</span>
  {:else if component.type === 'day'}
    <span class="badge badge-info">Day (DD)</span>
  {:else if component.type === 'counter'}
    <span class="badge badge-warning">Counter (XXX)</span>
  {/if}
  <Button variant="ghost" onclick={() => onRemove(component.id)}>
    <Trash2 class="w-4 h-4 text-error" />
  </Button>
</div>