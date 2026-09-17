import Link from "next/link";
import { FundStatus, PaymentStatus } from "@prisma/client";
import { EmptyState } from "../../../../components/ui/empty-state";
import { FundStatusBadge } from "../../../../features/fund-management/components/fund-status-badge";
import { requireChief } from "../../../../lib/authz";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Funds | Village Fund Collection System",
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

function getStatusFilter(
  rawStatus: string | string[] | undefined,
): FundStatus | undefined {
  const value = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;

  if (
    value === FundStatus.DRAFT ||
    value === FundStatus.ACTIVE ||
    value === FundStatus.CLOSED
  ) {
    return value;
  }

  return undefined;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en").format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export default async function FundsPage({
  searchParams,
}: {
  searchParams?: unknown;
}) {
  const { villageId } = await requireChief();
  const params = await resolveSearchParams(searchParams);
  const statusFilter = getStatusFilter(params.status);

  const funds = await prisma.fund.findMany({
    where: {
      villageId,
      ...(statusFilter ? { status: statusFilter } : undefined),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      targetAmount: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });

  const acceptedTotals = await prisma.payment.groupBy({
    by: ["fundId"],
    where: {
      villageId,
      status: PaymentStatus.ACCEPTED,
    },
    _sum: {
      amount: true,
    },
  });

  const collectedByFund = new Map<string, number>();

  for (const row of acceptedTotals) {
    collectedByFund.set(row.fundId, row._sum.amount ?? 0);
  }

  const filters = [
    {
      label: "All",
      href: "/village/funds",
      isActive: !statusFilter,
    },
    {
      label: "Draft",
      href: `/village/funds?status=${FundStatus.DRAFT}`,
      isActive: statusFilter === FundStatus.DRAFT,
    },
    {
      label: "Active",
      href: `/village/funds?status=${FundStatus.ACTIVE}`,
      isActive: statusFilter === FundStatus.ACTIVE,
    },
    {
      label: "Closed",
      href: `/village/funds?status=${FundStatus.CLOSED}`,
      isActive: statusFilter === FundStatus.CLOSED,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Funds</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage village funds and fund lifecycle.
            </p>
          </div>
          <Link
            className="rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-700"
            href="/village/funds/new"
          >
            Create fund
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filter.isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
            href={filter.href}
            key={filter.label}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {funds.length === 0 ? (
        <EmptyState
          description="No funds match this filter yet."
          title="No funds found"
          action={
            !statusFilter ? (
              <Link
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                href="/village/funds/new"
              >
                Create first fund
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {funds.map((fund) => {
            const collected = collectedByFund.get(fund.id) ?? 0;

            return (
              <Link
                className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
                href={`/village/funds/${fund.id}`}
                key={fund.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {fund.name}
                    </p>
                    <p className="truncate text-xs text-slate-600">
                      {formatDate(fund.startDate)} to {formatDate(fund.endDate)}
                    </p>
                  </div>
                  <FundStatusBadge status={fund.status} />
                </div>

                <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                  <p>Target: {formatAmount(fund.targetAmount)}</p>
                  <p>Collected: {formatAmount(collected)}</p>
                  <p>Status: {fund.status}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
