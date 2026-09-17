import {
  MembershipStatus,
  PrismaClient,
  UserRole,
  VillageStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Setup PostgreSQL Driver Adapter for Prisma 7
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "admin@example.com";
const CHIEF_EMAIL = "chief@example.com";
const VILLAGER_EMAIL = "villager@example.com";
const COLLECTOR_EMAIL = "collector@example.com";
const PENDING_EMAIL = "pending@example.com";
const OTHER_CHIEF_EMAIL = "otherchief@example.com";
const OTHER_VILLAGER_EMAIL = "othervillager@example.com";

const ADMIN_PASSWORD = "Admin123!";
const CHIEF_PASSWORD = "Chief123!";
const VILLAGER_PASSWORD = "Villager123!";
const COLLECTOR_PASSWORD = "Collector123!";
const PENDING_PASSWORD = "Pending123!";
const OTHER_CHIEF_PASSWORD = "OtherChief123!";
const OTHER_VILLAGER_PASSWORD = "OtherVillager123!";

const DEV_VILLAGE_CODE = "DEV100";
const DEV_VILLAGE_NAME = "Development Village";
const DEV_HOUSE_NUMBER = "101";

const OTHER_VILLAGE_CODE = "OTHER200";
const OTHER_VILLAGE_NAME = "Other Development Village";
const OTHER_HOUSE_NUMBER = "201";

function getCurrentPeriod(): {
  year: number;
  month: number;
} {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.FORCE_SEED !== "1") {
    console.warn("Skipping seed script in production.");
    return;
  }

  const [
    adminPasswordHash,
    chiefPasswordHash,
    villagerPasswordHash,
    collectorPasswordHash,
    pendingPasswordHash,
    otherChiefPasswordHash,
    otherVillagerPasswordHash,
  ] = await Promise.all([
    hashPassword(ADMIN_PASSWORD),
    hashPassword(CHIEF_PASSWORD),
    hashPassword(VILLAGER_PASSWORD),
    hashPassword(COLLECTOR_PASSWORD),
    hashPassword(PENDING_PASSWORD),
    hashPassword(OTHER_CHIEF_PASSWORD),
    hashPassword(OTHER_VILLAGER_PASSWORD),
  ]);

  const devVillage = await prisma.village.upsert({
    where: {
      villageCode: DEV_VILLAGE_CODE,
    },
    update: {
      name: DEV_VILLAGE_NAME,
      status: VillageStatus.ACTIVE,
    },
    create: {
      villageCode: DEV_VILLAGE_CODE,
      name: DEV_VILLAGE_NAME,
      status: VillageStatus.ACTIVE,
    },
  });

  const otherVillage = await prisma.village.upsert({
    where: {
      villageCode: OTHER_VILLAGE_CODE,
    },
    update: {
      name: OTHER_VILLAGE_NAME,
      status: VillageStatus.ACTIVE,
    },
    create: {
      villageCode: OTHER_VILLAGE_CODE,
      name: OTHER_VILLAGE_NAME,
      status: VillageStatus.ACTIVE,
    },
  });

  const devHouse = await prisma.house.upsert({
    where: {
      villageId_houseNumber: {
        villageId: devVillage.id,
        houseNumber: DEV_HOUSE_NUMBER,
      },
    },
    update: {
      isActive: true,
    },
    create: {
      villageId: devVillage.id,
      houseNumber: DEV_HOUSE_NUMBER,
      isActive: true,
    },
  });

  const otherHouse = await prisma.house.upsert({
    where: {
      villageId_houseNumber: {
        villageId: otherVillage.id,
        houseNumber: OTHER_HOUSE_NUMBER,
      },
    },
    update: {
      isActive: true,
    },
    create: {
      villageId: otherVillage.id,
      houseNumber: OTHER_HOUSE_NUMBER,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: {
      email: ADMIN_EMAIL,
    },
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
      email: ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      role: UserRole.SYSTEM_ADMIN,
      villageId: null,
      houseId: null,
      membershipStatus: null,
    },
  });

  const devChief = await prisma.user.upsert({
    where: {
      email: CHIEF_EMAIL,
    },
    update: {
      name: "Dev Chief",
      passwordHash: chiefPasswordHash,
      role: UserRole.CHIEF,
      villageId: devVillage.id,
      houseId: devHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
      phone: "+959100000001",
    },
    create: {
      name: "Dev Chief",
      email: CHIEF_EMAIL,
      phone: "+959100000001",
      passwordHash: chiefPasswordHash,
      role: UserRole.CHIEF,
      villageId: devVillage.id,
      houseId: devHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: {
      email: VILLAGER_EMAIL,
    },
    update: {
      name: "Dev Villager",
      passwordHash: villagerPasswordHash,
      role: UserRole.VILLAGER,
      villageId: devVillage.id,
      houseId: devHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
      phone: "+959100000002",
    },
    create: {
      name: "Dev Villager",
      email: VILLAGER_EMAIL,
      phone: "+959100000002",
      passwordHash: villagerPasswordHash,
      role: UserRole.VILLAGER,
      villageId: devVillage.id,
      houseId: devHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
    },
  });

  const collector = await prisma.user.upsert({
    where: {
      email: COLLECTOR_EMAIL,
    },
    update: {
      name: "Dev Collector",
      passwordHash: collectorPasswordHash,
      role: UserRole.VILLAGER,
      villageId: devVillage.id,
      houseId: devHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
      phone: "+959100000003",
    },
    create: {
      name: "Dev Collector",
      email: COLLECTOR_EMAIL,
      phone: "+959100000003",
      passwordHash: collectorPasswordHash,
      role: UserRole.VILLAGER,
      villageId: devVillage.id,
      houseId: devHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: {
      email: PENDING_EMAIL,
    },
    update: {
      name: "Dev Pending",
      passwordHash: pendingPasswordHash,
      role: UserRole.VILLAGER,
      villageId: devVillage.id,
      houseId: devHouse.id,
      membershipStatus: MembershipStatus.PENDING,
      phone: "+959100000004",
    },
    create: {
      name: "Dev Pending",
      email: PENDING_EMAIL,
      phone: "+959100000004",
      passwordHash: pendingPasswordHash,
      role: UserRole.VILLAGER,
      villageId: devVillage.id,
      houseId: devHouse.id,
      membershipStatus: MembershipStatus.PENDING,
    },
  });

  const otherChief = await prisma.user.upsert({
    where: {
      email: OTHER_CHIEF_EMAIL,
    },
    update: {
      name: "Other Chief",
      passwordHash: otherChiefPasswordHash,
      role: UserRole.CHIEF,
      villageId: otherVillage.id,
      houseId: otherHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
      phone: "+959200000001",
    },
    create: {
      name: "Other Chief",
      email: OTHER_CHIEF_EMAIL,
      phone: "+959200000001",
      passwordHash: otherChiefPasswordHash,
      role: UserRole.CHIEF,
      villageId: otherVillage.id,
      houseId: otherHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: {
      email: OTHER_VILLAGER_EMAIL,
    },
    update: {
      name: "Other Villager",
      passwordHash: otherVillagerPasswordHash,
      role: UserRole.VILLAGER,
      villageId: otherVillage.id,
      houseId: otherHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
      phone: "+959200000002",
    },
    create: {
      name: "Other Villager",
      email: OTHER_VILLAGER_EMAIL,
      phone: "+959200000002",
      passwordHash: otherVillagerPasswordHash,
      role: UserRole.VILLAGER,
      villageId: otherVillage.id,
      houseId: otherHouse.id,
      membershipStatus: MembershipStatus.ACTIVE,
    },
  });

  await prisma.house.update({
    where: {
      id: devHouse.id,
    },
    data: {
      headOfHouseId: null,
    },
  });

  await prisma.house.update({
    where: {
      id: otherHouse.id,
    },
    data: {
      headOfHouseId: null,
    },
  });

  await prisma.house.update({
    where: {
      id: devHouse.id,
    },
    data: {
      headOfHouseId: devChief.id,
    },
  });

  await prisma.house.update({
    where: {
      id: otherHouse.id,
    },
    data: {
      headOfHouseId: otherChief.id,
    },
  });

  const { year, month } = getCurrentPeriod();

  await prisma.collectorAssignment.upsert({
    where: {
      villageId_userId_year_month: {
        villageId: devVillage.id,
        userId: collector.id,
        year,
        month,
      },
    },
    update: {
      isActive: true,
    },
    create: {
      villageId: devVillage.id,
      userId: collector.id,
      year,
      month,
      isActive: true,
    },
  });

  console.log("Development seed completed.");
  console.log("");
  console.log("Current collector period:", `${year}-${month}`);
  console.log("");
  console.log("Development Village 1:");
  console.log("Village code:", DEV_VILLAGE_CODE);
  console.log("Village ID:", devVillage.id);
  console.log("House number:", DEV_HOUSE_NUMBER);
  console.log("House ID:", devHouse.id);
  console.log("");
  console.log("Development Village 2:");
  console.log("Village code:", OTHER_VILLAGE_CODE);
  console.log("Village ID:", otherVillage.id);
  console.log("House number:", OTHER_HOUSE_NUMBER);
  console.log("House ID:", otherHouse.id);
  console.log("");
  console.log("System Admin:", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
  console.log("Dev Chief:", CHIEF_EMAIL, "/", CHIEF_PASSWORD);
  console.log("Dev Villager:", VILLAGER_EMAIL, "/", VILLAGER_PASSWORD);
  console.log("Dev Collector:", COLLECTOR_EMAIL, "/", COLLECTOR_PASSWORD);
  console.log("Dev Pending:", PENDING_EMAIL, "/", PENDING_PASSWORD);
  console.log("Other Chief:", OTHER_CHIEF_EMAIL, "/", OTHER_CHIEF_PASSWORD);
  console.log(
    "Other Villager:",
    OTHER_VILLAGER_EMAIL,
    "/",
    OTHER_VILLAGER_PASSWORD,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
