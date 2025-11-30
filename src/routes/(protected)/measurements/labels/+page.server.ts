import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { measurementLabel, measurementTemplateLabel, measurement } from '$lib/server/db/schema';
import { eq, and, not } from 'drizzle-orm';
import { measurementLabelSchema } from '$lib/schemas';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const showInactive = url.searchParams.get('show_inactive') === 'true';

    const labels = await db.query.measurementLabel.findMany({
        where: showInactive ? undefined : eq(measurementLabel.is_active, true),
        orderBy: (labels, { asc }) => [asc(labels.name)]
    });

    return {
        labels,
        showInactive
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        // Parse and validate
        const result = measurementLabelSchema.safeParse(data);
        if (!result.success) {
            return fail(400, {
                message: 'Validasi gagal',
                errors: result.error.flatten().fieldErrors
            });
        }

        try {
            await db.insert(measurementLabel).values({
                name: result.data.name,
                default_unit: result.data.default_unit,
                is_active: true
            });

            return { success: true, message: 'Label berhasil dibuat' };
        } catch (error) {
            console.error('Error creating label:', error);
            return fail(500, { message: 'Gagal membuat label' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const data = Object.fromEntries(formData);

        if (!id) return fail(400, { message: 'ID tidak valid' });

        const result = measurementLabelSchema.safeParse(data);
        if (!result.success) {
            return fail(400, {
                message: 'Validasi gagal',
                errors: result.error.flatten().fieldErrors
            });
        }

        try {
            await db.update(measurementLabel)
                .set({
                    name: result.data.name,
                    default_unit: result.data.default_unit
                })
                .where(eq(measurementLabel.id, id));

            return { success: true, message: 'Label berhasil diperbarui' };
        } catch (error) {
            console.error('Error updating label:', error);
            return fail(500, { message: 'Gagal memperbarui label' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) return fail(400, { message: 'ID tidak valid' });

        try {
            // Check usage in templates
            const usedInTemplates = await db.query.measurementTemplateLabel.findFirst({
                where: eq(measurementTemplateLabel.label_id, id)
            });

            // Check usage in measurements
            const usedInMeasurements = await db.query.measurement.findFirst({
                where: eq(measurement.label_id, id)
            });

            if (usedInTemplates || usedInMeasurements) {
                // Soft delete
                await db.update(measurementLabel)
                    .set({ is_active: false })
                    .where(eq(measurementLabel.id, id));

                return { success: true, message: 'Label diarsipkan (karena sedang digunakan)' };
            } else {
                // Permanent delete
                await db.delete(measurementLabel)
                    .where(eq(measurementLabel.id, id));

                return { success: true, message: 'Label dihapus permanen' };
            }
        } catch (error) {
            console.error('Error deleting label:', error);
            return fail(500, { message: 'Gagal menghapus label' });
        }
    },

    reactivate: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) return fail(400, { message: 'ID tidak valid' });

        try {
            await db.update(measurementLabel)
                .set({ is_active: true })
                .where(eq(measurementLabel.id, id));

            return { success: true, message: 'Label diaktifkan kembali' };
        } catch (error) {
            console.error('Error reactivating label:', error);
            return fail(500, { message: 'Gagal mengaktifkan label' });
        }
    }
};
