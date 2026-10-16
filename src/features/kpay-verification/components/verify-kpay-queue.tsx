"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useTranslation } from "@/lib/i18n/provider";
import { formatAmount, formatYangonDateTime } from "@/lib/utils";
import { fill } from "./template";

export interface PendingKpayPayment {
  id: string;
  amount: number;
  createdAt: Date;
  fund: { name: string };
  house: { houseNumber: string };
  payer: { name: string };
}

export function VerifyKpayQueue({
  payments,
}: {
  payments: PendingKpayPayment[];
}) {
  const { t } = useTranslation();
  const count = payments.length;

  return (
    <div className="space-y-6">
      <PageHeader
        description={t("kpayVerify.queue.description")}
        meta={
          count > 0 ? (
            <Badge dot variant="warning">
              {fill(
                t(
                  count === 1
                    ? "kpayVerify.queue.countOne"
                    : "kpayVerify.queue.countOther",
                ),
                { count },
              )}
            </Badge>
          ) : null
        }
        title={t("kpayVerify.queue.title")}
      />

      {count === 0 ? (
        <EmptyState
          description={t("kpayVerify.queue.emptyBody")}
          title={t("kpayVerify.queue.emptyTitle")}
        />
      ) : (
        <ul className="space-y-3">
          {payments.map((payment) => (
            <li key={payment.id}>
              <Link
                className="block rounded-xl"
                href={`/village/verify-kpay/${payment.id}`}
              >
                <Card className="space-y-3 p-4" interactive>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      <p className="break-words text-base font-semibold leading-snug">
                        {payment.payer.name}
                      </p>
                      <p className="break-words text-sm text-muted-foreground">
                        {fill(t("kpayVerify.queue.house"), {
                          number: payment.house.houseNumber,
                        })}{" "}
                        · {payment.fund.name}
                      </p>
                    </div>
                    <p className="shrink-0 text-lg font-semibold tabular-nums">
                      {formatAmount(payment.amount)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t pt-3 text-sm">
                    <span className="min-w-0 text-muted-foreground">
                      {fill(t("kpayVerify.queue.submitted"), {
                        date: formatYangonDateTime(payment.createdAt),
                      })}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary">
                      {t("kpayVerify.queue.review")}
                      <ChevronRight aria-hidden className="size-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
