import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { desc, count } from 'drizzle-orm';

export async function load({ locals }) {
  const session = await locals.auth();

  // Load dashboard statistics
  const totalOrders = await db.select({ count: count() }).from(orders);
  // Add more statistics as needed

  // Query recent orders
  const recentOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.created_at)],
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
