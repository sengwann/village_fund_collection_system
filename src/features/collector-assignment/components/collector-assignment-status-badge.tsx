"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/provider";

export function CollectorAssignmentStatusBadge({
  isActive,
}: {
  isActive: boolean;
}) {
  const { t } = useTranslation();

  if (isActive) {
    return (
      <Badge className="shrink-0" dot variant="success">
        {t("collectors.status.active")}
      </Badge>
    );
  }

  return (
    <Badge className="shrink-0" dot variant="neutral">
      {t("collectors.status.inactive")}
    </Badge>
  );
}
