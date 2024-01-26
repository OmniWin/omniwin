-- CreateTable
CREATE TABLE `Tickets` (
    `id_ticket` INTEGER NOT NULL AUTO_INCREMENT,
    `id_lot` INTEGER NOT NULL,
    `recipient` INTEGER NOT NULL,
    `totalTickets` INTEGER NOT NULL,
    `amount` BIGINT NOT NULL,
    `tokensSpent` BIGINT NOT NULL,
    `bonus` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `recipient`(`recipient`),
    UNIQUE INDEX `Tickets_id_lot_recipient_key`(`id_lot`, `recipient`),
    PRIMARY KEY (`id_ticket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
