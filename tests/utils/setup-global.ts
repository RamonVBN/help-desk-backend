import { execSync } from "child_process";

export default async function globalSetup() {
  console.log("Seeding test database...");
  execSync("npx prisma migrate reset --force --skip-generate && npm run seed:dev", { stdio: "inherit" });
}