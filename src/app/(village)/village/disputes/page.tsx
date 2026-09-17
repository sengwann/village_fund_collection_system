import Link from "next/link";
import { DisputeStatus } from "@prisma/client";
import { DisputeList } from "@/features/dispute-management/components/dispute-list";
import { requireDisputeAccess } from "@/features/dispute-management/lib/dispute-access";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Disputes | Village Fund Collection System",
};

export default async function DisputesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { user, villageId, accessLevel } = await requireDisputeAccess();

  const { status } = await searchParams;

  const statusFilter = Object.values(DisputeStatus).includes(
    status as DisputeStatus,
  )
    ? (status as DisputeStatus)
    : undefined;

  const isChief = accessLevel === "village";

  const disputes = await prisma.dispute.findMany({
    where: {
      villageId,
      ...(accessLevel === "own" ? { raisedByUserId: user.id } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      description: true,
      createdAt: true,
      raisedBy: {
        select: {
          name: true,
        },
      },
      payment: {
        select: {
          amount: true,
          fund: {
            select: {
              name: true,
            },
          },
          house: {
            select: {
              houseNumber: true,
            },
          },
        },
      },
    },
  });

  const filters = [
    {
      label: "All",
      href: "/village/disputes",
      active: !statusFilter,
    },
    {
      label: "Open",
      href: "/village/disputes?status=OPEN",
      active: statusFilter === DisputeStatus.OPEN,
    },
    {
      label: "Under Review",
      href: "/village/disputes?status=UNDER_REVIEW",
      active: statusFilter === DisputeStatus.UNDER_REVIEW,
    },
    {
      label: "Resolved",
      href: "/village/disputes?status=RESOLVED",
      active: statusFilter === DisputeStatus.RESOLVED,
    },
    {
      label: "Rejected",
      href: "/village/disputes?status=REJECTED",
      active: statusFilter === DisputeStatus.REJECTED,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ...your existing UI... */}

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.href}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              f.active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <DisputeList disputes={disputes} showRaiser={isChief} />
    </div>
  );
}
