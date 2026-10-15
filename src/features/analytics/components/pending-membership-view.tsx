"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "@/lib/i18n/provider";

export function PendingMembershipView() {
  const { t } = useTranslation();
  return (
    <EmptyState
      description={t("dashboard.pending.body")}
      title={t("dashboard.pending.title")}
    />
  );
}
