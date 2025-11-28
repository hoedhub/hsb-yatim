<script lang="ts">
    import { onMount } from "svelte";
    import { X } from "lucide-svelte";

    let { value = $bindable(""), availableVariables = [] } = $props<{
        value: string;
        availableVariables: string[];
    }>();

    let editor: HTMLDivElement;

    // Initialize content
    onMount(() => {
        if (editor && value) {
            renderContent();
        }
    });

    $effect(() => {
        // If value changes externally and editor is empty (or we want to force sync), re-render
        // Note: syncing two-way contenteditable is tricky.
        // For now, we only sync FROM value TO editor if editor is empty to avoid overwriting user input while typing.
        if (editor && value && editor.innerHTML === "") {
            renderContent();
        }
    });

    function renderContent() {
        if (!editor) return;

        // Parse the value string and convert variables to chips
        // Regex to match variables like {tracking_code}
        const regex = /({[a-zA-Z0-9_]+})/g;
        const parts = value.split(regex);

        editor.innerHTML = "";

        parts.forEach((part: string) => {
            if (!part) return;

            // Since we split by the regex, any part that matches a variable format
            // AND is in availableVariables should be a chip.
            // We don't need to reuse the global regex for testing as it causes stateful issues (lastIndex).
            if (availableVariables.includes(part)) {
                editor.appendChild(createChip(part));
            } else {
                editor.appendChild(document.createTextNode(part));
            }
        });
    }

    function createChip(variable: string) {
        const span = document.createElement("span");
        span.contentEditable = "false";
        span.className =
            "inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 select-none";
        span.dataset.variable = variable;

        const text = document.createElement("span");
        text.textContent = variable.replace(/[{}]/g, ""); // Remove braces for display
        span.appendChild(text);

        // X button is purely visual/clickable to remove, but since it's contentEditable=false,
        // backspace works too. But let's add a click handler just in case.
        // Actually, handling click inside contenteditable=false is tricky.
        // Best to just let the user delete it with backspace/delete.
        // But user asked for "X" button.

        const xBtn = document.createElement("button");
        xBtn.className =
            "hover:bg-primary/20 rounded-full p-0.5 ml-1 transition-colors";
        xBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
        xBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            span.remove();
            updateValue();
        };

        span.appendChild(xBtn);

        return span;
    }

    function updateValue() {
        if (!editor) return;

        let newValue = "";

        editor.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                newValue += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                if (el.dataset.variable) {
                    newValue += el.dataset.variable;
                } else {
                    newValue += el.textContent;
                }
            }
        });

        value = newValue;
    }

    export function insertVariable(variable: string) {
        if (!editor) return;

        const chip = createChip(variable);

        // Insert at cursor if possible
        const selection = window.getSelection();
        if (
            selection &&
            selection.rangeCount > 0 &&
            editor.contains(selection.anchorNode)
        ) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(chip);

            // Move cursor after chip
            range.setStartAfter(chip);
            range.setEndAfter(chip);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            // Append to end
            editor.appendChild(chip);
        }

        updateValue();
        editor.focus();
    }
    function handleInput(e: Event) {
        checkForVariableConversion();
        updateValue();
    }

    function checkForVariableConversion() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        // We only care if we are in a text node
        if (node.nodeType !== Node.TEXT_NODE) return;

        const text = node.textContent || "";
        const cursorOffset = range.startOffset;

        // Look for pattern ending at cursor
        // We look for {something} ending exactly at cursorOffset
        const textBeforeCursor = text.slice(0, cursorOffset);

        // Regex to match {variable_name} at the end of string
        const match = textBeforeCursor.match(/({[a-zA-Z0-9_]+})$/);

        if (match) {
            const variable = match[1];
            if (availableVariables.includes(variable)) {
                // Found a match!
                const startIndex = cursorOffset - variable.length;

                const textNode = node as Text;
                // Ensure parent exists
                if (!textNode.parentNode) return;

                const variableNode = textNode.splitText(startIndex);
                // textNode is now "prefix"
                // variableNode is "{var}suffix" (or just "{var}" if at end)

                // We need to split again to isolate the variable text from any suffix
                const suffixNode = variableNode.splitText(variable.length);
                // variableNode is now "{var}"
                // suffixNode is "suffix" (or empty)

                const chip = createChip(variable);
                textNode.parentNode.replaceChild(chip, variableNode);

                // Move cursor after chip
                const newRange = document.createRange();
                newRange.setStartAfter(chip);
                newRange.setEndAfter(chip); // Collapsed

                selection.removeAllRanges();
                selection.addRange(newRange);

                // Ensure there is a text node after the chip to type into
                // If suffixNode is empty or doesn't exist, we might want to ensure a text node
                if (
                    !chip.nextSibling ||
                    (chip.nextSibling.nodeType === Node.TEXT_NODE &&
                        chip.nextSibling.textContent === "")
                ) {
                    // If next sibling is empty text node, that's fine, we are in it (or after chip)
                    // But if there is NO next sibling, we should add a space or empty text node
                    if (!chip.nextSibling) {
                        const space = document.createTextNode("\u00A0"); // nbsp to ensure caret placement
                        chip.parentNode?.appendChild(space);
                        // Move cursor into the space
                        newRange.setStart(space, 1);
                        newRange.setEnd(space, 1);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    }
                }
            }
        }
    }
</script>

<div
    bind:this={editor}
    contenteditable="true"
    class="textarea textarea-bordered w-full h-32 p-3 overflow-y-auto leading-relaxed"
    oninput={handleInput}
    role="textbox"
    tabindex="0"
></div>

<style>
    /* Remove outline on focus since textarea-bordered handles it */
    [contenteditable]:focus {
        outline: none;
    }
</style>
