-- DropForeignKey
ALTER TABLE "technician_infos" DROP CONSTRAINT "technician_infos_userId_fkey";

-- AlterTable
ALTER TABLE "technician_infos" ALTER COLUMN "availableHours" SET DEFAULT ARRAY['08:00', '09:00', '10:00', '''11:00', '14:00', '15:00', '16:00', '17:00']::TEXT[];

-- AddForeignKey
ALTER TABLE "technician_infos" ADD CONSTRAINT "technician_infos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
