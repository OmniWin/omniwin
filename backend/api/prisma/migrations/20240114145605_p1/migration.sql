/*
  Warnings:

  - You are about to alter the column `assetType` on the `NFT` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[token,tokenID,assetType]` on the table `NFT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `network` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NFT` ADD COLUMN `network` ENUM('ETHEREUM', 'GOERLI') NOT NULL,
    MODIFY `assetType` ENUM('ERC721', 'ERC1155', 'ERC20', 'ERC777', 'ERC1155ATOMIC', 'ERC721ATOMIC', 'ERC20ATOMIC', 'ERC777ATOMIC', 'ERC721ATOMICV2', 'ERC1155ATOMICV2', 'ERC20ATOMICV2', 'ERC777ATOMICV2', 'ERC721ATOMICV3', 'ERC1155ATOMICV3', 'ERC20ATOMICV3', 'ERC777ATOMICV3') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `NFT_token_tokenID_assetType_key` ON `NFT`(`token`, `tokenID`, `assetType`);
