/*
  Warnings:

  - You are about to drop the column `assetClaimed` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `assetType` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `bonusTickets` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `endTimestamp` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `ticketPrice` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `ticketsBought` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `tokenID` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `tokensClaimed` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `totalTickets` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NFTMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `NFTMetadata` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_lot,network]` on the table `NFT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `asset_claimed` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset_type` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bonus_tickets` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_timestamp` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_price` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tickets_bought` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_id` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokens_claimed` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_tickets` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `NFT_token_tokenID_assetType_network_key` ON `NFT`;

-- DropIndex
DROP INDEX `token_tokenID` ON `NFT`;

-- AlterTable
ALTER TABLE `NFT` DROP COLUMN `assetClaimed`,
    DROP COLUMN `assetType`,
    DROP COLUMN `bonusTickets`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `endTimestamp`,
    DROP COLUMN `ticketPrice`,
    DROP COLUMN `ticketsBought`,
    DROP COLUMN `tokenID`,
    DROP COLUMN `tokensClaimed`,
    DROP COLUMN `totalTickets`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `asset_claimed` BOOLEAN NOT NULL,
    ADD COLUMN `asset_type` ENUM('ERC721', 'ERC1155', 'ERC20', 'ERC777', 'ERC1155ATOMIC', 'ERC721ATOMIC', 'ERC20ATOMIC', 'ERC777ATOMIC', 'ERC721ATOMICV2', 'ERC1155ATOMICV2', 'ERC20ATOMICV2', 'ERC777ATOMICV2', 'ERC721ATOMICV3', 'ERC1155ATOMICV3', 'ERC20ATOMICV3', 'ERC777ATOMICV3') NOT NULL,
    ADD COLUMN `bonus_tickets` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `end_timestamp` INTEGER NOT NULL,
    ADD COLUMN `ticket_price` INTEGER NOT NULL,
    ADD COLUMN `tickets_bought` INTEGER NOT NULL,
    ADD COLUMN `token_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `tokens_claimed` BOOLEAN NOT NULL,
    ADD COLUMN `total_tickets` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `NFTMetadata` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `token_tokenID` ON `NFT`(`token`, `token_id`);

-- CreateIndex
CREATE UNIQUE INDEX `NFT_id_lot_network_key` ON `NFT`(`id_lot`, `network`);
