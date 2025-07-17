-- DropForeignKey
ALTER TABLE "calleds" DROP CONSTRAINT "calleds_clientId_fkey";

-- AddForeignKey
ALTER TABLE "calleds" ADD CONSTRAINT "calleds_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
