/*
  Warnings:

  - The `status` column on the `services` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "serviceStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "calledStatus" AS ENUM ('OPEN', 'PROGRESS', 'CLOSED');

-- AlterTable
ALTER TABLE "calleds" ADD COLUMN     "status" "calledStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "services" DROP COLUMN "status",
ADD COLUMN     "status" "serviceStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "Status";
