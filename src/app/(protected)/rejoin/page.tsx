import { logoutAction } from "../../../features/auth/actions/logout.action";
import { RejoinForm } from "../../../features/membership-rejoin/components/rejoin-form";
import { requireRejoinContext } from "../../../features/membership-rejoin/lib/rejoin-access";
import { prisma } from "../../../lib/prisma";

export const metadata = {
  title: "Rejoin Household | Village Fund Collection System",
};

export default async function RejoinPage() {
  const { villageId, membershipStatus } = await requireRejoinContext();

  const village = await prisma.village.findUnique({
    where: {
      id: villageId,
    },
    select: {
      name: true,
      villageCode: true,
    },
  });

  const houses = await prisma.house.findMany({
    where: {
      villageId,
      isActive: true,
    },
    orderBy: {
      houseNumber: "asc",
    },
    select: {
      houseNumber: true,
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Rejoin a household
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Your membership in{" "}
            <span className="font-medium">
              {village?.name ?? "this village"}
            </span>{" "}
            is currently <span className="font-medium">{membershipStatus}</span>
            . To rejoin, submit a new household request below.
          </p>
        </div>

        {houses.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-slate-600">
              There are no active houses in this village yet. Please contact
              your village chief.
            </p>
          </div>
        ) : (
          <RejoinForm houses={houses} />
        )}

        <form action={logoutAction}>
          <button
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            type="submit"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
