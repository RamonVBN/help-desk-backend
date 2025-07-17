/*
  Warnings:

  - You are about to drop the column `serviceId` on the `calleds` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "calleds" DROP CONSTRAINT "calleds_serviceId_fkey";

-- AlterTable
ALTER TABLE "calleds" DROP COLUMN "serviceId";

-- CreateTable
CREATE TABLE "services_calleds" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "calledId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_calleds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "services_calleds" ADD CONSTRAINT "services_calleds_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_calleds" ADD CONSTRAINT "services_calleds_calledId_fkey" FOREIGN KEY ("calledId") REFERENCES "calleds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
