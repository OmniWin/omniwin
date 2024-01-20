/*
  Warnings:

  - Added the required column `status` to the `NFTMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NFTMetadata` ADD COLUMN `status` ENUM('ERROR', 'FAILED', 'SUCCESS') NOT NULL;
