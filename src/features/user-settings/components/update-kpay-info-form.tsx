"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useTranslation } from "@/lib/i18n/provider";
import {
  updateKpayInfoAction,
  type UpdateKpayInfoActionResult,
} from "../actions/update-kpay-info.action";
import { useFocusFirstError } from "./use-focus-first-error";

export function UpdateKpayInfoForm({
  initialKpayAccountName,
  initialKpayAccountNumber,
}: {
  initialKpayAccountName: string;
  initialKpayAccountNumber: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isPending, startTransition] = useTransition();

  useFocusFirstError(formRef, fieldErrors, formError);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSaved(false);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result: UpdateKpayInfoActionResult =
        await updateKpayInfoAction(formData);
      if (result.success) {
        setSaved(true);
        router.refresh();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Unable to update payment information.");
    });
  }

  return (
    <form
      className="space-y-6"
      noValidate
      onChange={() => {
        if (saved) setSaved(false);
      }}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <Field
        error={fieldErrors.kpayAccountName}
        id="kpayAccountName"
        label={t("kpay.accountName")}
        required
      >
        <Input
          autoComplete="name"
          defaultValue={initialKpayAccountName}
          name="kpayAccountName"
          required
          type="text"
        />
      </Field>

      <Field
        error={fieldErrors.kpayAccountNumber}
        id="kpayAccountNumber"
        label={t("kpay.accountNumber")}
        required
      >
        <Input
          autoComplete="tel"
          defaultValue={initialKpayAccountNumber}
          inputMode="tel"
          name="kpayAccountNumber"
          placeholder={t("settings.phonePlaceholder")}
          required
          type="tel"
        />
      </Field>

      {formError ? (
        <div className="outline-none" data-form-error tabIndex={-1}>
          <Alert tone="danger">{formError}</Alert>
        </div>
      ) : null}

      {saved ? <Alert tone="success">{t("kpay.saved")}</Alert> : null}

      <div className="flex sm:justify-end">
        <Button className="w-full sm:w-auto" loading={isPending} type="submit">
          {isPending ? t("kpay.saving") : t("kpay.save")}
        </Button>
      </div>
    </form>
  );
}
