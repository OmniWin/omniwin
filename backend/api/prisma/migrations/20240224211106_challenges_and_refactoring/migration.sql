/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User_Quest_Steps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User_Quests` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Season_Leaderboard` DROP FOREIGN KEY `Season_Leaderboard_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quest_Steps` DROP FOREIGN KEY `User_Quest_Steps_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_Quests` DROP FOREIGN KEY `User_Quests_user_id_fkey`;

-- AlterTable
ALTER TABLE `Season_Leaderboard` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User_Quest_Steps` DROP PRIMARY KEY,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`, `quest_id`);

-- AlterTable
ALTER TABLE `User_Quests` DROP PRIMARY KEY,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`, `quest_id`);

-- AddForeignKey
ALTER TABLE `Season_Leaderboard` ADD CONSTRAINT `Season_Leaderboard_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quests` ADD CONSTRAINT `User_Quests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Quest_Steps` ADD CONSTRAINT `User_Quest_Steps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
