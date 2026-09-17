/*
  Warnings:

  - You are about to drop the column `theme` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kpayAccountName" TEXT,
ADD COLUMN     "kpayAccountNumber" TEXT;

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "theme";

-- DropEnum
DROP TYPE "ThemePreference";
