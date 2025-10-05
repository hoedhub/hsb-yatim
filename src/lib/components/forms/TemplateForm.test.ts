import { render } from 'vitest-browser-svelte';
import { describe, it, expect } from 'vitest';
import TemplateForm from '$lib/components/forms/TemplateForm.svelte';

describe('TemplateForm', () => {
	it('renders correctly', async () => {
		const { getByText, getByRole } = render(TemplateForm);
		await expect(getByText('Nama Template')).toBeInTheDocument();
		await expect(getByText('Deskripsi')).toBeInTheDocument();
		await expect(getByText('Label Tersedia')).toBeInTheDocument();
		await expect(getByText('Label Dipilih')).toBeInTheDocument();
		await expect(getByRole('button', { name: 'Simpan Template' })).toBeInTheDocument();
	});

	// TODO: Add more comprehensive tests for validation and drag-and-drop functionality
});
