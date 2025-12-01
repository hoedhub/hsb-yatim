import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { customer } from '$lib/server/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    const customers = await db.query.customer.findMany({
        orderBy: [desc(customer.created_at)]
    });

    return {
        customers
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const type = formData.get('type') as 'individual' | 'institution';
        const institution_name = formData.get('institution_name') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;

        if (!name || name.length < 2) {
            return fail(400, { message: 'Nama minimal 2 karakter' });
        }
        // Additional validation for institution type
        try {
            await db.insert(customer).values({
                name,
                type,
                institution_name: type === 'institution' ? institution_name : null,
                phone,
                address
            });

            return { success: true, message: 'Customer berhasil ditambahkan' };
        } catch (error) {
            console.error('Error creating customer:', error);
            return fail(500, { message: 'Gagal menambahkan customer' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const name = formData.get('name') as string;
        const type = formData.get('type') as 'individual' | 'institution';
        const institution_name = formData.get('institution_name') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;

        if (!id) return fail(400, { message: 'ID customer tidak valid' });
        if (!name || name.length < 2) {
            return fail(400, { message: 'Nama minimal 2 karakter' });
        }



        try {
            await db.update(customer)
                .set({
                    name,
                    type,
                    institution_name: type === 'institution' ? institution_name : null,
                    phone,
                    address
                })
                .where(eq(customer.id, id));

            return { success: true, message: 'Customer berhasil diperbarui' };
        } catch (error) {
            console.error('Error updating customer:', error);
            return fail(500, { message: 'Gagal memperbarui customer' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) return fail(400, { message: 'ID customer tidak valid' });

        try {
            // TODO: Check if customer has orders before deleting
            await db.delete(customer).where(eq(customer.id, id));

            return { success: true, message: 'Customer berhasil dihapus' };
        } catch (error) {
            console.error('Error deleting customer:', error);
            return fail(500, { message: 'Gagal menghapus customer (mungkin sedang digunakan)' });
        }
    }
};
