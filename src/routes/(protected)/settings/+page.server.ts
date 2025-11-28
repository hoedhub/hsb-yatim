import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export async function load() {
  try {
    console.log('Loading settings...');
    const allSettings = await db.select().from(settings);
    console.log('Settings loaded:', allSettings);

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
  } catch (e) {
    console.error('Error loading settings:', e);
    return {
      settings: {
        order: [],
        print: []
      }
    };
  }
}

export const actions = {
  update: async ({ request }) => {
    const data = await request.formData();
    const keys = data.getAll('key');
    const values = data.getAll('value');

    if (keys.length === 0 || keys.length !== values.length) {
      return fail(400, { message: 'Invalid data provided.' });
    }

    try {
      // Process all updates in a transaction or sequentially
      // Since we're using SQLite/Drizzle, sequential is fine for settings
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i].toString();
        const value = values[i].toString();

        // Use upsert to handle both existing and new settings
        await db.insert(settings)
          .values({
            key,
            value,
            // We can try to infer category or leave it null if it's new
            // For known keys, we could map them, but for now null is fine
            category: key.includes('order') ? 'order' : 'print',
            data_type: 'string'
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: { value }
          });
      }

      return { success: true, message: 'Settings updated successfully.' };
    } catch (error) {
      console.error('Error updating settings:', error);
      return fail(500, { message: 'Failed to update settings.' });
    }
  },
};
