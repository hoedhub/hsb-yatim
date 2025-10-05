import { db } from '$lib/server/db';
import { order } from '$lib/server/db/schema';
import { desc, count } from 'drizzle-orm';

export async function load({ locals }) {
  const session = await locals.auth();

  // Load dashboard statistics
  const totalOrders = await db.select({ count: count() }).from(order);
  // Add more statistics as needed

  // Query recent orders
  const recentOrders = await db.query.order.findMany({
    orderBy: [desc(order.created_at)],
    limit: 10, // Limit to 10 recent orders
    with: {
      customer: true, // Assuming a relation to customer
    },
  });

  return {
    session,
    totalOrders: totalOrders[0].count,
    recentOrders,
  };
}
