/*
  Warnings:

  - The primary key for the `Favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Favorites` table. All the data in the column will be lost.
  - You are about to drop the column `lot_id` on the `Favorites` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Favorites` table. All the data in the column will be lost.
  - The primary key for the `Nft` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Nft` table. All the data in the column will be lost.
  - You are about to drop the column `lot_id` on the `Nft` table. All the data in the column will be lost.
  - The primary key for the `NftMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `NftMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `lot_id` on the `NftMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `nft_id` on the `NftMetadata` table. All the data in the column will be lost.
  - The primary key for the `Tickets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `lot_id` on the `Tickets` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_lot,id_user]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_lot]` on the table `Nft` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_nft]` on the table `NftMetadata` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_favorite` to the `Favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_lot` to the `Favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_lot` to the `Nft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_nft` to the `Nft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_lot` to the `NftMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_nft` to the `NftMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_nftMetadata` to the `NftMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_lot` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_ticket` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Season_Leaderboard` DROP FOREIGN KEY `Season_Leaderboard_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quest_Steps` DROP FOREIGN KEY `User_Quest_Steps_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quests` DROP FOREIGN KEY `User_Quests_user_id_fkey`;

-- DropIndex
DROP INDEX `lot_id` ON `Favorites`;

-- DropIndex
DROP INDEX `lot_id_user_id` ON `Favorites`;

-- DropIndex
DROP INDEX `user_id` ON `Favorites`;

-- DropIndex
DROP INDEX `Nft_lot_id_key` ON `Nft`;

-- DropIndex
DROP INDEX `NftMetadata_nft_id_key` ON `NftMetadata`;

-- DropIndex
DROP INDEX `nft_id` ON `NftMetadata`;

-- AlterTable
ALTER TABLE `Favorites` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `lot_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `id_favorite` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_lot` INTEGER NOT NULL,
    ADD COLUMN `id_user` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_favorite`);

-- AlterTable
ALTER TABLE `Nft` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `lot_id`,
    ADD COLUMN `id_lot` INTEGER NOT NULL,
    ADD COLUMN `id_nft` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_nft`);

-- AlterTable
ALTER TABLE `NftMetadata` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `lot_id`,
    DROP COLUMN `nft_id`,
    ADD COLUMN `id_lot` INTEGER NOT NULL,
    ADD COLUMN `id_nft` INTEGER NOT NULL,
    ADD COLUMN `id_nftMetadata` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_nftMetadata`);

-- AlterTable
ALTER TABLE `Tickets` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `lot_id`,
    ADD COLUMN `id_lot` INTEGER NOT NULL,
    ADD COLUMN `id_ticket` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_ticket`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_user` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_user`);

-- CreateIndex
CREATE INDEX `id_lot` ON `Favorites`(`id_lot`);

-- CreateIndex
CREATE INDEX `id_user` ON `Favorites`(`id_user`);

-- CreateIndex
CREATE UNIQUE INDEX `id_lot_id_user` ON `Favorites`(`id_lot`, `id_user`);

-- CreateIndex
CREATE UNIQUE INDEX `Nft_id_lot_key` ON `Nft`(`id_lot`);

-- CreateIndex
CREATE UNIQUE INDEX `NftMetadata_id_nft_key` ON `NftMetadata`(`id_nft`);

-- CreateIndex
CREATE INDEX `id_nft` ON `NftMetadata`(`id_nft`);

-- AddForeignKey
ALTER TABLE `Season_Leaderboard` ADD CONSTRAINT `Season_Leaderboard_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quests` ADD CONSTRAINT `User_Quests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quest_Steps` ADD CONSTRAINT `User_Quest_Steps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
