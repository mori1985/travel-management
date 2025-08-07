/*
  Warnings:

  - Made the column `company` on table `BusAssignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plate` on table `BusAssignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driver` on table `BusAssignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driverPhone` on table `BusAssignment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BusAssignment" ALTER COLUMN "company" SET NOT NULL,
ALTER COLUMN "plate" SET NOT NULL,
ALTER COLUMN "driver" SET NOT NULL,
ALTER COLUMN "driverPhone" SET NOT NULL;
