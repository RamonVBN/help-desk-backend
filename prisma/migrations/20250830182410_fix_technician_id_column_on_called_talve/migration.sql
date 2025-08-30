-- DropForeignKey
ALTER TABLE "calleds" DROP CONSTRAINT "calleds_technicianId_fkey";

-- AddForeignKey
ALTER TABLE "calleds" ADD CONSTRAINT "calleds_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
