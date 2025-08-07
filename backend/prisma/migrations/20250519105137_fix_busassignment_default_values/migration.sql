/*
  Warnings:

  - A unique constraint covering the columns `[finalConfirmationId]` on the table `Pack` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BusAssignment" ADD COLUMN     "travelDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "PackType" NOT NULL DEFAULT 'normal',
ALTER COLUMN "company" DROP NOT NULL,
ALTER COLUMN "plate" DROP NOT NULL,
ALTER COLUMN "driver" DROP NOT NULL,
ALTER COLUMN "driverPhone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "finalConfirmationId" INTEGER;

-- CreateTable
CREATE TABLE "FinalConfirmation" (
    "id" SERIAL NOT NULL,
    "packId" INTEGER NOT NULL,
    "busAssignmentId" INTEGER NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "type" "PackType" NOT NULL,
    "company" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "driverPhone" TEXT NOT NULL,
    "confirmationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BusAssignmentToPassenger" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BusAssignmentToPassenger_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinalConfirmation_packId_key" ON "FinalConfirmation"("packId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalConfirmation_busAssignmentId_key" ON "FinalConfirmation"("busAssignmentId");

-- CreateIndex
CREATE INDEX "FinalConfirmation_packId_idx" ON "FinalConfirmation"("packId");

-- CreateIndex
CREATE INDEX "FinalConfirmation_busAssignmentId_idx" ON "FinalConfirmation"("busAssignmentId");

-- CreateIndex
CREATE INDEX "_BusAssignmentToPassenger_B_index" ON "_BusAssignmentToPassenger"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Pack_finalConfirmationId_key" ON "Pack"("finalConfirmationId");

-- AddForeignKey
ALTER TABLE "FinalConfirmation" ADD CONSTRAINT "FinalConfirmation_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalConfirmation" ADD CONSTRAINT "FinalConfirmation_busAssignmentId_fkey" FOREIGN KEY ("busAssignmentId") REFERENCES "BusAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusAssignmentToPassenger" ADD CONSTRAINT "_BusAssignmentToPassenger_A_fkey" FOREIGN KEY ("A") REFERENCES "BusAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusAssignmentToPassenger" ADD CONSTRAINT "_BusAssignmentToPassenger_B_fkey" FOREIGN KEY ("B") REFERENCES "Passenger"("id") ON DELETE CASCADE ON UPDATE CASCADE;
