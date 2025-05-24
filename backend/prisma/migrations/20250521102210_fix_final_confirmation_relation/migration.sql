-- DropForeignKey
ALTER TABLE "Pack" DROP CONSTRAINT "Pack_busAssignmentId_fkey";

-- AlterTable
ALTER TABLE "Pack" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_busAssignmentId_fkey" FOREIGN KEY ("busAssignmentId") REFERENCES "BusAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
