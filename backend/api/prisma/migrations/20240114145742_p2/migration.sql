/*
  Warnings:

  - A unique constraint covering the columns `[token,tokenID,assetType,network]` on the table `NFT` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `NFT_token_tokenID_assetType_key` ON `NFT`;

-- CreateIndex
CREATE UNIQUE INDEX `NFT_token_tokenID_assetType_network_key` ON `NFT`(`token`, `tokenID`, `assetType`, `network`);
