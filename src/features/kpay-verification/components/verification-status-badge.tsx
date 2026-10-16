"use client";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { TranslationKey } from "@/lib/i18n/en";
import { useTranslation } from "@/lib/i18n/provider";

interface StatusMeta {
  variant: BadgeVariant;
  labelKey: TranslationKey;
}

const STATUS_META: Record<string, StatusMeta> = {
  PENDING: { variant: "warning", labelKey: "kpayPay.status.pending" },
  ACCEPTED: { variant: "success", labelKey: "kpayPay.status.accepted" },
  REJECTED: { variant: "danger", labelKey: "kpayPay.status.rejected" },
  VOIDED: { variant: "neutral", labelKey: "kpayPay.status.voided" },
};

export function getStatusMeta(status: string): StatusMeta | null {
  return STATUS_META[status] ?? null;
}

export function VerificationStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const meta = getStatusMeta(status);

  return (
    <Badge dot variant={meta?.variant ?? "neutral"}>
      {meta ? t(meta.labelKey) : status}
    </Badge>
  );
}
