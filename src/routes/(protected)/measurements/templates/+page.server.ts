import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { measurementTemplate, measurementTemplateLabel, measurementLabel } from '$lib/server/db/schema';
import { eq, inArray, asc } from 'drizzle-orm';
import { measurementTemplateSchema } from '$lib/schemas';


export const load: PageServerLoad = async () => {
    const templates = await db.query.measurementTemplate.findMany({
        with: {
            templateLabels: {
                with: {
                    label: true
                },
                orderBy: (templateLabels, { asc }) => [asc(templateLabels.order_index)]
            }
        },
        orderBy: (templates, { desc }) => [desc(templates.id)]
    });

    const labels = await db.query.measurementLabel.findMany({
        where: eq(measurementLabel.is_active, true),
        orderBy: (labels, { asc }) => [asc(labels.name)]
    });

    return {
        templates,
        labels
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const labelIdsString = formData.get('labels') as string;

        if (!name || name.length < 2) {
            return fail(400, { message: 'Nama template minimal 2 karakter' });
        }

        let labelIds: number[] = [];
        try {
            if (labelIdsString) {
                labelIds = JSON.parse(labelIdsString);
            }
        } catch (e) {
            return fail(400, { message: 'Format label tidak valid' });
        }

        try {
            await db.transaction(async (tx) => {
                const [newTemplate] = await tx.insert(measurementTemplate).values({
                    name,
                    description,
                    is_active: true
                }).returning();

                if (labelIds.length > 0) {
                    const templateLabels = labelIds.map((labelId, index) => ({
                        template_id: newTemplate.id,
                        label_id: labelId,
                        order_index: index
                    }));
                    await tx.insert(measurementTemplateLabel).values(templateLabels);
                }
            });

            return { success: true, message: 'Template berhasil dibuat' };
        } catch (error) {
            console.error('Error creating template:', error);
            return fail(500, { message: 'Gagal membuat template' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const labelIdsString = formData.get('labels') as string;

        if (!id) return fail(400, { message: 'ID template tidak valid' });
        if (!name || name.length < 2) {
            return fail(400, { message: 'Nama template minimal 2 karakter' });
        }

        let labelIds: number[] = [];
        try {
            if (labelIdsString) {
                labelIds = JSON.parse(labelIdsString);
            }
        } catch (e) {
            return fail(400, { message: 'Format label tidak valid' });
        }

        try {
            await db.transaction(async (tx) => {
                await tx.update(measurementTemplate)
                    .set({ name, description })
                    .where(eq(measurementTemplate.id, id));

                // Delete existing relations
                await tx.delete(measurementTemplateLabel)
                    .where(eq(measurementTemplateLabel.template_id, id));

                // Insert new relations
                if (labelIds.length > 0) {
                    const templateLabels = labelIds.map((labelId, index) => ({
                        template_id: id,
                        label_id: labelId,
                        order_index: index
                    }));
                    await tx.insert(measurementTemplateLabel).values(templateLabels);
                }
            });

            return { success: true, message: 'Template berhasil diperbarui' };
        } catch (error) {
            console.error('Error updating template:', error);
            return fail(500, { message: 'Gagal memperbarui template' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) return fail(400, { message: 'ID template tidak valid' });

        try {
            // Soft delete or hard delete?
            // Schema says is_active, but let's check if it's used in orders first.
            // For now, let's just soft delete by setting is_active = false
            // Or if we want to allow permanent delete if not used.

            // Let's stick to soft delete for now as per schema default
            // Actually, let's check if we can just delete the relations and the template if not used.
            // But since we don't have orders yet, let's implement soft delete toggle.

            // Wait, the requirement says "Clone template functionality" and "Template CRUD".
            // Let's implement soft delete (deactivate) if active, or delete if inactive?
            // Let's just do simple delete for now (which might fail if FK constraints exist)
            // or soft delete.

            // Let's check the current state.
            const template = await db.query.measurementTemplate.findFirst({
                where: eq(measurementTemplate.id, id)
            });

            if (!template) return fail(404, { message: 'Template tidak ditemukan' });

            // For now, let's just delete the relations and the template.
            // If it fails due to FK (used in orders), we should handle it.
            // But we don't have orders yet.

            await db.transaction(async (tx) => {
                await tx.delete(measurementTemplateLabel).where(eq(measurementTemplateLabel.template_id, id));
                await tx.delete(measurementTemplate).where(eq(measurementTemplate.id, id));
            });

            return { success: true, message: 'Template berhasil dihapus' };
        } catch (error) {
            console.error('Error deleting template:', error);
            return fail(500, { message: 'Gagal menghapus template (mungkin sedang digunakan)' });
        }
    },

    clone: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) return fail(400, { message: 'ID template tidak valid' });

        try {
            await db.transaction(async (tx) => {
                const originalTemplate = await tx.query.measurementTemplate.findFirst({
                    where: eq(measurementTemplate.id, id),
                    with: {
                        templateLabels: {
                            orderBy: (templateLabels, { asc }) => [asc(templateLabels.order_index)]
                        }
                    }
                });

                if (!originalTemplate) throw new Error('Template not found');

                const [newTemplate] = await tx.insert(measurementTemplate).values({
                    name: `${originalTemplate.name} (Copy)`,
                    description: originalTemplate.description,
                    is_active: true
                }).returning();

                if (originalTemplate.templateLabels.length > 0) {
                    const newRelations = originalTemplate.templateLabels.map(tl => ({
                        template_id: newTemplate.id,
                        label_id: tl.label_id,
                        order_index: tl.order_index
                    }));
                    await tx.insert(measurementTemplateLabel).values(newRelations);
                }
            });

            return { success: true, message: 'Template berhasil diduplikasi' };
        } catch (error) {
            console.error('Error cloning template:', error);
            return fail(500, { message: 'Gagal menduplikasi template' });
        }
    }
};
