"use client";

import Link from "next/link";
import type { DisputeStatus, PaymentStatus } from "@prisma/client";
import { Alert } from "@/components/ui/alert";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { TranslationKey } from "@/lib/i18n/en";
import { useTranslation } from "@/lib/i18n/provider";
import { formatAmount, formatYangonDateTime } from "@/lib/utils";
import { fillMessage } from "../lib/fill-message";
import { PaymentStatusBadge } from "./payment-status-badge";

const DISPUTE_STYLES: Record<
  DisputeStatus,
  { variant: BadgeVariant; label: TranslationKey }
> = {
  OPEN: { variant: "warning", label: "kpayPay.disputeStatus.open" },
  UNDER_REVIEW: { variant: "info", label: "kpayPay.disputeStatus.underReview" },
  RESOLVED: { variant: "success", label: "kpayPay.disputeStatus.resolved" },
  REJECTED: { variant: "danger", label: "kpayPay.disputeStatus.rejected" },
};

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  rejectionNote: string | null;
  createdAt: Date;
  activeDispute: {
    id: string;
    status: DisputeStatus;
  } | null;
}

export function PaymentHistoryList({
  payments,
}: {
  payments: PaymentHistoryItem[];
}) {
  const { t } = useTranslation();

  if (payments.length === 0) {
    return (
      <EmptyState
        description={t("kpayPay.history.emptyBody")}
        title={t("kpayPay.history.emptyTitle")}
      />
    );
  }

  function methodLabel(method: string): string {
    if (method === "KPAY") return t("dashboard.method.kpay");
    if (method === "CASH") return t("dashboard.method.cash");
    return method;
  }

  return (
    <ul className="space-y-3">
      {payments.map((payment) => {
        const isRejected = payment.status === "REJECTED";
        const dispute = payment.activeDispute;

        return (
          <li key={payment.id}>
            <Card className="space-y-3 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-snug tabular-nums">
                    {formatAmount(payment.amount)}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {methodLabel(payment.paymentMethod)} ·{" "}
                    {formatYangonDateTime(payment.createdAt)}
                  </p>
                </div>
                <PaymentStatusBadge status={payment.status} />
              </div>

              {isRejected && payment.rejectionNote ? (
                <Alert
                  tone="danger"
                  title={t("kpayPay.history.rejectionReason")}
                >
                  {payment.rejectionNote}
                </Alert>
              ) : null}

              {isRejected && payment.paymentMethod === "KPAY" ? (
                dispute ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <Badge dot variant={DISPUTE_STYLES[dispute.status].variant}>
                      {fillMessage(t("kpayPay.history.disputeLabel"), {
                        status: t(DISPUTE_STYLES[dispute.status].label),
                      })}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {t("kpayPay.history.noAnotherDispute")}
                    </span>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="w-full sm:w-auto"
                    size="sm"
                    variant="outline"
                  >
                    <Link
                      href={`/village/disputes/new?paymentId=${payment.id}`}
                    >
                      {t("kpayPay.history.disputeAction")}
                    </Link>
                  </Button>
                )
              ) : null}
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
