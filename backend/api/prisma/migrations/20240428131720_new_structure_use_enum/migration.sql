/*
  Warnings:

  - You are about to alter the column `status` on the `raffles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `sidechain_enabled_raffles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `raffles` MODIFY `status` ENUM('money_raised', 'money_not_raised', 'winner_set') NOT NULL;

-- AlterTable
ALTER TABLE `sidechain_enabled_raffles` MODIFY `status` ENUM('pending', 'created', 'pending_time_exceeded', 'money_not_raised', 'winner_set') NOT NULL;
