import Link from "next/link";
import {
  FundStatus,
  MembershipStatus,
  PaymentMethod,
  PaymentStatus,
  UserRole,
} from "@prisma/client";
import { ChiefContactCard } from "../../../../features/shell/components/chief-contact-card";
import { EmptyState } from "../../../../components/ui/empty-state";
import { PaymentStatusSearchSection } from "../../../../features/fund-management/components/payment-status-search";
import { getVillageShellContext } from "../../../../features/shell/lib/shell-context";
import {
  getCurrentPeriod,
  hasActiveMembership,
  isChief,
  isVillager,
} from "../../../../lib/authz";
import { NeedsAttentionCard } from "../../../../features/shell/components/needs-attention-card";
import { prisma } from "../../../../lib/prisma";
import { formatYangonDateTime, formatAmount } from "@/lib/utils";
import { getChiefDemographicData } from "@/features/analytics/lib/chief-analytics";
import { getCollectorChartData } from "@/features/analytics/lib/collector-analytics";
import { AgeGroupChart } from "@/features/analytics/components/age-group-chart";
import { CollectionTrendChart } from "@/features/analytics/components/collection-trend-chart";
import { PaidVsPendingChart } from "@/features/analytics/components/paid-vs-pending-chart";

export const metadata = {
  title: "Village Dashboard | Village Fund Collection System",
};

