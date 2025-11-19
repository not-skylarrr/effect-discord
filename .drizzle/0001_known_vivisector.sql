CREATE TABLE `econ_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`guild_id` text NOT NULL,
	`balance` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`num_id` integer NOT NULL,
	`content` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT '"2025-10-22T13:29:46.411Z"' NOT NULL,
	`created_by` text NOT NULL,
	`guild_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_quotes`("id", "num_id", "content", "author_id", "created_at", "created_by", "guild_id") SELECT "id", "num_id", "content", "author_id", "created_at", "created_by", "guild_id" FROM `quotes`;--> statement-breakpoint
DROP TABLE `quotes`;--> statement-breakpoint
ALTER TABLE `__new_quotes` RENAME TO `quotes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;