<script lang="ts">
	import pdfMake from 'pdfmake/build/pdfmake';
	import pdfFonts from 'pdfmake/build/vfs_fonts';
	pdfMake.vfs = pdfFonts.pdfMake.vfs;
	export let dataUkuran: any[];
	let iFrame: HTMLIFrameElement | null = null;
	const bonTable = (row: Record<string, any>) => ({
		widths: [56, 56, 56, 56, 56, '*', '*', 40, '*', '*', 40],
		body: [
			[
				{
					colSpan: 3,
					fontSize: 20,
					border: [true, true, false, false],
					text: row.pekerjaan
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
					text: row.nomor
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
					text: row.jumlah + ' Pcs'
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
					text: row.nomor
				},
				{
					fontSize: 14,
					bold: true,
					border: [false, false, true, false],
					margin: [0, 4, 0, 0],
					alignment: 'center',
					text: row.jumlah + ' Pcs'
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
					text: row.nomor
				},
				{
					fontSize: 14,
					bold: true,
					border: [false, false, true, false],
					margin: [0, 4, 0, 0],
					alignment: 'center',
					text: row.jumlah + ' Pcs'
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
					text: row.nama
				},
				'',
				{
					fontSize: 10,
					border: [false, false, false, false],
					text: row.jurusan
				},
				{
					fontSize: 10,
					border: [false, false, true, false],
					text: row.jenis_kelamin
				},
				{
					fontSize: 8,
					border: [true, false, false, false],
					text: row.pekerjaan
				},
				{
					fontSize: 10,
					border: [false, false, true, false],
					colSpan: 2,
					text: row.jenis_kelamin
				},
				'',
				{
					fontSize: 8,
					border: [true, false, false, false],
					text: row.pekerjaan
				},
				{
					fontSize: 10,
					border: [false, false, true, false],
					colSpan: 2,
					text: row.jenis_kelamin
				},
				''
			],
			[
				{
					fontSize: 26,
					alignment: 'right',
					text: row.ukuran01
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: row.ukuran02
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: row.ukuran03
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: row.ukuran04
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: row.ukuran05
				},
				{
					fontSize: 16,
					bold: true,
					alignment: 'center',
					text: row.nama,
					colSpan: 3,
					rowSpan: 2
				},
				'',
				'',
				{
					fontSize: 16,
					bold: true,
					alignment: 'center',
					text: row.nama,
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
					text: row.ukuran06
				},
				{
					fontSize: 26,
					alignment: 'right',
					text: row.ukuran07
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
					text: row.jenis_kelamin,
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
					text: row.jurusan,
					colSpan: 3
				},
				'',
				'',
				{
					fontSize: 20,
					border: [true, false, true, false],
					bold: true,
					text: row.jurusan,
					colSpan: 3
				},
				'',
				''
			],
			[
				{
					fontSize: 10,
					border: [true, false, false, true],
					text: row.catatan
				},
				{
					fontSize: 10,
					border: [false, false, true, true],
					text: row.pekerjaan,
					colSpan: 4
				},
				'',
				'',
				'',
				{
					fontSize: 8,
					border: [true, false, false, true],
					text: row.catatan
				},
				{
					fontSize: 8,
					border: [false, false, true, true],
					text: row.pekerjaan,
					colSpan: 2
				},
				'',
				{
					fontSize: 8,
					border: [true, false, false, true],
					text: row.catatan
				},
				{
					fontSize: 8,
					border: [false, false, true, true],
					text: row.pekerjaan,
					colSpan: 2
				},
				''
			]
		]
	});
	const docDefinition = {
		content: [
			...dataUkuran.map((row, idx) => {
				let obj: any = {
					table: { ...bonTable(row) },
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

<iframe
	bind:this={iFrame}
	title="pdfDoc"
	class="absolute inset-0 top-32 h-[calc(100%-5rem)] w-full"
/>
