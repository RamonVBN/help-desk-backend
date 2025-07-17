/*
  Warnings:

  - Added the required column `price` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "technician_infos" ALTER COLUMN "availableHours" SET DEFAULT ARRAY['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']::TEXT[];
