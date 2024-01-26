-- CreateTable
CREATE TABLE `Nft` (
    `id_nft` INTEGER NOT NULL AUTO_INCREMENT,
    `id_lot` INTEGER NOT NULL,
    `total_tickets` INTEGER NOT NULL DEFAULT 0,
    `bonus_tickets` INTEGER NOT NULL DEFAULT 0,
    `tickets_bought` INTEGER NOT NULL DEFAULT 0,
    `ticket_price` BIGINT NOT NULL,
    `transactions` INTEGER NOT NULL DEFAULT 0,
    `end_timestamp` INTEGER NOT NULL,
    `fee` INTEGER NOT NULL DEFAULT 600,
    `closed` BOOLEAN NOT NULL DEFAULT false,
    `buyout` BOOLEAN NOT NULL DEFAULT false,
    `asset_claimed` BOOLEAN NOT NULL DEFAULT false,
    `tokens_claimed` BOOLEAN NOT NULL DEFAULT false,
    `owner` VARCHAR(191) NOT NULL,
    `signer` VARCHAR(191) NULL,
    `token` VARCHAR(191) NOT NULL,
    `token_id` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `asset_type` ENUM('ERC721', 'ERC1155', 'ERC20', 'ERC777', 'ERC1155ATOMIC', 'ERC721ATOMIC', 'ERC20ATOMIC', 'ERC777ATOMIC', 'ERC721ATOMICV2', 'ERC1155ATOMICV2', 'ERC20ATOMICV2', 'ERC777ATOMICV2', 'ERC721ATOMICV3', 'ERC1155ATOMICV3', 'ERC20ATOMICV3', 'ERC777ATOMICV3') NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `network` ENUM('ETHEREUM', 'GOERLI') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `token_tokenID`(`token`, `token_id`),
    UNIQUE INDEX `Nft_id_lot_network_key`(`id_lot`, `network`),
    PRIMARY KEY (`id_nft`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NftMetadata` (
    `id_nftMetadata` INTEGER NOT NULL AUTO_INCREMENT,
    `id_nft` INTEGER NOT NULL,
    `id_lot` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `description` VARCHAR(2000) NULL,
    `json` JSON NULL,
    `image_url` VARCHAR(191) NULL,
    `image_local` VARCHAR(191) NULL,
    `status` ENUM('ERROR', 'FAILED', 'SUCCESS') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `NftMetadata_id_nft_key`(`id_nft`),
    INDEX `id_nft`(`id_nft`),
    PRIMARY KEY (`id_nftMetadata`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tickets` (
    `id_ticket` INTEGER NOT NULL AUTO_INCREMENT,
    `id_lot` INTEGER NOT NULL,
    `unique_id` VARCHAR(191) NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `total_tickets` INTEGER NOT NULL,
    `amount` BIGINT NOT NULL,
    `tokensSpent` BIGINT NOT NULL,
    `bonus` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `recipient`(`recipient`),
    UNIQUE INDEX `Tickets_unique_id_key`(`unique_id`),
    PRIMARY KEY (`id_ticket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NftMetadata` ADD CONSTRAINT `NftMetadata_id_nft_fkey` FOREIGN KEY (`id_nft`) REFERENCES `Nft`(`id_nft`) ON DELETE RESTRICT ON UPDATE CASCADE;
