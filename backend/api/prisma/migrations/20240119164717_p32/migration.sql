/*
  Warnings:

  - A unique constraint covering the columns `[uniqueID]` on the table `Tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Tickets_id_lot_recipient_key` ON `Tickets`;

-- CreateIndex
CREATE UNIQUE INDEX `Tickets_uniqueID_key` ON `Tickets`(`uniqueID`);
