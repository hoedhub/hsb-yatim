import { db } from './src/lib/server/db';
import { settings } from './src/lib/server/db/schema';

async function main() {
    try {
        console.log('Checking DB connection...');
        console.log('db keys:', Object.keys(db));
        if (db.query) {
            console.log('db.query keys:', Object.keys(db.query));
        } else {
            console.log('db.query is undefined');
        }

        // Try query API
        const result = await db.query.settings.findMany();
        console.log('Settings table exists. Rows:', result.length);
        console.log(result);
    } catch (e) {
        console.error('Error querying settings:', e);
    }
}

main();
