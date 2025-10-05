import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export async function load() {
  const allSettings = await db.query.settings.findMany();
  const settingsByCategory: Record<string, typeof settings.$inferSelect[]> = allSettings.reduce((acc: Record<string, typeof settings.$inferSelect[]>, setting) => {
    const category = setting.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(setting);
    return acc;
  }, {});

  return {
    settings: settingsByCategory,
  };
}

export const actions = {
  update: async ({ request }) => {
    const data = await request.formData();
    const key = data.get('key')?.toString();
    const value = data.get('value')?.toString();

    if (!key || value === undefined || value === null) {
      return fail(400, { message: 'Invalid data provided.' });
    }

    try {
      await db.update(settings).set({ value }).where(eq(settings.key, key));
      return { success: true, message: 'Setting updated successfully.' };
    } catch (error) {
      console.error('Error updating setting:', error);
      return fail(500, { message: 'Failed to update setting.' });
    }
  },
};
