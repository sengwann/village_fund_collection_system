import {
  MembershipStatus,
  PrismaClient,
  UserRole,
  VillageStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEV_VILLAGE_CODE = "DEV100";
const DEV_VILLAGE_NAME = "Development Village";
const DEV_HOUSE_NUMBER = "101";
const OTHER_VILLAGE_CODE = "OTHER200";
const OTHER_VILLAGE_NAME = "Other Development Village";
const OTHER_HOUSE_NUMBER = "201";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required seed environment variable: ${name}`);
  }
  return value;
}

function getSeedConfig() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_PRODUCTION !== "1") {
    throw new Error(
      "Production seeding is disabled. Set SEED_ALLOW_PRODUCTION=1 and provide secure seed credentials.",
    );
  }

  return {
    adminEmail: process.env.SEED_ADMIN_EMAIL ?? "dev-admin@example.invalid",
    adminPassword: getRequiredEnv("SEED_ADMIN_PASSWORD"),
    chiefEmail: process.env.SEED_CHIEF_EMAIL ?? "dev-chief@example.invalid",
    chiefPassword: getRequiredEnv("SEED_CHIEF_PASSWORD"),
    villagerEmail: process.env.SEED_VILLAGER_EMAIL ?? "dev-villager@example.invalid",
    villagerPassword: getRequiredEnv("SEED_VILLAGER_PASSWORD"),
    collectorEmail: process.env.SEED_COLLECTOR_EMAIL ?? "dev-collector@example.invalid",
    collectorPassword: getRequiredEnv("SEED_COLLECTOR_PASSWORD"),
    pendingEmail: process.env.SEED_PENDING_EMAIL ?? "dev-pending@example.invalid",
    pendingPassword: getRequiredEnv("SEED_PENDING_PASSWORD"),
    otherChiefEmail: process.env.SEED_OTHER_CHIEF_EMAIL ?? "dev-other-chief@example.invalid",
    otherChiefPassword: getRequiredEnv("SEED_OTHER_CHIEF_PASSWORD"),
    otherVillagerEmail: process.env.SEED_OTHER_VILLAGER_EMAIL ?? "dev-other-villager@example.invalid",
    otherVillagerPassword: getRequiredEnv("SEED_OTHER_VILLAGER_PASSWORD"),
  };
}

function getCurrentPeriod(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  const seedConfig = getSeedConfig();
  const [adminPasswordHash, chiefPasswordHash, villagerPasswordHash, collectorPasswordHash, pendingPasswordHash, otherChiefPasswordHash, otherVillagerPasswordHash] = await Promise.all([
    hashPassword(seedConfig.adminPassword),
    hashPassword(seedConfig.chiefPassword),
    hashPassword(seedConfig.villagerPassword),
    hashPassword(seedConfig.collectorPassword),
    hashPassword(seedConfig.pendingPassword),
    hashPassword(seedConfig.otherChiefPassword),
    hashPassword(seedConfig.otherVillagerPassword),
  ]);

  const devVillage = await prisma.village.upsert({
    where: { villageCode: DEV_VILLAGE_CODE },
    update: { name: DEV_VILLAGE_NAME, status: VillageStatus.ACTIVE },
    create: { villageCode: DEV_VILLAGE_CODE, name: DEV_VILLAGE_NAME, status: VillageStatus.ACTIVE },
  });
  const otherVillage = await prisma.village.upsert({
    where: { villageCode: OTHER_VILLAGE_CODE },
    update: { name: OTHER_VILLAGE_NAME, status: VillageStatus.ACTIVE },
    create: { villageCode: OTHER_VILLAGE_CODE, name: OTHER_VILLAGE_NAME, status: VillageStatus.ACTIVE },
  });
  const devHouse = await prisma.house.upsert({
    where: { villageId_houseNumber: { villageId: devVillage.id, houseNumber: DEV_HOUSE_NUMBER } },
    update: { isActive: true },
    create: { villageId: devVillage.id, houseNumber: DEV_HOUSE_NUMBER, isActive: true },
  });
  const otherHouse = await prisma.house.upsert({
    where: { villageId_houseNumber: { villageId: otherVillage.id, houseNumber: OTHER_HOUSE_NUMBER } },
    update: { isActive: true },
    create: { villageId: otherVillage.id, houseNumber: OTHER_HOUSE_NUMBER, isActive: true },
  });

  await prisma.user.upsert({
    where: { email: seedConfig.adminEmail },
    update: { name: "System Admin", passwordHash: adminPasswordHash, role: UserRole.SYSTEM_ADMIN, villageId: null, houseId: null, membershipStatus: null },
    create: { name: "System Admin", email: seedConfig.adminEmail, passwordHash: adminPasswordHash, role: UserRole.SYSTEM_ADMIN, villageId: null, houseId: null, membershipStatus: null },
  });
  const devChief = await prisma.user.upsert({
    where: { email: seedConfig.chiefEmail },
    update: { name: "Dev Chief", passwordHash: chiefPasswordHash, role: UserRole.CHIEF, villageId: devVillage.id, houseId: devHouse.id, membershipStatus: MembershipStatus.ACTIVE, phone: "+959100000001" },
    create: { name: "Dev Chief", email: seedConfig.chiefEmail, phone: "+959100000001", passwordHash: chiefPasswordHash, role: UserRole.CHIEF, villageId: devVillage.id, houseId: devHouse.id, membershipStatus: MembershipStatus.ACTIVE },
  });
  await prisma.user.upsert({
    where: { email: seedConfig.villagerEmail },
    update: { name: "Dev Villager", passwordHash: villagerPasswordHash, role: UserRole.VILLAGER, villageId: devVillage.id, houseId: devHouse.id, membershipStatus: MembershipStatus.ACTIVE, phone: "+959100000002" },
    create: { name: "Dev Villager", email: seedConfig.villagerEmail, phone: "+959100000002", passwordHash: villagerPasswordHash, role: UserRole.VILLAGER, villageId: devVillage.id, houseId: devHouse.id, membershipStatus: MembershipStatus.ACTIVE },
  });
  const collector = await prisma.user.upsert({
    where: { email: seedConfig.collectorEmail },
    update: { name: "Dev Collector", passwordHash: collectorPasswordHash, role: UserRole.VILLAGER, villageId: devVillage.id, houseId: devHouse.id, membershipStatus: MembershipStatus.ACTIVE, phone: "+959100000003" },
    create: { name: "Dev Collector", email: seedConfig.collectorEmail, phone: "+959100000003", passwordHash: collectorPasswordHash, role: UserRole.VILLAGER, villageId: devVillage.id, houseId: devHouse.id, membershipStatus: MembershipStatus.ACTIVE },
  });
  await prisma.user.upsert({
    where: { email: seedConfig.pendingEmail },
    update: { name: "Dev Pending", passwordHash: pendingPasswordHash, role: UserRole.VILLAGER, villageId: devVillage.id, houseId: devHouse.id, membershipStatus: MembershipStatus.PENDING, phone: "+959100000004" },
    create: { name: "Dev Pending", email: seedConfig.pendingEmail, phone: "+959100000004", passwordHash: pendingPasswordHash, role: UserRole.VILLAGER, villageId: devVillage.id, houseId: devHouse.id, membershipStatus: MembershipStatus.PENDING },
  });
  const otherChief = await prisma.user.upsert({
    where: { email: seedConfig.otherChiefEmail },
    update: { name: "Other Chief", passwordHash: otherChiefPasswordHash, role: UserRole.CHIEF, villageId: otherVillage.id, houseId: otherHouse.id, membershipStatus: MembershipStatus.ACTIVE, phone: "+959200000001" },
    create: { name: "Other Chief", email: seedConfig.otherChiefEmail, phone: "+959200000001", passwordHash: otherChiefPasswordHash, role: UserRole.CHIEF, villageId: otherVillage.id, houseId: otherHouse.id, membershipStatus: MembershipStatus.ACTIVE },
  });
  await prisma.user.upsert({
    where: { email: seedConfig.otherVillagerEmail },
    update: { name: "Other Villager", passwordHash: otherVillagerPasswordHash, role: UserRole.VILLAGER, villageId: otherVillage.id, houseId: otherHouse.id, membershipStatus: MembershipStatus.ACTIVE, phone: "+959200000002" },
    create: { name: "Other Villager", email: seedConfig.otherVillagerEmail, phone: "+959200000002", passwordHash: otherVillagerPasswordHash, role: UserRole.VILLAGER, villageId: otherVillage.id, houseId: otherHouse.id, membershipStatus: MembershipStatus.ACTIVE },
  });

  await prisma.house.update({ where: { id: devHouse.id }, data: { headOfHouseId: null } });
  await prisma.house.update({ where: { id: otherHouse.id }, data: { headOfHouseId: null } });
  await prisma.house.update({ where: { id: devHouse.id }, data: { headOfHouseId: devChief.id } });
  await prisma.house.update({ where: { id: otherHouse.id }, data: { headOfHouseId: otherChief.id } });

  const { year, month } = getCurrentPeriod();
  await prisma.collectorAssignment.upsert({
    where: { villageId_userId_year_month: { villageId: devVillage.id, userId: collector.id, year, month } },
    update: { isActive: true },
    create: { villageId: devVillage.id, userId: collector.id, year, month, isActive: true },
  });

  console.log("Development seed completed.");
  console.log("System Admin:", seedConfig.adminEmail);
  console.log("Dev Chief:", seedConfig.chiefEmail);
  console.log("Dev Villager:", seedConfig.villagerEmail);
  console.log("Dev Collector:", seedConfig.collectorEmail);
  console.log("Dev Pending:", seedConfig.pendingEmail);
  console.log("Other Chief:", seedConfig.otherChiefEmail);
  console.log("Other Villager:", seedConfig.otherVillagerEmail);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
