-- DropForeignKey
ALTER TABLE "services_calleds" DROP CONSTRAINT "services_calleds_calledId_fkey";

-- DropForeignKey
ALTER TABLE "services_calleds" DROP CONSTRAINT "services_calleds_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "services_calleds" ADD CONSTRAINT "services_calleds_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_calleds" ADD CONSTRAINT "services_calleds_calledId_fkey" FOREIGN KEY ("calledId") REFERENCES "calleds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
