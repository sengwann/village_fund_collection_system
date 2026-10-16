"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/provider";
import { formatAmount } from "@/lib/utils";
import { fillMessage } from "../lib/fill-message";

export function CurrentFundCard({
  fundName,
  totalAmount,
  amountPerHouse,
  numberOfHouse,
  collectedAmount,
}: {
  fundName: string;
  totalAmount: number;
  amountPerHouse: number | null;
  numberOfHouse: number | null;
  collectedAmount: number;
}) {
  const { t } = useTranslation();

  // Display only: share of the total that has been accepted so far.
  const percent =
    totalAmount > 0
      ? Math.min(100, Math.round((collectedAmount / totalAmount) * 100))
      : 0;

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("kpayPay.fund.eyebrow")}
        </p>
        <CardTitle as="h2" className="text-lg">
          {fundName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-lg bg-accent px-4 py-3 text-accent-foreground">
          <p className="text-sm font-medium">{t("kpayPay.fund.amountDue")}</p>
          {amountPerHouse !== null ? (
            <>
              <p className="mt-1 text-3xl font-bold leading-tight tabular-nums">
                {formatAmount(amountPerHouse)}
              </p>
              {numberOfHouse !== null ? (
                <p className="mt-1 text-xs">
                  {fillMessage(t("kpayPay.fund.formula"), {
                    count: numberOfHouse,
                  })}
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-1 text-sm">{t("kpayPay.fund.amountUnknown")}</p>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">{t("kpayPay.fund.progress")}</span>
            <span className="tabular-nums text-muted-foreground">
              {fillMessage(t("kpayPay.fund.percent"), { percent })}
            </span>
          </div>
          <div
            aria-label={t("kpayPay.fund.progress")}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={percent}
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-border"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">{t("kpayPay.fund.total")}</dt>
            <dd className="text-end font-semibold tabular-nums">
              {formatAmount(totalAmount)}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">
              {t("kpayPay.fund.collected")}
            </dt>
            <dd className="text-end font-semibold tabular-nums">
              {formatAmount(collectedAmount)}
            </dd>
          </div>
        </dl>

        <p className="text-xs text-muted-foreground">
          {t("kpayPay.fund.note")}
        </p>
      </CardContent>
    </Card>
  );
}
