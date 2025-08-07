/*
  Warnings:

  - You are about to drop the column `count` on the `SmsHistory` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `SmsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientPhone` to the `SmsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientType` to the `SmsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SmsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SmsHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SmsHistory" DROP COLUMN "count",
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "error" TEXT,
ADD COLUMN     "recipientPhone" TEXT NOT NULL,
ADD COLUMN     "recipientType" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
