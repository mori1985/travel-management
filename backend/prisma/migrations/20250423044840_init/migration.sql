-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passenger" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "birthDate" TIMESTAMP(3) NOT NULL,
    "travelType" TEXT NOT NULL,
    "leaderName" TEXT,
    "leaderPhone" TEXT,
    "createdById" INTEGER NOT NULL,
    "packId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pack" (
    "id" SERIAL NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "repository" INTEGER NOT NULL,
    "company" TEXT,
    "plate" TEXT,
    "driver" TEXT,
    "driverPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsHistory" (
    "id" SERIAL NOT NULL,
    "packId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Passenger_nationalId_key" ON "Passenger"("nationalId");

-- CreateIndex
CREATE INDEX "Passenger_travelDate_idx" ON "Passenger"("travelDate");

-- CreateIndex
CREATE INDEX "Pack_travelDate_idx" ON "Pack"("travelDate");

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsHistory" ADD CONSTRAINT "SmsHistory_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
