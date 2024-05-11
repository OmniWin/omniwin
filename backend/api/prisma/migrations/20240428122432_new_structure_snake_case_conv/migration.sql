/*
  Warnings:

  - You are about to drop the `BlockchainEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RaffleMetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Raffles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SidechainEnabledRaffles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tickets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BlockchainEvents` DROP FOREIGN KEY `BlockchainEvents_raffleId_fkey`;

-- DropForeignKey
ALTER TABLE `SidechainEnabledRaffles` DROP FOREIGN KEY `SidechainEnabledRaffles_raffleId_fkey`;

-- DropForeignKey
ALTER TABLE `Tickets` DROP FOREIGN KEY `Tickets_raffleId_fkey`;

-- DropTable
DROP TABLE `BlockchainEvents`;

-- DropTable
DROP TABLE `PriceList`;

-- DropTable
DROP TABLE `RaffleMetadata`;

-- DropTable
DROP TABLE `Raffles`;

-- DropTable
DROP TABLE `SidechainEnabledRaffles`;

-- DropTable
DROP TABLE `Tickets`;

-- CreateTable
CREATE TABLE `raffles` (
    `raffle_id` INTEGER NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `asset_type` VARCHAR(191) NOT NULL,
    `prize_address` VARCHAR(191) NOT NULL,
    `prize_number` DOUBLE NOT NULL,
    `block_timestamp` DATETIME(3) NOT NULL,
    `owner_address` VARCHAR(191) NOT NULL,
    `min_funds_to_raise` INTEGER NOT NULL,
    `count_views` INTEGER NOT NULL,
    `winner_address` VARCHAR(191) NULL,
    `claimed_prize` BOOLEAN NOT NULL,
    `raffle_metadata_id` INTEGER NULL,

    UNIQUE INDEX `raffles_raffle_metadata_id_key`(`raffle_metadata_id`),
    PRIMARY KEY (`raffle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sidechain_enabled_raffles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raffle_id` INTEGER NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `sidechain_enabled_raffles_raffle_id_chain_id_key`(`raffle_id`, `chain_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blockchain_events` (
    `id` VARCHAR(191) NOT NULL,
    `raffle_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `json` JSON NOT NULL,
    `status_parsing` VARCHAR(191) NOT NULL,
    `status_message` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `raffle_metadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raffle_id` INTEGER NOT NULL,
    `json` JSON NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `image_cid` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `collection_name` VARCHAR(191) NULL,
    `status_message` VARCHAR(191) NULL,

    UNIQUE INDEX `raffle_metadata_raffle_id_key`(`raffle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `price_list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raffle_id` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `prices` JSON NOT NULL,

    UNIQUE INDEX `price_list_raffle_id_key`(`raffle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `tx` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `raffle_id` INTEGER NOT NULL,
    `buyer_address` VARCHAR(191) NOT NULL,
    `number_of_entries` INTEGER NOT NULL,
    `value_of_tickets` INTEGER NOT NULL,
    `total_entries_bought` INTEGER NOT NULL,
    `total_raised_amount` INTEGER NOT NULL,
    `claimed` BOOLEAN NOT NULL,
    `block_number` INTEGER NOT NULL,
    `block_timestamp` DATETIME(3) NOT NULL,
    `has_arrived` BOOLEAN NOT NULL,

    PRIMARY KEY (`tx`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sidechain_enabled_raffles` ADD CONSTRAINT `sidechain_enabled_raffles_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`raffle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blockchain_events` ADD CONSTRAINT `blockchain_events_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`raffle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raffle_metadata` ADD CONSTRAINT `raffle_metadata_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`raffle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_list` ADD CONSTRAINT `price_list_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`raffle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`raffle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
