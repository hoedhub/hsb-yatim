<script lang="ts">
    import { useForm } from "svelte-simple-form";
    import { z } from "zod";
    import {
        Button,
        Input,
        Select,
        Badge,
        Checkbox,
        FormDialog,
        StatusBadge,
        Label,
        Separator,
        Switch,
        DataTable,
        Textarea,
        SearchInput,
    } from "$lib/components/ui";
    import { FormControl, FormLabel, FormMessage } from "$lib/components/ui/form";
    import { showToast } from "$lib/stores/toast";
    import type { ToastPosition } from "$lib/stores/toast";

    const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        message: z.string().min(10),
    });

    const { form } = useForm<z.infer<typeof schema>>({
        initialValues: {
            name: "",
            email: "",
            message: "",
        },
        validation: {
            zod: schema,
        },
        onSubmit: async (data: z.infer<typeof schema>) => {
            showToast(`Submitted: ${JSON.stringify(data)}`, { variant: "success" });
            closeDialog();
        },
    });

    let inputValue = $state("");
    let selectValue = $state("");
    let checkboxValue = $state(false);
    let switchValue = $state(false);
    let textareaValue = $state("");
    let dialogOpen = $state(false);
    let searchValue = $state("");
    let toastPosition: ToastPosition = $state("bottom-right");

    let selectOptions = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ];

    // Sample data for DataTable
    let tableData = $state([
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            status: "active",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "User",
            status: "inactive",
        },
        {
            id: 3,
            name: "Bob Johnson",
            email: "bob@example.com",
            role: "User",
            status: "active",
        },
        {
            id: 4,
            name: "Alice Brown",
            email: "alice@example.com",
            role: "Moderator",
            status: "pending",
        },
    ]);

    let tableColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "role", label: "Role" },
        {
            key: "status",
            label: "Status",
            render: (value: any) => `<span class="badge badge-${value === 'active' ? 'success' : 'error'}">${value}</span>`,
        },
    ];

    function handleClick() {
        alert("Button clicked!");
    }

    function openDialog() {
        dialogOpen = true;
    }

    function closeDialog() {
        dialogOpen = false;
    }

    function handleSearch(value: string) {
        searchValue = value;
        console.log("Search value:", value);
    }

    function handleSort(key: string | number | symbol, direction: "asc" | "desc") {
        tableData = [...tableData].sort((a, b) => {
            const aValue = a[key as keyof typeof a];
            const bValue = b[key as keyof typeof b];

            if (aValue < bValue) {
                return direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }
</script>

<div class="p-4 space-y-4">
    <h1 class="text-2xl font-bold">UI Component Test Page</h1>

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Buttons</h2>
        <div class="space-y-2">
            <h3 class="text-lg font-medium">Variants</h3>
            <div class="flex flex-wrap gap-2">
                <Button onclick={handleClick}>Primary</Button>
                <Button variant="secondary" onclick={handleClick}>Secondary</Button>
                <Button variant="accent" onclick={handleClick}>Accent</Button>
                <Button variant="info" onclick={handleClick}>Info</Button>
                <Button variant="success" onclick={handleClick}>Success</Button>
                <Button variant="warning" onclick={handleClick}>Warning</Button>
                <Button variant="error" onclick={handleClick}>Error</Button>
                <Button variant="ghost" onclick={handleClick}>Ghost</Button>
                <Button variant="link" onclick={handleClick}>Link</Button>
                <Button variant="outline" onclick={handleClick}>Outline</Button>
                <Button variant="active" onclick={handleClick}>Active</Button>
                <Button variant="disabled" onclick={handleClick} disabled>Disabled</Button>
            </div>
            <h3 class="text-lg font-medium">Sizes</h3>
            <div class="flex flex-wrap gap-2 items-center">
                <Button size="xs" onclick={handleClick}>Extra Small</Button>
                <Button size="sm" onclick={handleClick}>Small</Button>
                <Button size="md" onclick={handleClick}>Medium</Button>
                <Button size="lg" onclick={handleClick}>Large</Button>
            </div>
            <h3 class="text-lg font-medium">Shapes</h3>
            <div class="flex flex-wrap gap-2">
                <Button wide onclick={handleClick}>Wide</Button>
                <Button block onclick={handleClick}>Block</Button>
                <Button circle onclick={handleClick}>C</Button>
                <Button square onclick={handleClick}>S</Button>
            </div>
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Inputs</h2>
        <div class="space-y-2">
            <h3 class="text-lg font-medium">Variants</h3>
            <div class="flex flex-wrap gap-4">
                <Input placeholder="Default input" bind:value={inputValue} />
                <Input placeholder="Primary input" primary bind:value={inputValue} />
                <Input placeholder="Secondary input" secondary bind:value={inputValue} />
                <Input placeholder="Accent input" accent bind:value={inputValue} />
                <Input placeholder="Info input" info bind:value={inputValue} />
                <Input placeholder="Success input" success bind:value={inputValue} />
                <Input placeholder="Warning input" warning bind:value={inputValue} />
                <Input placeholder="Error input" error bind:value={inputValue} />
                <Input placeholder="Disabled input" bind:value={inputValue} disabled />
            </div>
            <h3 class="text-lg font-medium">Sizes</h3>
            <div class="flex flex-wrap gap-4 items-center">
                <Input placeholder="Extra Small" size="xs" bind:value={inputValue} />
                <Input placeholder="Small" size="sm" bind:value={inputValue} />
                <Input placeholder="Medium" size="md" bind:value={inputValue} />
                <Input placeholder="Large" size="lg" bind:value={inputValue} />
            </div>
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Selects</h2>
        <div class="space-y-2">
            <h3 class="text-lg font-medium">Variants</h3>
            <div class="flex flex-wrap gap-4">
                <Select placeholder="Default select" options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Primary select" primary options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Secondary select" secondary options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Accent select" accent options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Info select" info options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Success select" success options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Warning select" warning options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Error select" error options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Disabled select" options={selectOptions} bind:value={selectValue} disabled />
            </div>
            <h3 class="text-lg font-medium">Sizes</h3>
            <div class="flex flex-wrap gap-4 items-center">
                <Select placeholder="Extra Small" size="xs" options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Small" size="sm" options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Medium" size="md" options={selectOptions} bind:value={selectValue} />
                <Select placeholder="Large" size="lg" options={selectOptions} bind:value={selectValue} />
            </div>
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Badges</h2>
        <div class="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="outline">Outline</Badge>
        </div>

        <div class="flex flex-wrap gap-2">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Status Badges</h2>
        <div class="flex flex-wrap gap-2">
            <StatusBadge status="default">Default</StatusBadge>
            <StatusBadge status="primary">Primary</StatusBadge>
            <StatusBadge status="secondary">Secondary</StatusBadge>
            <StatusBadge status="accent">Accent</StatusBadge>
            <StatusBadge status="ghost">Ghost</StatusBadge>
            <StatusBadge status="info">Info</StatusBadge>
            <StatusBadge status="success">Success</StatusBadge>
            <StatusBadge status="warning">Warning</StatusBadge>
            <StatusBadge status="error">Error</StatusBadge>
            <StatusBadge status="outline">Outline</StatusBadge>
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Labels</h2>
        <div class="space-y-2">
            <Label for="test-input">Default Label</Label>
            <Input id="test-input" placeholder="Input with label" />

            <Label for="test-input-required" required>Required Label</Label>
            <Input id="test-input-required" placeholder="Required input" />

            <Label for="test-input-primary" variant="primary">
                Primary Label
            </Label>
            <Input id="test-input-primary" placeholder="Primary input" />
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Checkboxes</h2>
        <div class="flex flex-wrap gap-4 items-center">
            <Checkbox bind:checked={checkboxValue} /> Default
            <Checkbox primary bind:checked={checkboxValue} /> Primary
            <Checkbox secondary bind:checked={checkboxValue} /> Secondary
            <Checkbox success bind:checked={checkboxValue} /> Success
            <Checkbox error bind:checked={checkboxValue} /> Error
            <Checkbox bind:checked={checkboxValue} disabled /> Disabled
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Switches</h2>
        <div class="flex flex-wrap gap-4 items-center">
            <Switch bind:checked={switchValue} /> Default
            <Switch primary bind:checked={switchValue} /> Primary
            <Switch secondary bind:checked={switchValue} /> Secondary
            <Switch success bind:checked={switchValue} /> Success
            <Switch error bind:checked={switchValue} /> Error
            <Switch bind:checked={switchValue} disabled /> Disabled
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Textareas</h2>
        <div class="space-y-2">
            <h3 class="text-lg font-medium">Variants</h3>
            <div class="flex flex-wrap gap-4">
                <Textarea placeholder="Default textarea" bind:value={textareaValue} />
                <Textarea placeholder="Primary textarea" primary bind:value={textareaValue} />
                <Textarea placeholder="Secondary textarea" secondary bind:value={textareaValue} />
                <Textarea placeholder="Accent textarea" accent bind:value={textareaValue} />
                <Textarea placeholder="Info textarea" info bind:value={textareaValue} />
                <Textarea placeholder="Success textarea" success bind:value={textareaValue} />
                <Textarea placeholder="Warning textarea" warning bind:value={textareaValue} />
                <Textarea placeholder="Error textarea" error bind:value={textareaValue} />
                <Textarea placeholder="Disabled textarea" bind:value={textareaValue} disabled />
            </div>
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Data Tables</h2>
        <div class="space-y-2">
            <h3 class="text-lg font-medium">Default</h3>
            <DataTable data={tableData} columns={tableColumns} striped hover onSort={handleSort} />
            <h3 class="text-lg font-medium">Compact</h3>
            <DataTable data={tableData} columns={tableColumns} striped hover compact onSort={handleSort} />
            <h3 class="text-lg font-medium">Loading</h3>
            <DataTable data={tableData} columns={tableColumns} striped hover loading onSort={handleSort} />
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Form Controls</h2>
        <div class="max-w-xs space-y-4">
            <h3 class="text-lg font-medium">Example with Validation</h3>
            <p class="text-sm">
                This example is connected to the form in the dialog. Try to submit an invalid email in
                the dialog to see the error state reflected here.
            </p>
            <FormControl>
                <FormLabel>Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="email@example.com"
                    bind:value={form.data.email}
                    error={!!form.errors.email}
                />
                {#if form.errors.email}
                    <FormMessage error>{form.errors.email[0]}</FormMessage>
                {/if}
            </FormControl>
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Dialogs</h2>
        <div class="flex flex-wrap gap-2">
            <Button onclick={openDialog}>Open Dialog</Button>
        </div>
    </div>

    <FormDialog
        bind:open={dialogOpen}
        title="Sample Dialog"
        description="This is a sample dialog with a form inside."
        onOpenChange={closeDialog}
    >
        <form use:form.handler>
            <div class="space-y-4">
                <Label for="name-input">Name</Label>
                <Input id="name-input" name="name" bind:value={form.data.name} error={!!form.errors.name} />
                {#if form.errors.name}<span class="text-sm text-red-500">{form.errors.name[0]}</span>{/if}

                <Label for="email-input">Email</Label>
                <Input
                    id="email-input"
                    name="email"
                    type="email"
                    bind:value={form.data.email}
                    error={!!form.errors.email}
                />
                {#if form.errors.email}<span class="text-sm text-red-500">{form.errors.email[0]}</span>{/if}

                <Label for="message-input">Message</Label>
                <Textarea
                    id="message-input"
                    name="message"
                    bind:value={form.data.message}
                    error={!!form.errors.message}
                />
                {#if form.errors.message}<span class="text-sm text-red-500"
                    >{form.errors.message[0]}</span
                >{/if}

                <Button type="submit" disabled={form.isSubmitting}>
                    {form.isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </form>
    </FormDialog>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Toast Notifications</h2>
        <div class="space-y-2">
            <h3 class="text-lg font-medium">Positions</h3>
            <div class="flex flex-wrap gap-2">
                <Select
                    placeholder="Select position"
                    options={[
                        { value: "top-left", label: "Top Left" },
                        { value: "top-center", label: "Top Center" },
                        { value: "top-right", label: "Top Right" },
                        { value: "bottom-left", label: "Bottom Left" },
                        { value: "bottom-center", label: "Bottom Center" },
                        { value: "bottom-right", label: "Bottom Right" },
                    ]}
                    bind:value={toastPosition}
                />
            </div>
            <h3 class="text-lg font-medium">Variants</h3>
            <div class="flex flex-wrap gap-2">
                <Button
                    onclick={() =>
                        showToast("This is a success message!", {
                            variant: "success",
                            position: toastPosition,
                        })}
                >
                    Show Success Toast
                </Button>
                <Button
                    onclick={() =>
                        showToast("This is an error message!", { variant: "error", position: toastPosition })}
                >
                    Show Error Toast
                </Button>
                <Button
                    onclick={() =>
                        showToast("This is an info message!", { variant: "info", position: toastPosition })}
                >
                    Show Info Toast
                </Button>
            </div>
        </div>
    </div>

    <Separator />

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Search Input</h2>
        <div class="space-y-4">
            <SearchInput
                placeholder="Search something..."
                bind:value={searchValue}
                onSearch={handleSearch}
            />
            <p>Current search value: {searchValue}</p>
        </div>
    </div>
</div>
