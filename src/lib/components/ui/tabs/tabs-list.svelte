<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js.js';

	type $$Props = TabsPrimitive.ListProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List
	class={cn(
		'inline-flex h-10 max-w-full items-center overflow-x-auto overflow-y-hidden rounded-md bg-muted p-1 text-muted-foreground',
		className
	)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.List>
