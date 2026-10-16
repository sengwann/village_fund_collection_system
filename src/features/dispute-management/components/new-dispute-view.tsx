"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useTranslation } from "@/lib/i18n/provider";
import { formatAmount } from "@/lib/utils";
import { CreateDisputeForm } from "./create-dispute-form";

export function NewDisputeView({
  paymentId,
  fundName,
  amount,
}: {
  paymentId: string;
  fundName: string;
  amount: number;
}) {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("disputes.create.step1.title"),
      body: t("disputes.create.step1.body"),
    },
    {
      title: t("disputes.create.step2.title"),
      body: t("disputes.create.step2.body"),
    },
    {
      title: t("disputes.create.step3.title"),
      body: t("disputes.create.step3.body"),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/village/disputes"
        backLabel={t("disputes.back")}
        description={t("disputes.create.description")}
        title={t("disputes.create.title")}
      />

      <Card variant="muted">
        <CardHeader>
          <CardTitle as="h2">{t("disputes.create.paymentTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">
                {t("disputes.payment.fund")}
              </dt>
              <dd className="break-words text-sm font-medium">{fundName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                {t("disputes.payment.amount")}
              </dt>
              <dd className="text-xl font-semibold tabular-nums">
                {formatAmount(amount)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <Card>
          <CardContent>
            <CreateDisputeForm paymentId={paymentId} />
          </CardContent>
        </Card>

        <section aria-labelledby="dispute-steps-heading" className="space-y-3">
          <h2
            className="text-base font-semibold tracking-tight"
            id="dispute-steps-heading"
          >
            {t("disputes.create.stepsTitle")}
          </h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li className="flex gap-3" key={step.title}>
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-secondary-foreground"
                >
                  {i + 1}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
