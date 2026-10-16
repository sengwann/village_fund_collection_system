"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { useTranslation } from "@/lib/i18n/provider";
import { formatAmount } from "@/lib/utils";
import {
  submitKpayPaymentAction,
  type SubmitKpayPaymentActionResult,
} from "../actions/submit-kpay-payment.action";
import { fillMessage } from "../lib/fill-message";

export function KpayPaymentForm({ minimumAmount }: { minimumAmount: number }) {
  const router = useRouter();
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isPending, startTransition] = useTransition();

  // After a failed submit, move focus to the first invalid field, or to the
  // error message when there are no field errors.
  useEffect(() => {
    if (Object.values(fieldErrors).some(Boolean)) {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
      return;
    }
    if (formError) {
      errorRef.current?.focus();
    }
  }, [fieldErrors, formError]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result: SubmitKpayPaymentActionResult =
        await submitKpayPaymentAction(formData, minimumAmount);
      if (result.success) {
        router.push("/village/pay");
        router.refresh();
        return;
      }
      const nextFieldErrors = result.fieldErrors ?? {};
      setFieldErrors(nextFieldErrors);
      setFormError(
        result.formError ??
          (Object.values(nextFieldErrors).some(Boolean)
            ? t("kpayPay.form.fixFields")
            : t("kpayPay.form.errorGeneric")),
      );
    });
  }

  const minimumLabel = formatAmount(minimumAmount);

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <Card>
        <CardHeader>
          <CardTitle as="h2">{t("kpayPay.form.amountTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Field
            error={fieldErrors.amount}
            hint={fillMessage(t("kpayPay.form.amountHint"), {
              amount: minimumLabel,
            })}
            id="amount"
            label={t("kpayPay.form.amountLabel")}
            required
          >
            <Input
              autoComplete="off"
              enterKeyHint="next"
              inputMode="numeric"
              name="amount"
              placeholder={fillMessage(t("kpayPay.form.amountPlaceholder"), {
                amount: minimumLabel,
              })}
              required
              type="text"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">{t("kpayPay.form.detailsTitle")}</CardTitle>
          <CardDescription>{t("kpayPay.form.detailsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field
            error={fieldErrors.kpayTransactionId}
            hint={t("kpayPay.form.txnHint")}
            id="kpayTransactionId"
            label={t("kpayPay.form.txnLabel")}
            required
          >
            <Input
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              className="font-mono uppercase"
              enterKeyHint="next"
              maxLength={22}
              name="kpayTransactionId"
              placeholder={t("kpayPay.form.txnPlaceholder")}
              required
              spellCheck={false}
              type="text"
            />
          </Field>

          <fieldset className="min-w-0 space-y-4 border-t pt-5">
            <legend className="mb-3 text-sm font-semibold text-foreground">
              {t("kpayPay.form.senderGroup")}
            </legend>
            <Field
              error={fieldErrors.kpaySenderAccount}
              id="kpaySenderAccount"
              label={t("kpayPay.form.senderAccount")}
              required
            >
              <Input
                autoComplete="off"
                enterKeyHint="next"
                name="kpaySenderAccount"
                required
                type="text"
              />
            </Field>
            <Field
              error={fieldErrors.kpaySenderName}
              id="kpaySenderName"
              label={t("kpayPay.form.senderName")}
              required
            >
              <Input
                autoComplete="off"
                enterKeyHint="next"
                name="kpaySenderName"
                required
                type="text"
              />
            </Field>
          </fieldset>

          <fieldset className="min-w-0 space-y-4 border-t pt-5">
            <legend className="mb-3 text-sm font-semibold text-foreground">
              {t("kpayPay.form.receiverGroup")}
            </legend>
            <Field
              error={fieldErrors.kpayReceiverAccount}
              id="kpayReceiverAccount"
              label={t("kpayPay.form.receiverAccount")}
              required
            >
              <Input
                autoComplete="off"
                enterKeyHint="done"
                name="kpayReceiverAccount"
                required
                type="text"
              />
            </Field>
          </fieldset>
        </CardContent>
      </Card>

      {formError ? (
        <div className="rounded-lg" ref={errorRef} tabIndex={-1}>
          <Alert tone="danger" title={t("kpayPay.form.errorTitle")}>
            {formError}
          </Alert>
        </div>
      ) : null}

      <div className="space-y-2">
        <Button className="w-full" loading={isPending} size="lg" type="submit">
          {isPending ? t("kpayPay.form.submitting") : t("kpayPay.form.submit")}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {t("kpayPay.form.verifyNote")}
        </p>
      </div>
    </form>
  );
}
