import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import MeasurementLabelForm from '$lib/components/forms/MeasurementLabelForm.svelte';

describe('MeasurementLabelForm', () => {
	it('renders correctly', async () => {
		const { getByText, getByRole } = render(MeasurementLabelForm);
		await expect(getByText('Nama Label')).toBeInTheDocument();
		await expect(getByText('Satuan Standar')).toBeInTheDocument();
		await expect(getByRole('button', { name: 'Simpan' })).toBeInTheDocument();
	});

	// TODO: Add more comprehensive tests for validation
});
