/*
  Warnings:

  - You are about to drop the `services_calleds` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceId` to the `calleds` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "services_calleds" DROP CONSTRAINT "services_calleds_calledId_fkey";

-- DropForeignKey
ALTER TABLE "services_calleds" DROP CONSTRAINT "services_calleds_serviceId_fkey";

-- AlterTable
ALTER TABLE "calleds" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "services_calleds";

-- CreateTable
CREATE TABLE "additional_services" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "calledId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "additional_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "additional_services" ADD CONSTRAINT "additional_services_calledId_fkey" FOREIGN KEY ("calledId") REFERENCES "calleds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calleds" ADD CONSTRAINT "calleds_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
