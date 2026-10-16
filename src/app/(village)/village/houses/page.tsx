import { requireChief } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { HousesDirectory } from "@/features/house-management/components/houses-directory";

export const metadata = {
  title: "Houses | Village Fund Collection System",
};

export default async function HousesPage() {
  const { villageId } = await requireChief();

  const houses = await prisma.house.findMany({
    where: {
      villageId,
    },
    orderBy: {
      houseNumber: "asc",
    },
    select: {
      id: true,
      houseNumber: true,
      isActive: true,
    },
  });

  return <HousesDirectory houses={houses} />;
}