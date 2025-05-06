/*
  Warnings:

  - You are about to drop the column `lastname` on the `Passenger` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Passenger` table. All the data in the column will be lost.
  - You are about to drop the column `nationalId` on the `Passenger` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nationalCode]` on the table `Passenger` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Passenger_nationalId_key";

-- AlterTable
ALTER TABLE "Passenger" DROP COLUMN "lastname",
DROP COLUMN "name",
DROP COLUMN "nationalId",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "nationalCode" TEXT,
ALTER COLUMN "travelDate" SET DATA TYPE TEXT,
ALTER COLUMN "returnDate" SET DATA TYPE TEXT,
ALTER COLUMN "birthDate" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Passenger_nationalCode_key" ON "Passenger"("nationalCode");
