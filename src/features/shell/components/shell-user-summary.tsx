"use client";

import type { SessionUser } from "../../../lib/auth/auth.types";
import { useTranslation } from "../../../lib/i18n/provider";

export function ShellUserSummary({
  user,
  variant,
}: {
  user: SessionUser;
  variant: "platform" | "village";
}) {
  const { t } = useTranslation();
  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-900">{user.name}</p>
      <p className="mt-1 text-xs text-slate-600">{user.role}</p>
      {variant === "village" ? (
        <p className="mt-1 break-all text-xs text-slate-500">
          {t("shell.villageId")}: {user.villageId ?? "—"}
        </p>
      ) : null}
      {variant === "village" ? (
        <p className="mt-1 text-xs text-slate-500">
          {t("shell.membership")}: {user.membershipStatus ?? "—"}
        </p>
      ) : null}
    </div>
  );
}
