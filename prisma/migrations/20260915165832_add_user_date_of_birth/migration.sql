-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" DATE;

-- CreateIndex
CREATE INDEX "User_villageId_dateOfBirth_idx" ON "User"("villageId", "dateOfBirth");
