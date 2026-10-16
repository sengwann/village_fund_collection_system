"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { useTranslation } from "@/lib/i18n/provider";
import { rejectKpayPaymentAction } from "../actions/reject-kpay-payment.action";

export function RejectPaymentForm({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await rejectKpayPaymentAction(formData);

      if (result.success) {
        router.push("/village/verify-kpay");
        router.refresh();
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setError(result.error ?? t("kpayVerify.reject.errorGeneric"));
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="paymentId" type="hidden" value={paymentId} />

      <Field
        error={fieldErrors.rejectionNote}
        hint={t("kpayVerify.reject.hint")}
        id="rejectionNote"
        label={t("kpayVerify.reject.label")}
        required
      >
        <Textarea
          name="rejectionNote"
          placeholder={t("kpayVerify.reject.placeholder")}
          rows={4}
        />
      </Field>

      {error ? (
        <Alert title={t("kpayVerify.reject.errorTitle")} tone="danger">
          {error}
        </Alert>
      ) : null}

      <Button
        className="w-full"
        loading={isPending}
        type="submit"
        variant="destructive"
      >
        {isPending
          ? t("kpayVerify.reject.submitting")
          : t("kpayVerify.reject.submit")}
      </Button>
    </form>
  );
}
