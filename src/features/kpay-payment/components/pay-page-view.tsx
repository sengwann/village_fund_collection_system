"use client";

import type { PaymentStatus } from "@prisma/client";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/lib/i18n/provider";
import { cn, formatAmount } from "@/lib/utils";
import { fillMessage } from "../lib/fill-message";
import { CurrentFundCard } from "./current-fund-card";
import { KpayPaymentForm } from "./kpay-payment-form";
import {
  PaymentHistoryList,
  type PaymentHistoryItem,
} from "./payment-history-list";

/*
 * Presentation for /village/pay. page.tsx keeps all auth, queries and data
 * shaping and passes the already-loaded values in here.
 */

export function NoActiveFundView() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader description={t("kpayPay.description")} title={t("nav.pay")} />
      <EmptyState
        description={t("kpayPay.noFundBody")}
        title={t("kpayPay.noFundTitle")}
      />
    </div>
  );
}

export interface PayPageViewProps {
  fundName: string;
  totalAmount: number;
  amountPerHouse: number | null;
  numberOfHouse: number | null;
  collectedAmount: number;
  /** ACCEPTED or PENDING when this house already has a blocking payment. */
  blockingStatus: PaymentStatus | null;
  hasUnresolvedDispute: boolean;
  /** Minimum amount enforced by the server for this house. */
  minimumAmount: number;
  payments: PaymentHistoryItem[];
}

function HowToPay({ minimumAmount }: { minimumAmount: number }) {
  const { t } = useTranslation();

  const steps = [
    {
      key: "send",
      title: t("kpayPay.steps.send.title"),
      body: fillMessage(t("kpayPay.steps.send.body"), {
        amount: formatAmount(minimumAmount),
      }),
    },
    {
      key: "keep",
      title: t("kpayPay.steps.keep.title"),
      body: t("kpayPay.steps.keep.body"),
    },
    {
      key: "submit",
      title: t("kpayPay.steps.submit.title"),
      body: t("kpayPay.steps.submit.body"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">{t("kpayPay.steps.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li className="flex gap-3" key={step.key}>
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
              >
                {index + 1}
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export function PayPageView({
  fundName,
  totalAmount,
  amountPerHouse,
  numberOfHouse,
  collectedAmount,
  blockingStatus,
  hasUnresolvedDispute,
  minimumAmount,
  payments,
}: PayPageViewProps) {
  const { t } = useTranslation();

  // Same precedence as before: blocking payment, then open dispute, then form.
  const isBlocked = blockingStatus !== null || hasUnresolvedDispute;

  let rightColumn: React.ReactNode;
  if (blockingStatus !== null) {
    rightColumn =
      blockingStatus === "ACCEPTED" ? (
        <Alert tone="success" title={t("kpayPay.accepted.title")}>
          {t("kpayPay.accepted.body")}
        </Alert>
      ) : (
        <Alert tone="info" title={t("kpayPay.pending.title")}>
          {t("kpayPay.pending.body")}
        </Alert>
      );
  } else if (hasUnresolvedDispute) {
    rightColumn = (
      <Alert tone="warning" title={t("kpayPay.dispute.title")}>
        <p>{t("kpayPay.dispute.body")}</p>
        <p className="mt-2 text-xs">{t("kpayPay.dispute.note")}</p>
      </Alert>
    );
  } else {
    rightColumn = <KpayPaymentForm minimumAmount={minimumAmount} />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader description={t("kpayPay.description")} title={t("nav.pay")} />

      <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
        <div className="space-y-6 lg:col-span-2">
          <CurrentFundCard
            amountPerHouse={amountPerHouse}
            collectedAmount={collectedAmount}
            fundName={fundName}
            numberOfHouse={numberOfHouse}
            totalAmount={totalAmount}
          />
          {isBlocked ? null : <HowToPay minimumAmount={minimumAmount} />}
        </div>

        {/* On phones a status message comes before the fund card. */}
        <div
          className={cn(
            "lg:col-span-3",
            isBlocked && "order-first lg:order-none",
          )}
        >
          {rightColumn}
        </div>
      </div>

      <Section
        description={t("kpayPay.history.desc")}
        id="payment-history"
        title={t("kpayPay.history.title")}
      >
        <PaymentHistoryList payments={payments} />
      </Section>
    </div>
  );
}
