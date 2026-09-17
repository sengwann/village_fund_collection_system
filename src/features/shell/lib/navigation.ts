import { LanguagePreference, MembershipStatus, UserRole } from "@prisma/client";
import type { SessionUser } from "../../../lib/auth/auth.types";
import type { NotificationSummary } from "../../notifications/lib/notification-service";
import { getT } from "../../../lib/i18n/translations";

export type NavIconName =
  | "home"
  | "landmark"
  | "scroll-text"
  | "building"
  | "users"
  | "user-cog"
  | "wallet"
  | "credit-card"
  | "receipt"
  | "shield-check"
  | "banknote";

export type NavBadgeVariant = "default" | "alert";

export interface NavItem {
  label: string;
  href?: string;
  iconName: NavIconName;
  disabled?: boolean;
  badge?: string;
  badgeVariant?: NavBadgeVariant;
}

export interface ShellNavigation {
  sidebarItems: NavItem[];
  mobileItems: NavItem[];
}

function formatBadgeCount(count: number): string {
  if (count > 99) {
    return "99+";
  }
  return String(count);
}

export function buildPlatformNavigation(
  language: LanguagePreference,
): ShellNavigation {
  const t = getT(language);

  const dashboard: NavItem = {
    label: t("nav.dashboard"),
    href: "/admin/dashboard",
    iconName: "home",
  };
  const villages: NavItem = {
    label: t("nav.villages"),
    href: "/admin/villages",
    iconName: "landmark",
  };
  const platformAudit: NavItem = {
    label: t("nav.platformAudit"),
    href: "/admin/audit",
    iconName: "scroll-text",
  };

  return {
    sidebarItems: [dashboard, villages, platformAudit],
    mobileItems: [dashboard, villages, platformAudit],
  };
}

export function buildVillageNavigation(params: {
  user: SessionUser;
  isActiveCollector: boolean;
  isHeadOfHouse: boolean;
  notifications?: NotificationSummary;
  language: LanguagePreference;
}): ShellNavigation {
  const { user, isActiveCollector, isHeadOfHouse, notifications, language } =
    params;
  const t = getT(language);
  const activeMembership = user.membershipStatus === MembershipStatus.ACTIVE;
  const isChief = user.role === UserRole.CHIEF;

  const chiefSummary = notifications?.chief ?? null;
  const disputeCount =
    isChief && chiefSummary ? chiefSummary.disputesNeedingAction : 0;
  const pendingKpay =
    isActiveCollector && notifications?.collector
      ? notifications.collector.pendingKpay
      : 0;
  const rejectedPayments =
    activeMembership && notifications?.villager
      ? notifications.villager.rejectedPayments
      : 0;
  const pendingMembers =
    isHeadOfHouse && notifications?.headOfHouse
      ? notifications.headOfHouse.pendingMembers
      : 0;

  const dashboard: NavItem = {
    label: t("nav.dashboard"),
    href: "/village/dashboard",
    iconName: "home",
  };
  const sidebarItems: NavItem[] = [dashboard];
  const mobileItems: NavItem[] = [dashboard];

  const houses: NavItem = {
    label: t("nav.houses"),
    href: "/village/houses",
    iconName: "building",
  };
  const members: NavItem = {
    label: t("nav.members"),
    href: "/village/household",
    iconName: "users",
    badge: pendingMembers > 0 ? formatBadgeCount(pendingMembers) : undefined,
    badgeVariant: pendingMembers > 0 ? "alert" : undefined,
  };
  const collectors: NavItem = {
    label: t("nav.collectors"),
    href: "/village/collectors",
    iconName: "user-cog",
  };
  const funds: NavItem = {
    label: t("nav.funds"),
    href: "/village/funds",
    iconName: "wallet",
  };
  const pay: NavItem = activeMembership
    ? {
        label: t("nav.pay"),
        href: "/village/pay",
        iconName: "credit-card",
        badge:
          rejectedPayments > 0 ? formatBadgeCount(rejectedPayments) : undefined,
        badgeVariant: rejectedPayments > 0 ? "alert" : undefined,
      }
    : {
        label: t("nav.pay"),
        iconName: "credit-card",
        disabled: true,
        badge: "Pending",
      };
  const receipts: NavItem = activeMembership
    ? {
        label: t("nav.receipts"),
        href: "/village/receipts",
        iconName: "receipt",
      }
    : {
        label: t("nav.receipts"),
        iconName: "receipt",
        disabled: true,
        badge: "Pending",
      };
  const verifyKpay: NavItem = isActiveCollector
    ? {
        label: t("nav.verifyKpay"),
        href: "/village/verify-kpay",
        iconName: "shield-check",
        badge: pendingKpay > 0 ? formatBadgeCount(pendingKpay) : undefined,
        badgeVariant: pendingKpay > 0 ? "alert" : undefined,
      }
    : {
        label: t("nav.verifyKpay"),
        iconName: "shield-check",
        disabled: true,
        badge: "Module 17",
      };
  const cash: NavItem = isActiveCollector
    ? { label: t("nav.cash"), href: "/village/cash", iconName: "banknote" }
    : {
        label: t("nav.cash"),
        iconName: "banknote",
        disabled: true,
        badge: "Module 18",
      };
  const disputes: NavItem = activeMembership
    ? {
        label: t("nav.disputes"),
        href: "/village/disputes",
        iconName: "shield-alert",
        badge: disputeCount > 0 ? formatBadgeCount(disputeCount) : undefined,
        badgeVariant: disputeCount > 0 ? "alert" : undefined,
      }
    : {
        label: t("nav.disputes"),
        iconName: "shield-alert",
        disabled: true,
        badge: "Pending",
      };
  const audit: NavItem = {
    label: t("nav.auditLog"),
    href: "/village/audit",
    iconName: "scroll-text",
  };

  if (user.role === UserRole.CHIEF) {
    sidebarItems.push(houses, collectors, funds, receipts, disputes, audit);
  }
  if (isHeadOfHouse) {
    sidebarItems.push(members);
  }
  if (user.role === UserRole.VILLAGER) {
    sidebarItems.push(pay, receipts, disputes);
  }
  if (isActiveCollector) {
    sidebarItems.push(verifyKpay, cash);
  }
  if (user.role === UserRole.CHIEF) {
    mobileItems.push(houses, funds, receipts, disputes);
    if (isHeadOfHouse) {
      mobileItems.push(members);
    } else {
      mobileItems.push(collectors);
    }
  } else if (user.role === UserRole.VILLAGER && activeMembership) {
    mobileItems.push(pay, receipts, disputes);
  }
  return {
    sidebarItems,
    mobileItems: mobileItems.slice(0, 5),
  };
}
