/*
  Warnings:

  - You are about to drop the column `kpayTransactionLast10` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kpayTransactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payment_kpayTransactionLast10_kpaySenderAccount_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "kpayTransactionLast10",
ADD COLUMN     "kpayTransactionId" VARCHAR(64);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_kpayTransactionId_key" ON "Payment"("kpayTransactionId");
