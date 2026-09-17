import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireChief } from "@/lib/authz";
import { requireSameVillage } from "@/lib/authz/tenant";
import { prisma } from "@/lib/prisma";
import { MembershipStatus } from "@prisma/client";
import { EditHouseNumberForm } from "@/features/house-management/components/edit-house-number-form";
import { canEditHouseNumber } from "@/features/house-management/lib/house-rules";

export const metadata = {
  title: "Edit House | Village Fund Collection System",
};

type RouteParams = Record<string, string | string[] | undefined>;

async function extractHouseId(rawParams: unknown): Promise<string> {
  if (!rawParams) return "";
  let params: RouteParams;
  const maybePromise = rawParams as { then?: unknown };
  if (typeof maybePromise.then === "function") {
    params = await (rawParams as Promise<RouteParams>);
  } else {
    params = rawParams as RouteParams;
  }
  const houseId = params.houseId;
  if (Array.isArray(houseId)) return houseId[0] ?? "";
  return houseId ?? "";
}

export default async function EditHousePage({ params }: { params: unknown }) {
  const ctx = await requireChief();
  const houseId = await extractHouseId(params);
  if (!houseId) return notFound();

  const house = await prisma.house.findUnique({
    where: { id: houseId },
    select: {
      id: true,
      villageId: true,
      houseNumber: true,
      isActive: true,
      _count: {
        select: {
          payments: true,
          members: {
            where: {
              membershipStatus: {
                in: [MembershipStatus.ACTIVE, MembershipStatus.PENDING],
              },
            },
          },
        },
      },
    },
  });

  if (!house) return notFound();
  requireSameVillage(ctx, house.villageId);

  const rules = canEditHouseNumber({
    isActive: house.isActive,
    hasActiveOrPendingMembers: house._count.members > 0,
    hasPayments: house._count.payments > 0,
  });

  if (!rules.allowed) {
    redirect(`/village/houses/${houseId}`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Edit house number
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Update the official house number.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href={`/village/houses/${houseId}`}
          >
            Cancel
          </Link>
        </div>
      </div>
      <EditHouseNumberForm
        houseId={house.id}
        currentHouseNumber={house.houseNumber}
      />
    </div>
  );
}
