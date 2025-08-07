/*
  Warnings:

  - You are about to drop the column `company` on the `Pack` table. All the data in the column will be lost.
  - You are about to drop the column `driver` on the `Pack` table. All the data in the column will be lost.
  - You are about to drop the column `driverPhone` on the `Pack` table. All the data in the column will be lost.
  - You are about to drop the column `plate` on the `Pack` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[busAssignmentId]` on the table `Pack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PackType" AS ENUM ('normal', 'vip');

-- CreateEnum
CREATE TYPE "PackStatus" AS ENUM ('pending', 'assigned', 'completed');

-- AlterTable
ALTER TABLE "Pack" DROP COLUMN "company",
DROP COLUMN "driver",
DROP COLUMN "driverPhone",
DROP COLUMN "plate",
ADD COLUMN     "busAssignmentId" INTEGER,
ALTER COLUMN "type" SET DEFAULT 'normal',
ALTER COLUMN "repository" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "BusAssignment" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "driverPhone" TEXT NOT NULL,
    "packId" INTEGER NOT NULL,

    CONSTRAINT "BusAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusAssignment_packId_key" ON "BusAssignment"("packId");

-- CreateIndex
CREATE UNIQUE INDEX "Pack_busAssignmentId_key" ON "Pack"("busAssignmentId");

-- AddForeignKey
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_busAssignmentId_fkey" FOREIGN KEY ("busAssignmentId") REFERENCES "BusAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
