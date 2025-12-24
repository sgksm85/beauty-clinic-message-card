CREATE TABLE `cards` (
	`id` varchar(36) NOT NULL,
	`templateId` varchar(50) NOT NULL,
	`message` text NOT NULL,
	`senderName` varchar(100),
	`userId` int,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cards_id` PRIMARY KEY(`id`)
);
