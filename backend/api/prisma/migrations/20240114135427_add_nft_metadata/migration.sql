-- CreateTable
CREATE TABLE `NFTMetadata` (
    `id_nftMetadata` INTEGER NOT NULL AUTO_INCREMENT,
    `id_nft` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `json` JSON NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `image_local` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `id_nft`(`id_nft`),
    PRIMARY KEY (`id_nftMetadata`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
