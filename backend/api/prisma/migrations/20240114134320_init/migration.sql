-- CreateTable
CREATE TABLE `NFT` (
    `id_nft` INTEGER NOT NULL AUTO_INCREMENT,
    `totalTickets` INTEGER NOT NULL,
    `bonusTickets` INTEGER NOT NULL,
    `ticketsBought` INTEGER NOT NULL,
    `ticketPrice` INTEGER NOT NULL,
    `transactions` INTEGER NOT NULL,
    `endTimestamp` INTEGER NOT NULL,
    `fee` INTEGER NOT NULL,
    `closed` BOOLEAN NOT NULL,
    `buyout` BOOLEAN NOT NULL,
    `assetClaimed` BOOLEAN NOT NULL,
    `tokensClaimed` BOOLEAN NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `tokenID` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `assetType` INTEGER NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `token_tokenID`(`token`, `tokenID`),
    PRIMARY KEY (`id_nft`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
