"use client";

import Link from "next/link";
import { logoutAction } from "../../auth/actions/logout.action";
import type { SessionUser } from "../../../lib/auth/auth.types";
import { useTranslation } from "../../../lib/i18n/provider";

export function AppHeader({
  user,
  variant,
}: {
  user: SessionUser;
  variant: "platform" | "village";
}) {
  const { t } = useTranslation();
  const title =
    variant === "platform"
      ? t("shell.platformAdmin")
      : t("shell.villageFundCollection");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {title}
          </p>
          <p className="truncate text-xs text-slate-600">
            {user.name} · {user.role}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/settings"
          >
            {t("nav.settings")}
          </Link>
          <form action={logoutAction}>
            <button
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
              type="submit"
            >
              {t("nav.logout")}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
