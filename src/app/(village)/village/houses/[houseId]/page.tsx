import Link from "next/link";
import { notFound } from "next/navigation";
import { requireChief } from "@/lib/authz";
import { requireSameVillage } from "@/lib/authz/tenant";
import { prisma } from "@/lib/prisma";
import { MembershipStatus } from "@prisma/client";
import { HouseStatusBadge } from "@/features/house-management/components/house-status-badge";
import { HouseLifecycleActions } from "@/features/house-management/components/house-lifecycle-actions";
import { canEditHouseNumber } from "@/features/house-management/lib/house-rules";
import { EditHouseLink } from "@/features/house-management/components/edit-house-link";

export const metadata = {
  title: "House Detail | Village Fund Collection System",
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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export default async function HouseDetailPage({ params }: { params: unknown }) {
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
      createdAt: true,
      updatedAt: true,
      headOfHouse: {
        select: { name: true },
      },
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

  const editRules = canEditHouseNumber({
    isActive: house.isActive,
    hasActiveOrPendingMembers: house._count.members > 0,
    hasPayments: house._count.payments > 0,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-900">
              House {house.houseNumber}
            </h1>
            <p className="truncate text-sm text-slate-600">
              Official house number details.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/village/houses"
          >
            Back to houses
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-900">
            House information
          </h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Status</dt>
              <dd>
                <HouseStatusBadge isActive={house.isActive} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Head of House</dt>
              <dd className="text-slate-900">
                {house.headOfHouse ? house.headOfHouse.name : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">
                Active/Pending Members
              </dt>
              <dd className="text-slate-900">{house._count.members}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Payment Records</dt>
              <dd className="text-slate-900">{house._count.payments}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Created</dt>
              <dd className="text-slate-900">{formatDate(house.createdAt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Updated</dt>
              <dd className="text-slate-900">{formatDate(house.updatedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium text-slate-900">Actions</h2>
            <div className="mt-3">
              <EditHouseLink houseId={house.id} editRules={editRules} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium text-slate-900">Lifecycle</h2>
            <div className="mt-3">
              <HouseLifecycleActions
                houseId={house.id}
                context={{
                  isActive: house.isActive,
                  hasActiveOrPendingMembers: house._count.members > 0,
                  hasPayments: house._count.payments > 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
