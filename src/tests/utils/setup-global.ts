import { execSync } from "child_process";

export default async function globalSetup() {
  console.log("Seeding test database...");
  execSync("npm run seed", { stdio: "inherit" });
}