PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_emails` (
	`id` text PRIMARY KEY NOT NULL,
	`emailAddress` text NOT NULL,
	`verification` integer,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_emails`("id", "emailAddress", "verification", "createdAt") SELECT "id", "emailAddress", "verification", "createdAt" FROM `emails`;--> statement-breakpoint
DROP TABLE `emails`;--> statement-breakpoint
ALTER TABLE `__new_emails` RENAME TO `emails`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `emails_emailAddress_unique` ON `emails` (`emailAddress`);--> statement-breakpoint
CREATE TABLE `__new_exchange_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text,
	`client_id` text NOT NULL,
	`user_id` text NOT NULL,
	`redirect_uri` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exchange_codes`("id", "code", "client_id", "user_id", "redirect_uri", "expiresAt", "createdAt") SELECT "id", "code", "client_id", "user_id", "redirect_uri", "expiresAt", "createdAt" FROM `exchange_codes`;--> statement-breakpoint
DROP TABLE `exchange_codes`;--> statement-breakpoint
ALTER TABLE `__new_exchange_codes` RENAME TO `exchange_codes`;--> statement-breakpoint
CREATE UNIQUE INDEX `exchange_codes_code_unique` ON `exchange_codes` (`code`);--> statement-breakpoint
CREATE TABLE `__new_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`roleName` text NOT NULL,
	`rolePermissions` blob NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_roles`("id", "roleName", "rolePermissions", "createdAt") SELECT "id", "roleName", "rolePermissions", "createdAt" FROM `roles`;--> statement-breakpoint
DROP TABLE `roles`;--> statement-breakpoint
ALTER TABLE `__new_roles` RENAME TO `roles`;--> statement-breakpoint
CREATE UNIQUE INDEX `roles_roleName_unique` ON `roles` (`roleName`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role` text,
	`emailAddresses` blob NOT NULL,
	`primaryEmailAddress` text NOT NULL,
	`createdAt` integer,
	FOREIGN KEY (`role`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`primaryEmailAddress`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "username", "password", "role", "emailAddresses", "primaryEmailAddress", "createdAt") SELECT "id", "username", "password", "role", "emailAddresses", "primaryEmailAddress", "createdAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_primaryEmailAddress` ON `users` (`primaryEmailAddress`);