/*
  Warnings:

  - The primary key for the `raffles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `raffle_id` on the `raffles` table. All the data in the column will be lost.
  - Added the required column `id` to the `raffles` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `raffles` DROP PRIMARY KEY,
    DROP COLUMN `raffle_id`,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

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
