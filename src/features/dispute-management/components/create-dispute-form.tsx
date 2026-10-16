"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { useTranslation } from "@/lib/i18n/provider";
import { createDisputeAction } from "../actions/create-dispute.action";

export function CreateDisputeForm({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createDisputeAction(formData);
      if (result.success) {
        router.push("/village/disputes");
        router.refresh();
      } else {
        const fe = result.fieldErrors ?? {};
        setFieldErrors(fe);
        setError(
          Object.keys(fe).length > 0
            ? t("disputes.form.fixFields")
            : (result.error ?? t("common.error")),
        );
      }
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <input name="paymentId" type="hidden" value={paymentId} />
      <Field
        error={fieldErrors.description}
        hint={t("disputes.create.hint")}
        id="description"
        label={t("disputes.create.label")}
        required
      >
        <Textarea
          name="description"
          placeholder={t("disputes.create.placeholder")}
          rows={6}
        />
      </Field>

      {error ? (
        <Alert title={t("disputes.create.errorTitle")} tone="danger">
          {error}
        </Alert>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link href="/village/disputes">{t("common.cancel")}</Link>
        </Button>
        <Button loading={isPending} type="submit">
          {isPending
            ? t("disputes.create.submitting")
            : t("disputes.create.submit")}
        </Button>
      </div>
    </form>
  );
}
