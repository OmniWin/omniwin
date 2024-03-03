/*
  Warnings:

  - The primary key for the `Season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `season_id` on the `Season` table. All the data in the column will be lost.
  - Added the required column `id` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Quest` DROP FOREIGN KEY `Quest_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `Season_Leaderboard` DROP FOREIGN KEY `Season_Leaderboard_season_id_fkey`;

-- AlterTable
ALTER TABLE `Season` DROP PRIMARY KEY,
    DROP COLUMN `season_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Season_Leaderboard` ADD CONSTRAINT `Season_Leaderboard_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `Season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quest` ADD CONSTRAINT `Quest_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `Season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
