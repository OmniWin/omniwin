/*
  Warnings:

  - The primary key for the `Nft` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_lot` on the `Nft` table. All the data in the column will be lost.
  - You are about to drop the column `id_nft` on the `Nft` table. All the data in the column will be lost.
  - The primary key for the `NftMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `collectionName` on the `NftMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `id_lot` on the `NftMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `id_nft` on the `NftMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `id_nftMetadata` on the `NftMetadata` table. All the data in the column will be lost.
  - The primary key for the `Tickets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_lot` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `id_ticket` on the `Tickets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lot_id]` on the table `Nft` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nft_id]` on the table `NftMetadata` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Nft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lot_id` to the `Nft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `NftMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lot_id` to the `NftMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nft_id` to the `NftMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lot_id` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `NftMetadata` DROP FOREIGN KEY `NftMetadata_id_nft_fkey`;

-- DropIndex
DROP INDEX `Nft_id_lot_network_key` ON `Nft`;

-- AlterTable
ALTER TABLE `Nft` DROP PRIMARY KEY,
    DROP COLUMN `id_lot`,
    DROP COLUMN `id_nft`,
    ADD COLUMN `count_views` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `lot_id` INTEGER NOT NULL,
    ADD COLUMN `trending_score` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `NftMetadata` DROP PRIMARY KEY,
    DROP COLUMN `collectionName`,
    DROP COLUMN `id_lot`,
    DROP COLUMN `id_nft`,
    DROP COLUMN `id_nftMetadata`,
    ADD COLUMN `collection_name` VARCHAR(191) NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `lot_id` INTEGER NOT NULL,
    ADD COLUMN `nft_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Tickets` DROP PRIMARY KEY,
    DROP COLUMN `id_lot`,
    DROP COLUMN `id_ticket`,
    ADD COLUMN `block` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `lot_id` INTEGER NOT NULL,
    ADD COLUMN `network` ENUM('ETHEREUM', 'GOERLI') NOT NULL DEFAULT 'GOERLI',
    ADD COLUMN `transaction_hash` VARCHAR(191) NOT NULL DEFAULT '',
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `issued_at` DATETIME(3) NULL,
    `chainId` INTEGER NOT NULL,

    UNIQUE INDEX `User_address_key`(`address`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_username_idx`(`username`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lot_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lot_id`(`lot_id`),
    INDEX `user_id`(`user_id`),
    UNIQUE INDEX `lot_id_user_id`(`lot_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Season` (
    `season_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `xp_limit` INTEGER NOT NULL,

    INDEX `Season_name_idx`(`name`),
    PRIMARY KEY (`season_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Season_Leaderboard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `xp_points` INTEGER NOT NULL,

    INDEX `Season_Leaderboard_season_id_idx`(`season_id`),
    INDEX `Season_Leaderboard_user_id_idx`(`user_id`),
    UNIQUE INDEX `season_id_user_id`(`season_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quest` (
    `quest_id` INTEGER NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `xp_reward` INTEGER NOT NULL,

    INDEX `Quest_season_id_idx`(`season_id`),
    PRIMARY KEY (`quest_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Step` (
    `step_id` INTEGER NOT NULL AUTO_INCREMENT,
    `quest_id` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `xp_points` INTEGER NOT NULL,

    INDEX `Step_quest_id_idx`(`quest_id`),
    PRIMARY KEY (`step_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Quests` (
    `user_id` INTEGER NOT NULL,
    `quest_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,

    INDEX `User_Quests_user_id_idx`(`user_id`),
    INDEX `User_Quests_quest_id_idx`(`quest_id`),
    UNIQUE INDEX `user_id_quest_id`(`user_id`, `quest_id`),
    PRIMARY KEY (`user_id`, `quest_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Quest_Steps` (
    `user_id` INTEGER NOT NULL,
    `quest_id` INTEGER NOT NULL,
    `step_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,

    INDEX `User_Quest_Steps_user_id_idx`(`user_id`),
    INDEX `User_Quest_Steps_quest_id_idx`(`quest_id`),
    INDEX `User_Quest_Steps_step_id_idx`(`step_id`),
    UNIQUE INDEX `user_id_quest_id_step_id`(`user_id`, `quest_id`, `step_id`),
    PRIMARY KEY (`user_id`, `quest_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Nft_lot_id_key` ON `Nft`(`lot_id`);

-- CreateIndex
CREATE UNIQUE INDEX `NftMetadata_nft_id_key` ON `NftMetadata`(`nft_id`);

-- CreateIndex
CREATE INDEX `nft_id` ON `NftMetadata`(`nft_id`);

-- AddForeignKey
ALTER TABLE `Season_Leaderboard` ADD CONSTRAINT `Season_Leaderboard_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `Season`(`season_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Season_Leaderboard` ADD CONSTRAINT `Season_Leaderboard_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quest` ADD CONSTRAINT `Quest_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `Season`(`season_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Step` ADD CONSTRAINT `Step_quest_id_fkey` FOREIGN KEY (`quest_id`) REFERENCES `Quest`(`quest_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quests` ADD CONSTRAINT `User_Quests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quests` ADD CONSTRAINT `User_Quests_quest_id_fkey` FOREIGN KEY (`quest_id`) REFERENCES `Quest`(`quest_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quest_Steps` ADD CONSTRAINT `User_Quest_Steps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quest_Steps` ADD CONSTRAINT `User_Quest_Steps_quest_id_fkey` FOREIGN KEY (`quest_id`) REFERENCES `Quest`(`quest_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quest_Steps` ADD CONSTRAINT `User_Quest_Steps_step_id_fkey` FOREIGN KEY (`step_id`) REFERENCES `Step`(`step_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
