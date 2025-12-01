import { db } from '$lib/server/db';
import { settings, order } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function generateOrderNumber(): Promise<string> {
    // 1. Get format from settings
    const formatSetting = await db.query.settings.findFirst({
        where: eq(settings.key, 'order_number_format')
    });

    let format = formatSetting?.value || 'ORD-{YYYY}{MM}{DD}-{XXX}';

    // 2. Replace date placeholders
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const prefix = format.split('{XXX}')[0]
        .replace('{YYYY}', year)
        .replace('{MM}', month)
        .replace('{DD}', day);

    let counter = 1;

    // Try to find the last order number that matches the prefix
    const lastOrder = await db.query.order.findFirst({
        orderBy: [desc(order.created_at)]
    });

    if (lastOrder && lastOrder.order_number && lastOrder.order_number.startsWith(prefix)) {
        const remainder = lastOrder.order_number.slice(prefix.length);
        const match = remainder.match(/^(\d+)/);
        if (match) {
            counter = parseInt(match[1]) + 1;
        }
    }

    const counterStr = counter.toString().padStart(3, '0');

    return format.replace('{YYYY}', year)
        .replace('{MM}', month)
        .replace('{DD}', day)
        .replace('{XXX}', counterStr);
}

export function generateTrackingCode(): string {
    return uuidv4();
}