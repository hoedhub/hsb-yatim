<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
</script>

<div class="print-layout">
    <div class="print-header">
        <div class="print-logo">
            <h1 class="text-2xl font-bold">Tiket Jahit</h1>
        </div>
        <div class="print-title">
            <h2 class="text-xl">Order Details</h2>
        </div>
    </div>

    <div class="print-content">
        {@render children()}
    </div>

    <div class="print-footer">
        <p>Generated on {new Date().toLocaleDateString()}</p>
        <p>Thank you for your business!</p>
    </div>
</div>

<style>
    @media print {
        .print-layout {
            font-family: Arial, sans-serif;
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
        }

        .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
        }

        .print-content {
            margin-bottom: 1rem;
        }

        .print-footer {
            border-top: 1px solid #000;
            padding-top: 1rem;
            text-align: center;
        }

        /* Hide everything else when printing */
        :global(body *) {
            visibility: hidden;
        }

        .print-layout,
        .print-layout * {
            visibility: visible;
        }

        .print-layout {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
    }

    /* Screen styles */
    .print-layout {
        background: white;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }

    .print-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
    }

    .print-footer {
        border-top: 1px solid #e0e0e0;
        padding-top: 1rem;
        text-align: center;
        color: #666;
    }
</style>
