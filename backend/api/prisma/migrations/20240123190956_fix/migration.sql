/*
  Warnings:

  - You are about to drop the column `tokensSpent` on the `Tickets` table. All the data in the column will be lost.
  - Added the required column `tokens_spent` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tickets` DROP COLUMN `tokensSpent`,
    ADD COLUMN `tokens_spent` BIGINT NOT NULL;
