import { z } from 'zod';

// =================================================================
// Customer Schema
// =================================================================
export const customerSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	type: z.enum(['individual', 'institution']),
	institution_name: z.string().optional(),
	phone: z.string().optional(),
	address: z.string().optional()
});

export type CustomerSchema = typeof customerSchema;

// =================================================================
// Measurement Label Schema
// =================================================================
export const measurementLabelSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	default_unit: z.string().optional(),
	is_active: z.boolean().optional()
});

export type MeasurementLabelSchema = typeof measurementLabelSchema;

// =================================================================
// Measurement Template Schema
// =================================================================
export const measurementTemplateSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	description: z.string().optional(),
	is_active: z.boolean().optional(),
	labels: z.array(z.number()).optional() // Array of label IDs
});

export type MeasurementTemplateSchema = typeof measurementTemplateSchema;

// =================================================================
// Order Schema
// =================================================================
export const measurementSchema = z.object({
	label_id: z.number(),
	value: z.string().min(1, 'Nilai tidak boleh kosong'),
	unit: z.string().optional()
});

export const orderTemplateSchema = z.object({
	template_id: z.number(),
	measurements: z.array(measurementSchema)
});

export const orderSchema = z.object({
	customer_id: z.number(),
	templates: z.array(orderTemplateSchema),
	status: z.string().optional()
});

export type OrderSchema = typeof orderSchema;

// =================================================================
// Settings Schema
// =================================================================
export const settingsSchema = z.object({
	key: z.string(),
	value: z.string().optional(),
	category: z.string().optional(),
	data_type: z.string().optional()
});

export type SettingsSchema = typeof settingsSchema;
