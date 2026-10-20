import "server-only";
import {
  DisputeStatus,
  FundStatus,
  MembershipStatus,
  PaymentMethod,
  PaymentStatus,
  UserRole,
} from "@prisma/client";
import { getCurrentPeriod } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth/auth.types";

export interface ChiefNotificationSummary {
  disputesNeedingAction: number;
  hasActiveCollector: boolean;
  hasActiveFund: boolean;
  /** Pending villagers in houses that have no Head of House yet (Chief decides). */
  pendingHeadlessMembers: number;
  /** Number of houses those pending members belong to. */
  headlessHouseCount: number;
  /** Set only when exactly one house is involved, so the Chief can open it directly. */
  singleHeadlessHouseId: string | null;
}

export interface CollectorNotificationSummary {
  pendingKpay: number;
}

export interface VillagerNotificationSummary {
  rejectedPayments: number;
}

export interface HeadOfHouseNotificationSummary {
  pendingMembers: number;
}

export interface NotificationSummary {
  chief: ChiefNotificationSummary | null;
  collector: CollectorNotificationSummary | null;
  villager: VillagerNotificationSummary | null;
  headOfHouse: HeadOfHouseNotificationSummary | null;
}

export const EMPTY_NOTIFICATION_SUMMARY: NotificationSummary = {
  chief: null,
  collector: null,
  villager: null,
  headOfHouse: null,
};

/**
 * Computes actionable notification counts from live database state.
 *
 * NOTE: This is the single integration point for a future `Notification`
 * table. When stored notifications are introduced, replace the query bodies
 * here without changing the `NotificationSummary` contract or consumers.
 */
export async function computeNotificationSummary(params: {
  user: SessionUser;
  villageId: string;
  isActiveCollector: boolean;
  isHeadOfHouse: boolean;
}): Promise<NotificationSummary> {
  const { user, villageId, isActiveCollector, isHeadOfHouse } = params;

  const activeMembership = user.membershipStatus === MembershipStatus.ACTIVE;
  const isChief = user.role === UserRole.CHIEF && activeMembership;
  const isActiveVillager = user.role === UserRole.VILLAGER && activeMembership;

  const chiefPromise: Promise<ChiefNotificationSummary | null> = isChief
    ? (async () => {
        const { year, month } = getCurrentPeriod();
        const [
          disputesNeedingAction,
          activeCollector,
          activeFund,
          headlessGroups,
        ] = await Promise.all([
          prisma.dispute.count({
            where: {
              villageId,
              status: {
                in: [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW],
              },
            },
          }),
          prisma.collectorAssignment.findFirst({
            where: { villageId, year, month, isActive: true },
            select: { id: true },
          }),
          prisma.fund.findFirst({
            where: { villageId, status: FundStatus.ACTIVE },
            select: { id: true },
          }),
          // Pending villagers whose house has no head: only the Chief can
          // decide on these. Pending members of a house that has a head are
          // handled by that head and are not counted here.
          prisma.user.groupBy({
            by: ["houseId"],
            where: {
              villageId,
              role: UserRole.VILLAGER,
              membershipStatus: MembershipStatus.PENDING,
              house: { is: { headOfHouseId: null } },
            },
            _count: { _all: true },
          }),
        ]);

        const pendingHeadlessMembers = headlessGroups.reduce(
          (sum, group) => sum + group._count._all,
          0,
        );
        const headlessHouseCount = headlessGroups.length;

        return {
          disputesNeedingAction,
          hasActiveCollector: Boolean(activeCollector),
          hasActiveFund: Boolean(activeFund),
          pendingHeadlessMembers,
          headlessHouseCount,
          singleHeadlessHouseId:
            headlessHouseCount === 1 ? headlessGroups[0].houseId : null,
        };
      })()
    : Promise.resolve(null);

  const collectorPromise: Promise<CollectorNotificationSummary | null> =
    isActiveCollector
      ? prisma.payment
          .count({
            where: {
              villageId,
              status: PaymentStatus.PENDING,
              paymentMethod: PaymentMethod.KPAY,
            },
          })
          .then((pendingKpay) => ({ pendingKpay }))
      : Promise.resolve(null);

  const villagerPromise: Promise<VillagerNotificationSummary | null> =
    isActiveVillager
      ? prisma.payment
          .count({
            where: {
              villageId,
              payerUserId: user.id,
              status: PaymentStatus.REJECTED,
            },
          })
          .then((rejectedPayments) => ({ rejectedPayments }))
      : Promise.resolve(null);

  const headOfHousePromise: Promise<HeadOfHouseNotificationSummary | null> =
    isHeadOfHouse && user.houseId
      ? prisma.user
          .count({
            where: {
              houseId: user.houseId,
              membershipStatus: MembershipStatus.PENDING,
            },
          })
          .then((pendingMembers) => ({ pendingMembers }))
      : Promise.resolve(null);

  const [chief, collector, villager, headOfHouse] = await Promise.all([
    chiefPromise,
    collectorPromise,
    villagerPromise,
    headOfHousePromise,
  ]);

  return { chief, collector, villager, headOfHouse };
}
