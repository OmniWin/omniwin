/*
  Warnings:

  - The primary key for the `raffles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `asset_type` on the `raffles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - Added the required column `contract_address` to the `raffles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `raffles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_structure_id` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `blockchain_events` DROP FOREIGN KEY `blockchain_events_raffle_id_fkey`;

-- DropForeignKey
ALTER TABLE `price_list` DROP FOREIGN KEY `price_list_raffle_id_fkey`;

-- DropForeignKey
ALTER TABLE `raffle_metadata` DROP FOREIGN KEY `raffle_metadata_raffle_id_fkey`;

-- DropForeignKey
ALTER TABLE `sidechain_enabled_raffles` DROP FOREIGN KEY `sidechain_enabled_raffles_raffle_id_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_raffle_id_fkey`;

-- AlterTable
ALTER TABLE `blockchain_events` MODIFY `raffle_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `price_list` MODIFY `raffle_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `raffle_metadata` MODIFY `raffle_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `raffles` DROP PRIMARY KEY,
    ADD COLUMN `contract_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `deadline` DATETIME(3) NOT NULL,
    MODIFY `asset_type` ENUM('ERC20', 'ERC721', 'ETH', 'CCIP') NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sidechain_enabled_raffles` MODIFY `raffle_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `price_structure_id` INTEGER NOT NULL,
    MODIFY `raffle_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `sidechain_enabled_raffles` ADD CONSTRAINT `sidechain_enabled_raffles_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blockchain_events` ADD CONSTRAINT `blockchain_events_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raffle_metadata` ADD CONSTRAINT `raffle_metadata_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_list` ADD CONSTRAINT `price_list_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
