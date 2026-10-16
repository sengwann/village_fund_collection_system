"use client";

import type { PaymentStatus } from "@prisma/client";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { TranslationKey } from "@/lib/i18n/en";
import { useTranslation } from "@/lib/i18n/provider";

const STATUS: Record<
  PaymentStatus,
  { variant: BadgeVariant; label: TranslationKey }
> = {
  PENDING: { variant: "warning", label: "kpayPay.status.pending" },
  ACCEPTED: { variant: "success", label: "kpayPay.status.accepted" },
  REJECTED: { variant: "danger", label: "kpayPay.status.rejected" },
  VOIDED: { variant: "neutral", label: "kpayPay.status.voided" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useTranslation();
  const { variant, label } = STATUS[status];

  return (
    <Badge className="shrink-0" dot variant={variant}>
      {t(label)}
    </Badge>
  );
}
