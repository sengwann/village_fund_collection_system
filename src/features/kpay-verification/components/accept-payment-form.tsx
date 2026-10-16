"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/provider";
import { acceptKpayPaymentAction } from "../actions/accept-kpay-payment.action";

function ConfirmActions({ onCancel }: { onCancel: () => void }) {
  const { t } = useTranslation();
  const { pending } = useFormStatus();

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button
        autoFocus
        disabled={pending}
        onClick={onCancel}
        type="button"
        variant="outline"
      >
        {t("common.cancel")}
      </Button>
      <Button loading={pending} type="submit">
        {pending
          ? t("kpayVerify.accept.submitting")
          : t("kpayVerify.accept.confirm")}
      </Button>
    </div>
  );
}

export function AcceptPaymentForm({ paymentId }: { paymentId: string }) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);

  return (
    <form action={acceptKpayPaymentAction} className="space-y-3">
      <input name="paymentId" type="hidden" value={paymentId} />

      {confirming ? (
        <>
          <Alert title={t("kpayVerify.accept.confirmTitle")} tone="warning">
            {t("kpayVerify.accept.confirmBody")}
          </Alert>
          <ConfirmActions onCancel={() => setConfirming(false)} />
        </>
      ) : (
        <Button
          className="w-full"
          onClick={() => setConfirming(true)}
          type="button"
        >
          {t("kpayVerify.accept.button")}
        </Button>
      )}
    </form>
  );
}
