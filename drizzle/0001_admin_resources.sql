CREATE TABLE IF NOT EXISTS `services` (
  `id` text PRIMARY KEY NOT NULL,
  `number` text NOT NULL,
  `kicker` text NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `description` text NOT NULL,
  `items` text DEFAULT '[]' NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `is_visible` integer DEFAULT true NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `services_slug_unique` ON `services` (`slug`);
