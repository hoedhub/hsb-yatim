<script lang="ts">
	import pdfMake from 'pdfmake/build/pdfmake';
	import pdfFonts from 'pdfmake/build/vfs_fonts';

	pdfMake.vfs = pdfFonts.pdfMake.vfs;

	let iFrame: HTMLIFrameElement | null = null;
	const bonTable = () => ({
		widths: [56, 56, 56, 56, 56, '*', '*', 40, '*', '*', 40],
		body: [
			[
				{
					colSpan: 3,
					fontSize: 20,
					border: [true, true, false, false],
					text: 'BJ-asdp'
				},
				'',
				'',
				{
					colSpan: 2,
					fontSize: 10,
					bold: true,
					border: [false, true, true, false],
					margin: [0, 7, 0, 0],
					alignment: 'right',
					text: 'TUKANG JAHIT'
				},
				'',
				{
					colSpan: 3,
					fontSize: 10,
					border: [true, true, true, false],
					margin: [0, 6, 0, 0],
					alignment: 'center',
					text: 'HSB YATIM'
				},
				'',
				'',
				{
					colSpan: 3,
					fontSize: 10,
					border: [true, true, true, false],
					margin: [0, 6, 0, 0],
					alignment: 'center',
					text: 'TKG POTONG'
				},
				'',
				''
			],
			[
				{
					fontSize: 10,
					border: [true, false, false, false],
					margin: [0, 8, 0, 0],
					alignment: 'right',
					text: 'No'
				},
				{
					fontSize: 18,
					bold: true,
					border: [false, false, false, false],
					alignment: 'center',
					text: '1'
				},
				{
					border: [false, false, false, false],
					text: ''
				},
				{
					fontSize: 10,
					border: [false, false, false, false],
					margin: [0, 8, 0, 0],
					alignment: 'center',
					text: 'Jumlah'
				},
				{
					fontSize: 16,
					border: [false, false, true, false],
					margin: [0, 2, 0, 0],
					alignment: 'center',
					text: '1 Pcs'
				},
				{
					fontSize: 10,
					border: [true, false, false, false],
					margin: [0, 8, 0, 0],
					alignment: 'center',
					text: 'No'
				},
				{
					fontSize: 18,
					bold: true,
					border: [false, false, false, false],
					alignment: 'center',
					text: '1'
				},
				{
					fontSize: 14,
					bold: true,
					border: [false, false, true, false],
					margin: [0, 4, 0, 0],
					alignment: 'center',
					text: '1 Pcs'
				},
				{
					fontSize: 10,
					border: [true, false, false, false],
					margin: [0, 8, 0, 0],
					alignment: 'center',
					text: 'No'
				},
				{
					fontSize: 18,
					bold: true,
					border: [false, false, false, false],
					alignment: 'center',
					text: '1'
				},
				{
					fontSize: 14,
					bold: true,
					border: [false, false, true, false],
					margin: [0, 4, 0, 0],
					alignment: 'center',
					text: '1 Pcs'
				}
			],
			[
				{
					fontSize: 10,
					border: [true, false, false, false],
					alignment: 'right',
					text: 'Nama'
				},
				{
					fontSize: 10,
					border: [false, false, false, false],
					colSpan: 2,
					text: 'Remlyana Lumban Gaol'
				},
				'',
				{
					fontSize: 10,
					border: [false, false, false, false],
					text: 'CS'
				},
				{
					fontSize: 10,
					border: [false, false, true, false],
					text: 'Wanita'
				},
				{
					fontSize: 8,
					border: [true, false, false, false],
					text: 'BJ-asdp'
				},
				{
					fontSize: 10,
					border: [false, false, true, false],
					colSpan: 2,
					text: 'Wanita'
				},
				'',
				{
					fontSize: 8,
					border: [true, false, false, false],
					text: 'BJ-asdp'
				},
				{
					fontSize: 10,
					border: [false, false, true, false],
					colSpan: 2,
					text: 'Wanita'
				},
				''
			],
			[
				{
					fontSize: 26,
					alignment: 'right',
					text: '62'
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: '38'
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: '39'
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: '104'
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: '42'
				},
				{
					fontSize: 16,
					bold: true,
					alignment: 'center',
					text: 'REMLYANA LUMBAN GAOL',
					colSpan: 3,
					rowSpan: 2
				},
				'',
				'',
				{
					fontSize: 16,
					bold: true,
					alignment: 'center',
					text: 'REMLYANA LUMBAN GAOL',
					colSpan: 3,
					rowSpan: 2
				},
				'',
				''
			],
			[
				{
					fontSize: 26,
					alignment: 'right',
					text: ''
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: ''
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: '26'
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: '100'
				},
				'',
				'',
				'',
				'',
				'',
				''
			],
			[
				{
					fontSize: 10,
					border: [true, false, false, false],
					bold: true,
					text: 'Wanita',
					colSpan: 4
				},
				'',
				'',
				'',
				{
					border: [false, false, true, false],
					text: ''
				},
				{
					fontSize: 20,
					border: [true, false, true, false],
					bold: true,
					text: 'CS',
					colSpan: 3
				},
				'',
				'',
				{
					fontSize: 20,
					border: [true, false, true, false],
					bold: true,
					text: 'CS',
					colSpan: 3
				},
				'',
				''
			],
			[
				{
					fontSize: 10,
					border: [true, false, false, true],
					text: 'Catatan'
				},
				{
					fontSize: 10,
					border: [false, false, true, true],
					text: 'ASDP SIBOLGA',
					colSpan: 4
				},
				'',
				'',
				'',
				{
					fontSize: 8,
					border: [true, false, false, true],
					text: 'Catatan'
				},
				{
					fontSize: 8,
					border: [false, false, true, true],
					text: 'ASDP SIBOLGA',
					colSpan: 2
				},
				'',
				{
					fontSize: 8,
					border: [true, false, false, true],
					text: 'Catatan'
				},
				{
					fontSize: 8,
					border: [false, false, true, true],
					text: 'ASDP SIBOLGA',
					colSpan: 2
				},
				''
			]
		]
	});
	const docDefinition = {
		content: [
			...Array(5)
				.fill(null)
				.map((_, idx) => {
					let obj: any = {
						table: { ...bonTable() },
						margin: [5, 5, 5, 5] as [number, number, number, number]
						// layout: 'noBorders',
						// pageOrientation: 'landscape',
						// pageMargins: [0, 0, 0, 0] as [number, number, number, number],
					};
					if ((idx + 1) % 4 === 0) {
						obj.pageBreak = 'after';
					}
					return obj;
				})
		],
		pageMargins: [0, 0, 0, 0] as [number, number, number, number]
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
<!-- <div class="relative h-full w-full"> -->
<iframe
	bind:this={iFrame}
	title="pdfDoc"
	class="absolute inset-0 top-32 h-[calc(100%-5rem)] w-full"
/>
<!-- </div> -->
