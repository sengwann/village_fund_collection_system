/*
  Warnings:

  - A unique constraint covering the columns `[kpayTransactionLast10,kpaySenderAccount]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_kpayTransactionLast10_kpaySenderAccount_key" ON "Payment"("kpayTransactionLast10", "kpaySenderAccount");
