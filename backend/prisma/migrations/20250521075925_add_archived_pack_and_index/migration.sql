-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ArchivedPack" (
    "id" SERIAL NOT NULL,
    "packId" INTEGER NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "type" "PackType" NOT NULL,
    "repository" INTEGER NOT NULL,
    "status" "PackStatus" NOT NULL,
    "passengers" JSONB NOT NULL,
    "busAssignment" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchivedPack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArchivedPack_packId_key" ON "ArchivedPack"("packId");

-- CreateIndex
CREATE INDEX "Pack_status_idx" ON "Pack"("status");
