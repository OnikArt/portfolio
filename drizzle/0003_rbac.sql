CREATE TABLE IF NOT EXISTS `roles` (`id` text PRIMARY KEY NOT NULL,`name` text NOT NULL,`permissions` text DEFAULT '[]' NOT NULL,`is_system` integer DEFAULT false NOT NULL,`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS `roles_name_unique` ON `roles` (`name`);
CREATE TABLE IF NOT EXISTS `users` (`id` text PRIMARY KEY NOT NULL,`email` text NOT NULL,`name` text NOT NULL,`password_hash` text NOT NULL,`role_id` text NOT NULL,`active` integer DEFAULT true NOT NULL,`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);
