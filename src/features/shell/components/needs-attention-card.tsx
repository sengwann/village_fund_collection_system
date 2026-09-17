import Link from "next/link";
import { AlertTriangle, Bell } from "lucide-react";
import type { NotificationSummary } from "@/features/notifications/lib/notification-service";

type AttentionVariant = "count" | "warning";

interface AttentionItem {
  key: string;
  label: string;
  href: string;
  variant: AttentionVariant;
}

export function NeedsAttentionCard({
  notifications,
  isChief,
  isActiveCollector,
  isHeadOfHouse,
  isActiveVillager,
}: {
  notifications: NotificationSummary;
  isChief: boolean;
  isActiveCollector: boolean;
  isHeadOfHouse: boolean;
  isActiveVillager: boolean;
}) {
  const items: AttentionItem[] = [];

  if (isChief && notifications.chief) {
    const { disputesNeedingAction, hasActiveCollector, hasActiveFund } =
      notifications.chief;
    if (disputesNeedingAction > 0) {
      items.push({
        key: "disputes",
        label: `${disputesNeedingAction} dispute${
          disputesNeedingAction === 1 ? "" : "s"
        } awaiting review`,
        href: "/village/disputes",
        variant: "count",
      });
    }
    if (!hasActiveCollector) {
      items.push({
        key: "no-collector",
        label: "No active Collector assigned for the current period",
        href: "/village/collectors",
        variant: "warning",
      });
    }
    if (!hasActiveFund) {
      items.push({
        key: "no-fund",
        label: "No active Fund — payments cannot be collected",
        href: "/village/funds",
        variant: "warning",
      });
    }
  }

  if (
    isActiveCollector &&
    notifications.collector &&
    notifications.collector.pendingKpay > 0
  ) {
    const count = notifications.collector.pendingKpay;
    items.push({
      key: "pending-kpay",
      label: `${count} KPay payment${count === 1 ? "" : "s"} pending verification`,
      href: "/village/verify-kpay",
      variant: "count",
    });
  }

  if (
    isActiveVillager &&
    notifications.villager &&
    notifications.villager.rejectedPayments > 0
  ) {
    const count = notifications.villager.rejectedPayments;
    items.push({
      key: "rejected-payments",
      label: `${count} rejected payment${count === 1 ? "" : "s"} — resubmit or dispute`,
      href: "/village/pay",
      variant: "count",
    });
  }

  if (
    isHeadOfHouse &&
    notifications.headOfHouse &&
    notifications.headOfHouse.pendingMembers > 0
  ) {
    const count = notifications.headOfHouse.pendingMembers;
    items.push({
      key: "pending-members",
      label: `${count} pending membership request${count === 1 ? "" : "s"}`,
      href: "/village/household",
      variant: "count",
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-800 dark:bg-amber-900/20">
      <div className="flex items-center gap-2">
        <Bell aria-hidden className="h-4 w-4 text-amber-700" />
        <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          Needs Attention
        </h2>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              className="flex items-center justify-between gap-3 rounded-md border border-amber-200 bg-white p-3 text-sm text-slate-800 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              href={item.href}
            >
              <span className="flex items-center gap-2">
                {item.variant === "warning" ? (
                  <AlertTriangle
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-amber-600"
                  />
                ) : null}
                {item.label}
              </span>
              <span className="shrink-0 text-xs font-medium text-amber-700">
                View →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
