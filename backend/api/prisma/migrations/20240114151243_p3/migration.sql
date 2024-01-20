/*
  Warnings:

  - Added the required column `id_lot` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NFT` ADD COLUMN `id_lot` INTEGER NOT NULL;
