CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` integer,
	`name` text,
	`secret` text,
	`redirect_uris` blob,
	`createdAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_public_id_unique` ON `clients` (`public_id`);--> statement-breakpoint
CREATE TABLE `emails` (
	`id` text,
	`emailAddress` text,
	`verification` integer,
	`createdAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `emails_emailAddress_unique` ON `emails` (`emailAddress`);--> statement-breakpoint
CREATE TABLE `exchange_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text,
	`client_id` text,
	`user_id` text,
	`redirect_uri` text,
	`expiresAt` integer,
	`createdAt` integer,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exchange_codes_code_unique` ON `exchange_codes` (`code`);--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text,
	`roleName` text,
	`rolePermissions` blob,
	`createdAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_roleName_unique` ON `roles` (`roleName`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text,
	`password` text,
	`role` text,
	`emailAddresses` blob,
	`primaryEmailAddress` text,
	`createdAt` integer,
	FOREIGN KEY (`role`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`primaryEmailAddress`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_primaryEmailAddress` ON `users` (`primaryEmailAddress`);