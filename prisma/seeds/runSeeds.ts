import { env } from "../../src/env";
import { execSync } from "child_process";

if (env.NODE_ENV === "production") {
  execSync("ts-node prisma/seeds/production/seed.ts", { stdio: "inherit" });
} else {
  execSync("ts-node prisma/seeds/development/seed.ts", { stdio: "inherit" });
}