export default async function VillageDashboardPage() {
  const { context, collectorContext, isHeadOfHouse, notifications } =
    await getVillageShellContext();
  const user = context.user;
  const villageId = context.villageId;
  const chief = isChief(user);
  const villager = isVillager(user);
  const activeMembership = hasActiveMembership(user);
  const collector = Boolean(collectorContext);
  const pendingMembership = user.membershipStatus === MembershipStatus.PENDING;

  // ── Pending membership: limited view ──────────────────────────
  if (pendingMembership) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Village dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">Welcome to the village.</p>
        </div>
        <EmptyState
          description="Your membership is waiting for Head of House approval. Financial and household features will become available after approval."
          title="Awaiting household approval"
        />
      </div>
    );
  }

  // ── Current active fund (shared across roles) ─────────────────
  const currentFund = await prisma.fund.findFirst({
    where: { villageId, status: FundStatus.ACTIVE },
    select: {
      id: true,
      name: true,
      targetAmount: true,
      startDate: true,
      endDate: true,
    },
  });

  // Village Chief contact — scoped to the session user's village.
  const chiefContact = await prisma.user.findFirst({
    where: {
      villageId,
      role: UserRole.CHIEF,
    },
    select: {
      name: true,
      phone: true,
    },
  });

  // ── Chief data ────────────────────────────────────────────────
  let chiefData: {
    totalHouses: number;
    totalMembers: number;
    pendingPayments: number;
    openDisputes: number;
    totalCollected: number;
    currentCollectorName: string | null;
  } | null = null;

  if (chief && activeMembership) {
    const currentPeriod = getCurrentPeriod();

    const [
      totalHouses,
      totalMembers,
      pendingPayments,
      openDisputes,
      currentCollector,
    ] = await Promise.all([
      prisma.house.count({ where: { villageId, isActive: true } }),
      prisma.user.count({
        where: { villageId, membershipStatus: MembershipStatus.ACTIVE },
      }),
      prisma.payment.count({
        where: { villageId, status: PaymentStatus.PENDING },
      }),
      prisma.dispute.count({
        where: { villageId, status: "OPEN" },
      }),
      prisma.collectorAssignment.findFirst({
        where: {
          villageId,
          year: currentPeriod.year,
          month: currentPeriod.month,
          isActive: true,
        },
        select: { user: { select: { name: true } } },
      }),
    ]);

    let totalCollected = 0;
    if (currentFund) {
      const result = await prisma.payment.aggregate({
        where: {
          villageId,
          fundId: currentFund.id,
          status: PaymentStatus.ACCEPTED,
        },
        _sum: { amount: true },
      });
      totalCollected = result._sum.amount ?? 0;
    }

    chiefData = {
      totalHouses,
      totalMembers,
      pendingPayments,
      openDisputes,
      totalCollected,
      currentCollectorName: currentCollector?.user.name ?? null,
    };
  }
  let chiefDemographics: {
    ageGroups: { group: string; count: number }[];
    totalMembers: number;
  } | null = null;
  if (chief && activeMembership) {
    chiefDemographics = await getChiefDemographicData(villageId);
  }
  // ── Collector data ────────────────────────────────────────────
  let collectorData: {
    pendingKpay: number;
    acceptedCount: number;
    rejectedCount: number;
    cashCount: number;
  } | null = null;

  if (collector && collectorContext) {
    const [pendingKpay, acceptedCount, rejectedCount, cashCount] =
      await Promise.all([
        prisma.payment.count({
          where: {
            villageId,
            status: PaymentStatus.PENDING,
            paymentMethod: PaymentMethod.KPAY,
          },
        }),
        prisma.payment.count({
          where: {
            villageId,
            status: PaymentStatus.ACCEPTED,
            collectorUserId: user.id,
          },
        }),
        prisma.payment.count({
          where: {
            villageId,
            status: PaymentStatus.REJECTED,
            collectorUserId: user.id,
          },
        }),
        prisma.payment.count({
          where: {
            villageId,
            status: PaymentStatus.ACCEPTED,
            paymentMethod: PaymentMethod.CASH,
            collectorUserId: user.id,
          },
        }),
      ]);

    collectorData = { pendingKpay, acceptedCount, rejectedCount, cashCount };
  }

  let collectorChartData: Awaited<
    ReturnType<typeof getCollectorChartData>
  > | null = null;
  if (collector && collectorContext) {
    collectorChartData = await getCollectorChartData(villageId, user.id);
  }

  // ── Villager data ─────────────────────────────────────────────
  let villagerData: {
    paymentStatus: PaymentStatus | null;
    recentPayments: {
      id: string;
      amount: number;
      status: PaymentStatus;
      paymentMethod: string;
      createdAt: Date;
    }[];
    receiptsCount: number;
    rejectedCount: number;
  } | null = null;

  if (villager && activeMembership) {
    let paymentStatus: PaymentStatus | null = null;
    if (currentFund && user.houseId) {
      const myPayment = await prisma.payment.findFirst({
        where: {
          villageId,
          fundId: currentFund.id,
          houseId: user.houseId,
          status: { in: [PaymentStatus.ACCEPTED, PaymentStatus.PENDING] },
        },
        select: { status: true },
      });
      paymentStatus = myPayment?.status ?? null;
    }

    const [recentPayments, receiptsCount, rejectedCount] = await Promise.all([
      prisma.payment.findMany({
        where: { payerUserId: user.id, villageId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          amount: true,
          status: true,
          paymentMethod: true,
          createdAt: true,
        },
      }),
      prisma.receipt.count({
        where: { villageId, payment: { payerUserId: user.id } },
      }),
      prisma.payment.count({
        where: {
          payerUserId: user.id,
          villageId,
          status: PaymentStatus.REJECTED,
        },
      }),
    ]);

    villagerData = {
      paymentStatus,
      recentPayments,
      receiptsCount,
      rejectedCount,
    };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          Village dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back, {user.name}.
        </p>
      </div>

      {/* Village Chief contact — visible to all village members */}
      <ChiefContactCard
        chiefName={chiefContact?.name ?? null}
        chiefPhone={chiefContact?.phone ?? null}
      />

      {/* ── Payment Status Search (Active fund ရှိပါက ဖော်ပြပေးမည်) ── */}
      {currentFund && (chief || collector) ? (
        <PaymentStatusSearchSection fundId={currentFund.id} />
      ) : null}

      {/* ── Chief section ─────────────────────────────────────── */}
      {chief && chiefData ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">Total Houses</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {chiefData.totalHouses}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">
                Active Members
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {chiefData.totalMembers}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">
                Pending Payments
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-600">
                {chiefData.pendingPayments}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">
                Open Disputes
              </p>
              <p className="mt-2 text-2xl font-semibold text-red-600">
                {chiefData.openDisputes}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-600">
                Current Collector
              </p>
              <p className="mt-2 truncate text-lg font-semibold text-slate-900">
                {chiefData.currentCollectorName ?? "Unassigned"}
              </p>
            </div>
          </div>

          {currentFund ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-slate-900">
                  Current Fund
                </h2>
                <Link
                  className="text-xs font-medium text-slate-600 transition hover:text-slate-900"
                  href={`/village/funds/${currentFund.id}`}
                >
                  View detail
                </Link>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Fund name</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {currentFund.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {formatYangonDateTime(currentFund.startDate, "date")} to{" "}
                    {formatYangonDateTime(currentFund.endDate, "date")}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Target / house</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {formatAmount(currentFund.targetAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Collected</p>
                    <p className="mt-1 text-sm font-medium text-emerald-600">
                      {formatAmount(chiefData.totalCollected)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              description="No active fund. Create and activate a fund to start collecting."
              title="No active fund"
            />
          )}
        </>
      ) : null}

      <NeedsAttentionCard
        isActiveCollector={collector}
        isActiveVillager={villager && activeMembership}
        isChief={chief}
        isHeadOfHouse={isHeadOfHouse}
        notifications={notifications}
      />

      {/* Chief Demographics Chart */}
      {chief && chiefDemographics ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-900">
            Village Demographics
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Age distribution of active members. Members without date of birth
            are shown as &quot;Not set&quot;.
          </p>
          <div className="mt-4">
            <AgeGroupChart data={chiefDemographics.ageGroups} />
          </div>
        </div>
      ) : null}

      {/* ── Collector section ─────────────────────────────────── */}
      {collector && collectorContext && collectorData ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-900">
            Collector Overview
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Period: {collectorContext.assignment.year}-
            {String(collectorContext.assignment.month).padStart(2, "0")}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Pending KPay</p>
              <p className="mt-1 text-lg font-semibold text-amber-600">
                {collectorData.pendingKpay}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Accepted</p>
              <p className="mt-1 text-lg font-semibold text-emerald-600">
                {collectorData.acceptedCount}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Rejected</p>
              <p className="mt-1 text-lg font-semibold text-red-600">
                {collectorData.rejectedCount}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Cash Recorded</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {collectorData.cashCount}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              className="rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-700"
              href="/village/verify-kpay"
            >
              Verify KPay
            </Link>
            <Link
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              href="/village/cash"
            >
              Record Cash
            </Link>
          </div>
        </div>
      ) : null}

      {/* Collector Collection Charts */}
      {collector && collectorChartData ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium text-slate-900">
              Collection Over Time
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Monthly accepted collection amounts.
            </p>
            <div className="mt-4">
              <CollectionTrendChart
                data={collectorChartData.collectionOverTime}
              />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium text-slate-900">
              Paid vs Pending
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Your accepted payments vs village-wide pending payments.
            </p>
            <div className="mt-4">
              <PaidVsPendingChart data={collectorChartData.paidVsPending} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Collector Summary Cards */}
      {collector && collectorChartData ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Total Collected</p>
            <p className="mt-1 text-lg font-semibold text-emerald-600">
              {new Intl.NumberFormat("en").format(
                collectorChartData.summary.totalCollected,
              )}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Pending Amount</p>
            <p className="mt-1 text-lg font-semibold text-amber-600">
              {new Intl.NumberFormat("en").format(
                collectorChartData.summary.totalPendingAmount,
              )}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Completed Collections</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {collectorChartData.summary.acceptedCount}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Pending Collections</p>
            <p className="mt-1 text-lg font-semibold text-amber-600">
              {collectorChartData.summary.pendingCount}
            </p>
          </div>
        </div>
      ) : null}

      {/* ── Villager section ──────────────────────────────────── */}
      {villager && activeMembership && villagerData ? (
        <>
          {currentFund ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-medium text-slate-900">
                Current Fund
              </h2>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">Fund</span>
                  <span className="text-sm font-medium text-slate-900">
                    {currentFund.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">Target amount</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatAmount(currentFund.targetAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">Period</span>
                  <span className="text-sm text-slate-900">
                    {formatYangonDateTime(currentFund.startDate, "date")} –{" "}
                    {formatYangonDateTime(currentFund.endDate, "date")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">Payment status</span>
                  {villagerData.paymentStatus ? (
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${
                        villagerData.paymentStatus === PaymentStatus.ACCEPTED
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {villagerData.paymentStatus}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      Not paid
                    </span>
                  )}
                </div>
              </div>
              {!villagerData.paymentStatus ? (
                <Link
                  className="mt-4 block w-full rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-700"
                  href="/village/pay"
                >
                  Pay now
                </Link>
              ) : null}
            </div>
          ) : (
            <EmptyState
              description="No active fund in your village right now."
              title="No active fund"
            />
          )}

          {/* Recent payments */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-slate-900">
                Recent payments
              </h2>
              <Link
                className="text-xs font-medium text-slate-600 transition hover:text-slate-900"
                href="/village/receipts"
              >
                View receipts ({villagerData.receiptsCount})
              </Link>
            </div>
            {villagerData.recentPayments.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No payments submitted yet.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {villagerData.recentPayments.map((payment) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
                    key={payment.id}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {formatAmount(payment.amount)}
                      </p>
                      <p className="text-xs text-slate-600">
                        {payment.paymentMethod} ·{" "}
                        {formatYangonDateTime(payment.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex rounded-full border px-2 py-1 text-xs font-medium ${
                        payment.status === PaymentStatus.ACCEPTED
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : payment.status === PaymentStatus.PENDING
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : payment.status === PaymentStatus.REJECTED
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rejected payments alert */}
          {villagerData.rejectedCount > 0 ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
              <p className="text-sm text-red-900">
                You have{" "}
                <span className="font-semibold">
                  {villagerData.rejectedCount}
                </span>{" "}
                rejected payment{villagerData.rejectedCount === 1 ? "" : "s"}.
                You can resubmit or raise a dispute.
              </p>
              <Link
                className="mt-2 inline-block text-xs font-medium text-red-700 underline underline-offset-2"
                href="/village/pay"
              >
                View payment history
              </Link>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
