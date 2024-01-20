/*
  Warnings:

  - A unique constraint covering the columns `[id_nft]` on the table `NFTMetadata` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `NFTMetadata_id_nft_key` ON `NFTMetadata`(`id_nft`);
