import { db } from './index';
import * as schema from './schema';
import bcrypt from 'bcryptjs';

async function hashPassword(password: string) {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
}

async function seed() {
	console.log('Seeding database...');

	// Initial Admin User
	const hashedPassword = await hashPassword('secure-password-123');
	await db.insert(schema.user).values({
		username: 'admin',
		password_hash: hashedPassword
	});

	// Default Measurement Labels
	const defaultLabels = [
		{ name: 'Lingkar Dada', default_unit: 'cm' },
		{ name: 'Panjang Lengan', default_unit: 'cm' },
		{ name: 'Lingkar Pinggang', default_unit: 'cm' },
		{ name: 'Lingkar Pinggul', default_unit: 'cm' },
		{ name: 'Panjang Celana', default_unit: 'cm' },
		{ name: 'Lebar Bahu', default_unit: 'cm' }
	];
	await db.insert(schema.measurementLabel).values(defaultLabels);

	// Sample Measurement Templates
	const bajuTemplate = await db.insert(schema.measurementTemplate).values({ name: 'Baju', description: 'Template untuk atasan' }).returning({ id: schema.measurementTemplate.id });
	const celanaTemplate = await db.insert(schema.measurementTemplate).values({ name: 'Celana', description: 'Template untuk bawahan' }).returning({ id: schema.measurementTemplate.id });

	// Template-Label Relationships
	const labels = await db.select().from(schema.measurementLabel);
	const bajuLabelNames = ['Lingkar Dada', 'Panjang Lengan', 'Lebar Bahu'];
	const celanaLabelNames = ['Lingkar Pinggang', 'Lingkar Pinggul', 'Panjang Celana'];

	await db.insert(schema.measurementTemplateLabel).values(
		labels
			.filter(l => bajuLabelNames.includes(l.name))
			.map((l, i) => ({
				template_id: bajuTemplate[0].id,
				label_id: l.id,
				order_index: i
			}))
	);

	await db.insert(schema.measurementTemplateLabel).values(
		labels
			.filter(l => celanaLabelNames.includes(l.name))
			.map((l, i) => ({
				template_id: celanaTemplate[0].id,
				label_id: l.id,
				order_index: i
			}))
	);

	// Default Settings
	const defaultSettings = [
		{ key: 'order_number_format', value: 'ORD-{YYYY}{MM}{DD}-{XXX}', category: 'order', data_type: 'string' },
		{ key: 'tracking_code_content', value: '{tracking_code}', category: 'print', data_type: 'string' }
	];
	await db.insert(schema.settings).values(defaultSettings);

	console.log('Seeding complete!');
}

seed().catch((error) => {
	console.error('Error during seeding:', error);
	process.exit(1);
});
