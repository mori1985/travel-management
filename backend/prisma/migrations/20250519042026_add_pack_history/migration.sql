-- CreateTable
CREATE TABLE "PackHistory" (
    "id" SERIAL NOT NULL,
    "packId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackHistory" ADD CONSTRAINT "PackHistory_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
