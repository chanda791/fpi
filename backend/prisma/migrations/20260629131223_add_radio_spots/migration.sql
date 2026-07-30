-- CreateTable
CREATE TABLE "RadioSpot" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "station" TEXT NOT NULL,
    "duration" TEXT,
    "image" TEXT,
    "audioUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "broadcastAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadioSpot_pkey" PRIMARY KEY ("id")
);
