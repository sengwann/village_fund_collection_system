import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required seed environment variable: ${name}`);
  }
  return value;
}

function getSeedConfig() {
  // Guard production seeding unless explicitly allowed
  if (
    process.env.NODE_ENV === "production" &&
    process.env.SEED_ALLOW_PRODUCTION !== "1"
  ) {
    throw new Error(
      "Production seeding is disabled. Set SEED_ALLOW_PRODUCTION=1 and provide secure seed credentials.",
    );
  }

  return {
    adminEmail: process.env.SEED_ADMIN_EMAIL ?? "admin@example.com",
    adminPassword: getRequiredEnv("SEED_ADMIN_PASSWORD"),
  };
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  const seedConfig = getSeedConfig();
  const adminPasswordHash = await hashPassword(seedConfig.adminPassword);

  await prisma.user.upsert({
    where: { email: seedConfig.adminEmail },
    update: {
      name: "System Admin",
      passwordHash: adminPasswordHash,
      role: UserRole.SYSTEM_ADMIN,
      villageId: null,
      houseId: null,
      membershipStatus: null,
    },
    create: {
      name: "System Admin",
      email: seedConfig.adminEmail,
      passwordHash: adminPasswordHash,
      role: UserRole.SYSTEM_ADMIN,
      villageId: null,
      houseId: null,
      membershipStatus: null,
    },
  });

  console.log("Development seed completed.");
  console.log("System Admin:", seedConfig.adminEmail);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
