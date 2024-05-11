/*
  Warnings:

  - You are about to drop the column `raffle_metadata_id` on the `raffles` table. All the data in the column will be lost.
  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Referral` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Season` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Season_Leaderboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Step` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Quest_Steps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Quests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Quest` DROP FOREIGN KEY `Quest_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `Referral` DROP FOREIGN KEY `Referral_referred_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Season_Leaderboard` DROP FOREIGN KEY `Season_Leaderboard_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `Season_Leaderboard` DROP FOREIGN KEY `Season_Leaderboard_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Step` DROP FOREIGN KEY `Step_quest_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quest_Steps` DROP FOREIGN KEY `User_Quest_Steps_quest_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quest_Steps` DROP FOREIGN KEY `User_Quest_Steps_step_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quest_Steps` DROP FOREIGN KEY `User_Quest_Steps_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quests` DROP FOREIGN KEY `User_Quests_quest_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quests` DROP FOREIGN KEY `User_Quests_user_id_fkey`;

-- DropIndex
DROP INDEX `raffles_raffle_metadata_id_key` ON `raffles`;

-- AlterTable
ALTER TABLE `raffles` DROP COLUMN `raffle_metadata_id`;

-- DropTable
DROP TABLE `Favorites`;

-- DropTable
DROP TABLE `Quest`;

-- DropTable
DROP TABLE `Referral`;

-- DropTable
DROP TABLE `Season`;

-- DropTable
DROP TABLE `Season_Leaderboard`;

-- DropTable
DROP TABLE `Step`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `User_Quest_Steps`;

-- DropTable
DROP TABLE `User_Quests`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chain_id` INTEGER NOT NULL,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(600) NULL,
    `avatar` VARCHAR(191) NULL DEFAULT '',
    `telegram` JSON NULL,
    `twitter` JSON NULL,
    `discord` JSON NULL,
    `referral_code` VARCHAR(191) NULL,
    `issued_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_address_key`(`address`),
    UNIQUE INDEX `users_referral_code_key`(`referral_code`),
    INDEX `users_username_idx`(`username`),
    INDEX `users_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referrals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referred_user_id` INTEGER NOT NULL,
    `refferal_code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lot_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `id_lot`(`lot_id`),
    INDEX `id_user`(`user_id`),
    UNIQUE INDEX `lot_id_lot_user`(`lot_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seasons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `sub_title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `xp_limit` INTEGER NOT NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `seasons_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `season_leaderboard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `xp_points` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `season_leaderboard_season_id_idx`(`season_id`),
    INDEX `season_leaderboard_user_id_idx`(`user_id`),
    UNIQUE INDEX `season_id_user_id`(`season_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `xp_reward` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `quests_season_id_idx`(`season_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `steps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quest_id` INTEGER NOT NULL,
    `description` TEXT NULL,
    `xp_points` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `steps_quest_id_idx`(`quest_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_quests` (
    `userId` INTEGER NOT NULL,
    `questId` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_quests_userId_idx`(`userId`),
    INDEX `user_quests_questId_idx`(`questId`),
    UNIQUE INDEX `user_id_quest_id`(`userId`, `questId`),
    PRIMARY KEY (`userId`, `questId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_quest_steps` (
    `userId` INTEGER NOT NULL,
    `questId` INTEGER NOT NULL,
    `stepId` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_quest_steps_userId_idx`(`userId`),
    INDEX `user_quest_steps_questId_idx`(`questId`),
    INDEX `user_quest_steps_stepId_idx`(`stepId`),
    UNIQUE INDEX `user_id_quest_id_step_id`(`userId`, `questId`, `stepId`),
    PRIMARY KEY (`userId`, `questId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referred_user_id_fkey` FOREIGN KEY (`referred_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_leaderboard` ADD CONSTRAINT `season_leaderboard_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_leaderboard` ADD CONSTRAINT `season_leaderboard_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quests` ADD CONSTRAINT `quests_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `steps` ADD CONSTRAINT `steps_quest_id_fkey` FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quests` ADD CONSTRAINT `user_quests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quests` ADD CONSTRAINT `user_quests_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `quests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quest_steps` ADD CONSTRAINT `user_quest_steps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quest_steps` ADD CONSTRAINT `user_quest_steps_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `quests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quest_steps` ADD CONSTRAINT `user_quest_steps_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `steps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
