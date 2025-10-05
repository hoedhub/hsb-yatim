import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import CustomerForm from '$lib/components/forms/CustomerForm.svelte';

describe('CustomerForm', () => {
	it('renders correctly', async () => {
		const { getByText, getByRole } = render(CustomerForm);
		await expect(getByText('Nama')).toBeInTheDocument();
		await expect(getByText('Tipe')).toBeInTheDocument();
		await expect(getByRole('button', { name: 'Simpan' })).toBeInTheDocument();
	});

	// TODO: Add more comprehensive tests for validation and conditional fields
});
