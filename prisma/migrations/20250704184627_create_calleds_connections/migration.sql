/*
  Warnings:

  - Added the required column `clientId` to the `calleds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `calleds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicianId` to the `calleds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calleds" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "serviceId" TEXT NOT NULL,
ADD COLUMN     "technicianId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "calleds" ADD CONSTRAINT "calleds_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calleds" ADD CONSTRAINT "calleds_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calleds" ADD CONSTRAINT "calleds_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technician_infos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
