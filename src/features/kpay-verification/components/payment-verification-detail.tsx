"use client";

import type { ReactNode } from "react";
import type { PaymentStatus } from "@prisma/client";
import { Alert, type AlertTone } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useTranslation } from "@/lib/i18n/provider";
import { cn, formatAmount, formatYangonDateTime } from "@/lib/utils";
import { AcceptPaymentForm } from "./accept-payment-form";
import { RejectPaymentForm } from "./reject-payment-form";
import { fill } from "./template";
import {
  VerificationStatusBadge,
  getStatusMeta,
} from "./verification-status-badge";

export interface PaymentVerificationData {
  id: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  kpayTransactionId: string | null;
  kpaySenderName: string | null;
  kpaySenderAccount: string | null;
  kpayReceiverAccount: string | null;
  rejectionNote: string | null;
  createdAt: Date;
  fund: {
    name: string;
    targetAmount: number;
  };
  house: {
    houseNumber: string;
  };
  payer: {
    name: string;
  };
}

function DetailRow({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-sm font-medium",
          mono ? "break-all font-mono" : "break-words",
        )}
      >
        {children}
      </dd>
    </div>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-3">
        <CardTitle as="h2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">{children}</dl>
      </CardContent>
    </Card>
  );
}

const DONE_TONE: Record<string, AlertTone> = {
  ACCEPTED: "success",
  REJECTED: "danger",
};

export function PaymentVerificationDetail({
  payment,
}: {
  payment: PaymentVerificationData;
}) {
  const { t } = useTranslation();
  const isPending = payment.status === "PENDING";
  const statusMeta = getStatusMeta(payment.status);
  const statusLabel = statusMeta ? t(statusMeta.labelKey) : payment.status;

  const missing = (
    <span className="font-normal text-muted-foreground">
      {t("kpayVerify.txn.notProvided")}
    </span>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/village/verify-kpay"
        backLabel={t("kpayVerify.detail.back")}
        description={t("kpayVerify.detail.description")}
        meta={<VerificationStatusBadge status={payment.status} />}
        title={t("kpayVerify.detail.title")}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardContent className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("kpayVerify.amount")}
              </p>
              <p className="text-3xl font-semibold tabular-nums tracking-tight">
                {formatAmount(payment.amount)}
              </p>
              <p className="break-words text-sm text-muted-foreground">
                {payment.payer.name} ·{" "}
                {fill(t("kpayVerify.queue.house"), {
                  number: payment.house.houseNumber,
                })}{" "}
                · {payment.fund.name}
              </p>
            </CardContent>
          </Card>

          {isPending ? (
            <Alert title={t("kpayVerify.check.title")} tone="info">
              {t("kpayVerify.check.body")}
            </Alert>
          ) : null}

          <DetailCard title={t("kpayVerify.txn.title")}>
            <DetailRow label={t("kpayVerify.txn.id")} mono>
              {payment.kpayTransactionId ?? missing}
            </DetailRow>
            <DetailRow label={t("kpayVerify.txn.senderName")}>
              {payment.kpaySenderName ?? missing}
            </DetailRow>
            <DetailRow label={t("kpayVerify.txn.senderAccount")}>
              {payment.kpaySenderAccount ?? missing}
            </DetailRow>
            <DetailRow label={t("kpayVerify.txn.receiverAccount")}>
              {payment.kpayReceiverAccount ?? missing}
            </DetailRow>
          </DetailCard>

          <DetailCard title={t("kpayVerify.info.title")}>
            <DetailRow label={t("kpayVerify.info.fund")}>
              {payment.fund.name}
            </DetailRow>
            <DetailRow label={t("kpayVerify.info.fundTarget")}>
              <span className="tabular-nums">
                {formatAmount(payment.fund.targetAmount)}
              </span>
            </DetailRow>
            <DetailRow label={t("kpayVerify.info.house")}>
              {payment.house.houseNumber}
            </DetailRow>
            <DetailRow label={t("kpayVerify.info.payer")}>
              {payment.payer.name}
            </DetailRow>
            <DetailRow label={t("kpayVerify.info.method")}>
              <Badge variant="neutral">{t("dashboard.method.kpay")}</Badge>
            </DetailRow>
            <DetailRow label={t("kpayVerify.info.submitted")}>
              {formatYangonDateTime(payment.createdAt)}
            </DetailRow>
            <DetailRow label={t("kpayVerify.info.status")}>
              <VerificationStatusBadge status={payment.status} />
            </DetailRow>
          </DetailCard>
        </div>

        <aside
          aria-labelledby="verify-decision-heading"
          className="min-w-0 space-y-4 lg:sticky lg:top-4"
        >
          <h2 className="sr-only" id="verify-decision-heading">
            {t("kpayVerify.actions.title")}
          </h2>

          {isPending ? (
            <>
              <Card className="border-success-border bg-success-soft/50">
                <CardHeader className="pb-3 sm:pb-3">
                  <CardTitle as="h3" className="text-success-strong">
                    {t("kpayVerify.accept.title")}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("kpayVerify.accept.body")}
                  </p>
                </CardHeader>
                <CardContent>
                  <AcceptPaymentForm paymentId={payment.id} />
                </CardContent>
              </Card>

              <Card className="border-danger-border">
                <CardHeader className="pb-3 sm:pb-3">
                  <CardTitle as="h3" className="text-danger-strong">
                    {t("kpayVerify.reject.title")}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("kpayVerify.reject.body")}
                  </p>
                </CardHeader>
                <CardContent>
                  <RejectPaymentForm paymentId={payment.id} />
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert
              title={t("kpayVerify.done.title")}
              tone={DONE_TONE[payment.status] ?? "info"}
            >
              <p>{fill(t("kpayVerify.done.body"), { status: statusLabel })}</p>
              {payment.status === "REJECTED" && payment.rejectionNote ? (
                <p className="mt-2 break-words">
                  <span className="font-semibold">
                    {t("kpayVerify.done.rejectionReason")}:
                  </span>{" "}
                  {payment.rejectionNote}
                </p>
              ) : null}
            </Alert>
          )}
        </aside>
      </div>
    </div>
  );
}
