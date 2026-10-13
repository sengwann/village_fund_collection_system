"use client";

import { Alert } from "../../../components/ui/alert";
import { useTranslation } from "../../../lib/i18n/provider";

export function PendingMembershipBanner() {
  const { t } = useTranslation();
  return (
    <Alert tone="warning" title={t("shell.pendingTitle")}>
      {t("shell.pendingBanner")}
    </Alert>
  );
}
