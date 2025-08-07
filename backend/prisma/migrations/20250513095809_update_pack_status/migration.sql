/*
  Warnings:

  - The values outside [normal, vip] on the enum `PackType` will be updated to 'normal' if they exist.
  - Changed the type of `type` on the `Pack` table to PackType enum.
  - Changed the type of `status` on the `Pack` table to PackStatus enum.
*/

-- Step 1: Update `type` column to PackType enum
BEGIN;
-- Create the new enum type for PackType
CREATE TYPE "PackType_new" AS ENUM ('normal', 'vip');
-- Update any invalid values to 'normal' to match the enum
UPDATE "Pack" SET "type" = 'normal' WHERE "type" NOT IN ('normal', 'vip');
-- Drop the default constraint to avoid casting issues
ALTER TABLE "Pack" ALTER COLUMN "type" DROP DEFAULT;
-- Change the type of the `type` column to the new enum
ALTER TABLE "Pack" ALTER COLUMN "type" TYPE "PackType_new" USING ("type"::text::"PackType_new");
-- Rename the old PackType enum to a temporary name
ALTER TYPE "PackType" RENAME TO "PackType_old";
-- Rename the new enum to the correct name
ALTER TYPE "PackType_new" RENAME TO "PackType";
-- Drop the old enum
DROP TYPE "PackType_old";
-- Set the new default value for type
ALTER TABLE "Pack" ALTER COLUMN "type" SET DEFAULT 'normal';
COMMIT;

-- Step 2: Update `status` column to PackStatus enum
BEGIN;
-- Create the new enum type for PackStatus
CREATE TYPE "PackStatus_new" AS ENUM ('pending', 'assigned', 'confirmed');
-- Update any invalid values to 'pending' to match the enum
UPDATE "Pack" SET "status" = 'pending' WHERE "status" NOT IN ('pending', 'assigned', 'confirmed');
-- Drop the default constraint to avoid casting issues
ALTER TABLE "Pack" ALTER COLUMN "status" DROP DEFAULT;
-- Change the type of the `status` column to the new enum
ALTER TABLE "Pack" ALTER COLUMN "status" TYPE "PackStatus_new" USING ("status"::text::"PackStatus_new");
-- Rename the old PackStatus enum to a temporary name
ALTER TYPE "PackStatus" RENAME TO "PackStatus_old";
-- Rename the new enum to the correct name
ALTER TYPE "PackStatus_new" RENAME TO "PackStatus";
-- Drop the old enum
DROP TYPE "PackStatus_old";
-- Set the new default value for status
ALTER TABLE "Pack" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;