/*
  Warnings:

  - You are about to alter the column `user_id` on the `Season_Leaderboard` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Tickets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `block` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `bonus` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `id_lot` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `id_ticket` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `network` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `recipient` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `tokens_spent` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `total_tickets` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_hash` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `unique_id` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Tickets` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id_user` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `User_Quest_Steps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `User_Quest_Steps` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `User_Quests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `User_Quests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `Nft` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NftMetadata` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[referral_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blockNumber` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockTimestamp` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerAddress` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chainId` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimed` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasArrived` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfEntries` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raffleId` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalEntriesBought` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRaisedAmount` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tx` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueOfTickets` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Season_Leaderboard` DROP FOREIGN KEY `Season_Leaderboard_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quest_Steps` DROP FOREIGN KEY `User_Quest_Steps_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quests` DROP FOREIGN KEY `User_Quests_user_id_fkey`;

-- DropIndex
DROP INDEX `Tickets_unique_id_key` ON `Tickets`;

-- DropIndex
DROP INDEX `recipient` ON `Tickets`;

-- AlterTable
ALTER TABLE `Season_Leaderboard` MODIFY `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Tickets` DROP PRIMARY KEY,
    DROP COLUMN `amount`,
    DROP COLUMN `block`,
    DROP COLUMN `bonus`,
    DROP COLUMN `created_at`,
    DROP COLUMN `id_lot`,
    DROP COLUMN `id_ticket`,
    DROP COLUMN `network`,
    DROP COLUMN `recipient`,
    DROP COLUMN `tokens_spent`,
    DROP COLUMN `total_tickets`,
    DROP COLUMN `transaction_hash`,
    DROP COLUMN `unique_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `blockNumber` INTEGER NOT NULL,
    ADD COLUMN `blockTimestamp` DATETIME(3) NOT NULL,
    ADD COLUMN `buyerAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `chainId` INTEGER NOT NULL,
    ADD COLUMN `claimed` BOOLEAN NOT NULL,
    ADD COLUMN `eventId` VARCHAR(191) NOT NULL,
    ADD COLUMN `hasArrived` BOOLEAN NOT NULL,
    ADD COLUMN `numberOfEntries` INTEGER NOT NULL,
    ADD COLUMN `raffleId` INTEGER NOT NULL,
    ADD COLUMN `totalEntriesBought` INTEGER NOT NULL,
    ADD COLUMN `totalRaisedAmount` INTEGER NOT NULL,
    ADD COLUMN `tx` VARCHAR(191) NOT NULL,
    ADD COLUMN `valueOfTickets` INTEGER NOT NULL,
    ADD PRIMARY KEY (`tx`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    ADD COLUMN `avatar` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `description` VARCHAR(600) NULL,
    ADD COLUMN `discord` JSON NULL,
    ADD COLUMN `referral_code` VARCHAR(191) NULL,
    ADD COLUMN `telegram` JSON NULL,
    ADD COLUMN `twitter` JSON NULL,
    MODIFY `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_user`);

-- AlterTable
ALTER TABLE `User_Quest_Steps` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `quest_id`);

-- AlterTable
ALTER TABLE `User_Quests` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `quest_id`);

-- DropTable
DROP TABLE `Nft`;

-- DropTable
DROP TABLE `NftMetadata`;

-- CreateTable
CREATE TABLE `Raffles` (
    `raffleId` INTEGER NOT NULL,
    `chainId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `assetType` VARCHAR(191) NOT NULL,
    `prizeAddress` VARCHAR(191) NOT NULL,
    `prizeNumber` DOUBLE NOT NULL,
    `blockTimestamp` DATETIME(3) NOT NULL,
    `ownerAddress` VARCHAR(191) NOT NULL,
    `minFundsToRaise` INTEGER NOT NULL,
    `countViews` INTEGER NOT NULL,
    `winnerAddress` VARCHAR(191) NULL,
    `claimedPrize` BOOLEAN NOT NULL,
    `raffleMetadataId` INTEGER NULL,
    `priceListId` INTEGER NULL,

    UNIQUE INDEX `Raffles_raffleMetadataId_key`(`raffleMetadataId`),
    UNIQUE INDEX `Raffles_priceListId_key`(`priceListId`),
    PRIMARY KEY (`raffleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SidechainEnabledRaffles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raffleId` INTEGER NOT NULL,
    `chainId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SidechainEnabledRaffles_raffleId_chainId_key`(`raffleId`, `chainId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockchainEvents` (
    `id` VARCHAR(191) NOT NULL,
    `raffleId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `json` JSON NOT NULL,
    `statusParsing` VARCHAR(191) NOT NULL,
    `statusMessage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RaffleMetadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raffleId` INTEGER NOT NULL,
    `json` JSON NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `imageCid` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `collectionName` VARCHAR(191) NULL,
    `statusMessage` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raffleId` INTEGER NOT NULL,
    `eventId` INTEGER NOT NULL,
    `prices` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referred_user_id` INTEGER NOT NULL,
    `referral_code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_referral_code_key` ON `User`(`referral_code`);

-- AddForeignKey
ALTER TABLE `SidechainEnabledRaffles` ADD CONSTRAINT `SidechainEnabledRaffles_raffleId_fkey` FOREIGN KEY (`raffleId`) REFERENCES `Raffles`(`raffleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlockchainEvents` ADD CONSTRAINT `BlockchainEvents_raffleId_fkey` FOREIGN KEY (`raffleId`) REFERENCES `Raffles`(`raffleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tickets` ADD CONSTRAINT `Tickets_raffleId_fkey` FOREIGN KEY (`raffleId`) REFERENCES `Raffles`(`raffleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referred_user_id_fkey` FOREIGN KEY (`referred_user_id`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Season_Leaderboard` ADD CONSTRAINT `Season_Leaderboard_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quests` ADD CONSTRAINT `User_Quests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quest_Steps` ADD CONSTRAINT `User_Quest_Steps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
