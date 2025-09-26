import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

export const customer = sqliteTable(
	'customer',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		name: text('name').notNull(),
		type: text('type', { enum: ['individual', 'institution'] }).notNull(),
		institution_name: text('institution_name'),
		phone: text('phone'),
		address: text('address'),
		created_at: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		nameIdx: index('customer_name_idx').on(table.name)
	})
);

export const measurementLabel = sqliteTable('measurement_label', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	default_unit: text('default_unit'),
	is_active: integer('is_active', { mode: 'boolean' }).default(true)
});

export const measurementTemplate = sqliteTable('measurement_template', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description'),
	is_active: integer('is_active', { mode: 'boolean' }).default(true)
});

export const measurementTemplateLabel = sqliteTable('measurement_template_label', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	template_id: integer('template_id').references(() => measurementTemplate.id),
	label_id: integer('label_id').references(() => measurementLabel.id),
	order_index: integer('order_index').notNull()
});

export const order = sqliteTable(
	'order',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		customer_id: integer('customer_id').references(() => customer.id),
		order_number: text('order_number').unique(),
		status: text('status').notNull(),
		progress_ukur: integer('progress_ukur', { mode: 'boolean' }).default(false),
		progress_potong: integer('progress_potong', { mode: 'boolean' }).default(false),
		progress_jahit: integer('progress_jahit', { mode: 'boolean' }).default(false),
		progress_selesai: integer('progress_selesai', { mode: 'boolean' }).default(false),
		tracking_code: text('tracking_code').unique(),
		created_at: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		statusIdx: index('order_status_idx').on(table.status),
		createdIdx: index('order_created_idx').on(table.created_at)
	})
);

export const orderTemplate = sqliteTable('order_template', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	order_id: integer('order_id').references(() => order.id),
	template_id: integer('template_id').references(() => measurementTemplate.id),
	display_order: integer('display_order').notNull()
});

export const measurement = sqliteTable('measurement', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	order_template_id: integer('order_template_id').references(() => orderTemplate.id),
	label_id: integer('label_id').references(() => measurementLabel.id),
	value: text('value'),
	unit: text('unit')
});

export const user = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username').notNull().unique(),
	password_hash: text('password_hash').notNull(),
	last_login: integer('last_login', { mode: 'timestamp' })
});

export const settings = sqliteTable('settings', {
	key: text('key').primaryKey(),
	value: text('value'),
	category: text('category'),
	data_type: text('data_type')
});

export type Customer = typeof customer.$inferSelect;
export type NewCustomer = typeof customer.$inferInsert;

export type MeasurementLabel = typeof measurementLabel.$inferSelect;
export type NewMeasurementLabel = typeof measurementLabel.$inferInsert;

export type MeasurementTemplate = typeof measurementTemplate.$inferSelect;
export type NewMeasurementTemplate = typeof measurementTemplate.$inferInsert;

export type MeasurementTemplateLabel = typeof measurementTemplateLabel.$inferSelect;
export type NewMeasurementTemplateLabel = typeof measurementTemplateLabel.$inferInsert;

export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;

export type OrderTemplate = typeof orderTemplate.$inferSelect;
export type NewOrderTemplate = typeof orderTemplate.$inferInsert;

export type Measurement = typeof measurement.$inferSelect;
export type NewMeasurement = typeof measurement.$inferInsert;

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;
