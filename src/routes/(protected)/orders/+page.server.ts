import { db } from '$lib/server/db';
import { order } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const orders = await db.query.order.findMany({
        with: {
            customer: true
        },
        orderBy: [desc(order.created_at)]
    });

    return {
        orders
    };
};
