/*
  Warnings:

  - Made the column `nationalCode` on table `Passenger` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Passenger" ALTER COLUMN "nationalCode" SET NOT NULL;
