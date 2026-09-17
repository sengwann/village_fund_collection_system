import Link from "next/link";
import { redirect } from "next/navigation";
import { VillageStatus } from "@prisma/client";
import { RegisterVillagerForm } from "@/features/villager-registration/components/register-villager-form";
import { normalizeVillageCode } from "@/features/villager-registration/lib/registration-validators";
import { DEFAULT_POST_LOGIN_ROUTE } from "@/lib/auth/auth.constants";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "Complete Registration | Village Fund Collection System",
};

type SearchParams = Record<string, string | string[] | undefined>;

async function resolveSearchParams(
  searchParams: unknown,
): Promise<SearchParams> {
  if (!searchParams) {
    return {};
  }

  const maybePromise = searchParams as {
    then?: unknown;
  };

  if (typeof maybePromise.then === "function") {
    return await (searchParams as Promise<SearchParams>);
  }

  return searchParams as SearchParams;
}

function getFirstStringValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function SignupRegisterPage({
  searchParams,
}: {
  searchParams?: unknown;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect(DEFAULT_POST_LOGIN_ROUTE);
  }

  const params = await resolveSearchParams(searchParams);
  const rawCode = getFirstStringValue(params.code) ?? "";
  const villageCode = normalizeVillageCode(rawCode);

  if (!villageCode) {
    redirect("/signup");
  }

  const village = await prisma.village.findFirst({
    where: {
      villageCode,
      status: VillageStatus.ACTIVE,
    },
    select: {
      id: true,
      villageCode: true,
      name: true,
    },
  });

  if (!village) {
    redirect("/signup");
  }

  const houses = await prisma.house.findMany({
    where: {
      villageId: village.id,
      isActive: true,
    },
    orderBy: {
      houseNumber: "asc",
    },
    select: {
      houseNumber: true,
    },
  });

  if (houses.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-lg font-semibold text-slate-900">
              No houses available
            </h1>
            <p className="text-sm text-slate-600">
              {village.name} has no active house numbers yet. Please contact
              your village chief.
            </p>
          </div>

          <Link
            className="mt-6 block w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            href="/signup"
          >
            Back to village code
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Complete registration
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Create your villager account and join a house.
              </p>
            </div>
            <Link
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
              href="/signup"
            >
              Change village
            </Link>
          </div>
        </div>

        <RegisterVillagerForm
          houses={houses}
          villageCode={village.villageCode}
          villageName={village.name}
        />
      </div>
    </main>
  );
}
