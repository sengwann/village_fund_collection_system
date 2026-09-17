import Link from "next/link";
import { notFound } from "next/navigation";
import { FundStatus, PaymentStatus } from "@prisma/client";
import { EmptyState } from "../../../../../components/ui/empty-state";
import { FundLifecycleActions } from "../../../../../features/fund-management/components/fund-lifecycle-actions";
import { FundStatusBadge } from "../../../../../features/fund-management/components/fund-status-badge";
import { FundSummaryCard } from "../../../../../features/fund-management/components/fund-summary-card";
import { requireChief, requireSameVillage } from "../../../../../lib/authz";
import { prisma } from "../../../../../lib/prisma";

export const metadata = {
  title: "Fund Detail | Village Fund Collection System",
};

type RouteParams = Record<string, string | string[] | undefined>;
type SearchParams = Record<string, string | string[] | undefined>;

async function extractFundId(rawParams: unknown): Promise<string> {
  if (!rawParams) return "";
  let params: RouteParams;
  const maybePromise = rawParams as { then?: unknown };
  if (typeof maybePromise.then === "function") {
    params = await (rawParams as Promise<RouteParams>);
  } else {
    params = rawParams as RouteParams;
  }
  const fundId = params.fundId;
  if (Array.isArray(fundId)) return fundId[0] ?? "";
  return fundId ?? "";
}

async function resolveSearchParams(
  searchParams: unknown,
): Promise<SearchParams> {
  if (!searchParams) return {};
  const maybePromise = searchParams as { then?: unknown };
  if (typeof maybePromise.then === "function") {
    return await (searchParams as Promise<SearchParams>);
  }
  return searchParams as SearchParams;
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

export default async function FundDetailPage({
  params,
  searchParams,
}: {
  params: unknown;
  searchParams?: unknown;
}) {
  const context = await requireChief();
  const fundId = await extractFundId(params);
  if (!fundId) {
    notFound();
  }

  const fund = await prisma.fund.findUnique({
    where: { id: fundId },
    select: {
      id: true,
      villageId: true,
      name: true,
      description: true,
      targetAmount: true,
      startDate: true,
      endDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!fund) {
    notFound();
  }
  requireSameVillage(context, fund.villageId);

  const summary = await prisma.payment.aggregate({
    where: {
      fundId: fund.id,
      villageId: context.villageId,
      status: PaymentStatus.ACCEPTED,
    },
    _sum: { amount: true },
    _count: { id: true },
  });

  let hasOtherActiveFund = false;
  if (fund.status === FundStatus.DRAFT) {
    const activeFund = await prisma.fund.findFirst({
      where: { villageId: context.villageId, status: FundStatus.ACTIVE },
      select: { id: true },
    });
    hasOtherActiveFund = Boolean(activeFund && activeFund.id !== fund.id);
  }

  const collectedAmount = summary._sum.amount ?? 0;
  const acceptedCount = summary._count.id;

  // NEW: payment-status search
  const sp = await resolveSearchParams(searchParams);
  const rawQuery = typeof sp.q === "string" ? sp.q : "";
  const query = rawQuery.trim();

  let paymentStatusResults: {
    id: string;
    houseNumber: string;
    headName: string | null;
    paid: boolean;
  }[] = [];

  if (query) {
    const matchedHouses = await prisma.house.findMany({
      where: {
        villageId: context.villageId,
        OR: [
          { houseNumber: { contains: query, mode: "insensitive" } },
          { headOfHouse: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      orderBy: { houseNumber: "asc" },
      select: {
        id: true,
        houseNumber: true,
        headOfHouse: { select: { name: true } },
        payments: {
          where: { fundId: fund.id, status: PaymentStatus.ACCEPTED },
          select: { id: true },
          take: 1,
        },
      },
    });
    paymentStatusResults = matchedHouses.map((house) => ({
      id: house.id,
      houseNumber: house.houseNumber,
      headName: house.headOfHouse?.name ?? null,
      paid: house.payments.length > 0,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-900">
              {fund.name}
            </h1>
            <p className="truncate text-sm text-slate-600">
              Fund detail and lifecycle.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/village/funds"
          >
            Back to funds
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-900">
            Fund information
          </h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Status</dt>
              <dd>
                <FundStatusBadge status={fund.status} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Target amount</dt>
              <dd className="text-slate-900">
                {formatAmount(fund.targetAmount)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Start date</dt>
              <dd className="text-slate-900">{formatDate(fund.startDate)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">End date</dt>
              <dd className="text-slate-900">{formatDate(fund.endDate)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Created</dt>
              <dd className="text-slate-900">{formatDate(fund.createdAt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="font-medium text-slate-700">Updated</dt>
              <dd className="text-slate-900">{formatDate(fund.updatedAt)}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h3 className="text-sm font-medium text-slate-900">Description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
              {fund.description ?? "—"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FundSummaryCard
            acceptedCount={acceptedCount}
            collectedAmount={collectedAmount}
            targetAmount={fund.targetAmount}
          />
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium text-slate-900">
              Lifecycle actions
            </h2>
            <div className="mt-3">
              <FundLifecycleActions
                fundId={fund.id}
                hasOtherActiveFund={hasOtherActiveFund}
                status={fund.status}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
