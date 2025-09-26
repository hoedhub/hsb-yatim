CREATE TABLE `customer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`institution_name` text,
	`phone` text,
	`address` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `customer_name_idx` ON `customer` (`name`);--> statement-breakpoint
CREATE TABLE `measurement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_template_id` integer,
	`label_id` integer,
	`value` text,
	`unit` text,
	FOREIGN KEY (`order_template_id`) REFERENCES `order_template`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`label_id`) REFERENCES `measurement_label`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `measurement_label` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`default_unit` text,
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `measurement_template` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `measurement_template_label` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_id` integer,
	`label_id` integer,
	`order_index` integer NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `measurement_template`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`label_id`) REFERENCES `measurement_label`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer,
	`order_number` text,
	`status` text NOT NULL,
	`progress_ukur` integer DEFAULT false,
	`progress_potong` integer DEFAULT false,
	`progress_jahit` integer DEFAULT false,
	`progress_selesai` integer DEFAULT false,
	`tracking_code` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `order_order_number_unique` ON `order` (`order_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `order_tracking_code_unique` ON `order` (`tracking_code`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `order` (`status`);--> statement-breakpoint
CREATE INDEX `order_created_idx` ON `order` (`created_at`);--> statement-breakpoint
CREATE TABLE `order_template` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer,
	`template_id` integer,
	`display_order` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `measurement_template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text,
	`category` text,
	`data_type` text
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`last_login` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);