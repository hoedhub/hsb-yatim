<script lang="ts">
	import pdfMake from 'pdfmake/build/pdfmake';
	import pdfFonts from 'pdfmake/build/vfs_fonts';

	pdfMake.vfs = pdfFonts.pdfMake.vfs;

	let iFrame: HTMLIFrameElement | null = null;
	let docDefinition = {
		content: [
			'First paragraph',
			'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
		]
	};

	const openPDF = () => {
		if (!iFrame) {
			throw new Error('iFrame is not initialized');
		}

		const callback = (url: string) => {
			if (iFrame) iFrame.src = url;
		};

		pdfMake.createPdf(docDefinition).getDataUrl(callback);
	};
</script>

<button type="button" on:click={openPDF}>Open PDF</button>
Home
<iframe bind:this={iFrame} title="pdfDoc" class="h-full w-full" />
