CREATE TABLE `quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`num_id` integer NOT NULL,
	`content` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT '"2025-10-21T14:40:14.783Z"' NOT NULL,
	`created_by` text NOT NULL,
	`guild_id` text NOT NULL
);
