/*
  Warnings:

  - Added the required column `token_uri` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Nft` ADD COLUMN `token_uri` VARCHAR(191) NOT NULL;
