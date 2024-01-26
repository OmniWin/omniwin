/*
  Warnings:

  - Added the required column `uniqueID` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tickets` ADD COLUMN `uniqueID` VARCHAR(191) NOT NULL;
