import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { customer, measurementTemplate, order, orderTemplate, measurement } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateOrderNumber, generateTrackingCode } from '$lib/server/utils';

export const load: PageServerLoad = async () => {
    const customers = await db.query.customer.findMany({
        orderBy: [desc(customer.created_at)]
    });

    const templates = await db.query.measurementTemplate.findMany({
        where: eq(measurementTemplate.is_active, true),
        with: {
            templateLabels: {
                with: {
                    label: true
                },
                orderBy: (templateLabels, { asc }) => [asc(templateLabels.order_index)]
            }
        }
    });

    return {
        customers,
        templates
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const customer_id = Number(formData.get('customer_id'));
        const template_ids_str = formData.get('template_ids') as string;
        const measurements_str = formData.get('measurements') as string;

        if (!customer_id) {
            return fail(400, { message: 'Customer harus dipilih' });
        }

        let template_ids: number[] = [];
        try {
            template_ids = JSON.parse(template_ids_str);
        } catch (e) {
            return fail(400, { message: 'Template tidak valid' });
        }

        if (template_ids.length === 0) {
            return fail(400, { message: 'Minimal satu template harus dipilih' });
        }

        let measurements_data: Record<string, string> = {};
        try {
            measurements_data = JSON.parse(measurements_str);
        } catch (e) {
            return fail(400, { message: 'Data ukuran tidak valid' });
        }

        try {
            // 1. Generate Order Number & Tracking Code
            const order_number = await generateOrderNumber();
            const tracking_code = generateTrackingCode();

            // 2. Create Order
            const newOrder = await db.insert(order).values({
                customer_id,
                order_number,
                tracking_code,
                status: 'Baru',
                progress_ukur: true,
                progress_potong: false,
                progress_jahit: false,
                progress_selesai: false
            }).returning({ id: order.id });

            const orderId = newOrder[0].id;

            // 3. Create Order Templates & Measurements
            for (let i = 0; i < template_ids.length; i++) {
                const templateId = template_ids[i];

                // Create Order Template
                const newOrderTemplate = await db.insert(orderTemplate).values({
                    order_id: orderId,
                    template_id: templateId,
                    display_order: i
                }).returning({ id: orderTemplate.id });

                const orderTemplateId = newOrderTemplate[0].id;

                // Insert measurements
                for (const key in measurements_data) {
                    if (key.startsWith(`${templateId}_`)) {
                        const labelId = Number(key.split('_')[1]);
                        const value = measurements_data[key];

                        if (value && value.trim() !== '') {
                            await db.insert(measurement).values({
                                order_template_id: orderTemplateId,
                                label_id: labelId,
                                value: value,
                                unit: 'cm' // Default unit
                            });
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error creating order:', error);
            return fail(500, { message: 'Gagal membuat pesanan' });
        }

        throw redirect(303, '/orders');
    }
};
