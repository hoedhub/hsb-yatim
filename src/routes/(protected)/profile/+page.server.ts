import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user?.name) {
        throw redirect(303, '/login');
    }

    // Fetch fresh user data from DB to get last_login
    const currentUser = await db.query.user.findFirst({
        where: eq(user.username, session.user.name)
    });

    if (!currentUser) {
        throw redirect(303, '/login');
    }

    return {
        user: {
            username: currentUser.username,
            lastLogin: currentUser.last_login
        }
    };
};

export const actions: Actions = {
    changePassword: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user?.name) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(400, { message: 'Semua kolom harus diisi' });
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { message: 'Password baru dan konfirmasi tidak cocok' });
        }

        if (newPassword.length < 6) {
            return fail(400, { message: 'Password baru minimal 6 karakter' });
        }

        try {
            // Get user to verify current password
            const currentUser = await db.query.user.findFirst({
                where: eq(user.username, session.user.name)
            });

            if (!currentUser) {
                return fail(404, { message: 'User tidak ditemukan' });
            }

            const isValid = await bcrypt.compare(currentPassword, currentUser.password_hash);

            if (!isValid) {
                return fail(400, { message: 'Password saat ini salah' });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            await db.update(user)
                .set({ password_hash: hashedPassword })
                .where(eq(user.id, currentUser.id));

            return { success: true, message: 'Password berhasil diubah' };
        } catch (error) {
            console.error('Error changing password:', error);
            return fail(500, { message: 'Terjadi kesalahan saat mengubah password' });
        }
    }
};
