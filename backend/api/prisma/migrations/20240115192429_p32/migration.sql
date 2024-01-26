-- AlterTable
ALTER TABLE `NFTMetadata` ADD COLUMN `description` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `image` VARCHAR(191) NULL,
    MODIFY `json` JSON NULL,
    MODIFY `image_url` VARCHAR(191) NULL,
    MODIFY `image_local` VARCHAR(191) NULL;
