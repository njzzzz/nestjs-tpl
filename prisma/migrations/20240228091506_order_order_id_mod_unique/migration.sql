/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Order_orderId_key` ON `Order`(`orderId`);
