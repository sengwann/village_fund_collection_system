import { notFound } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getPlatformShellContext } from "@/features/shell/lib/shell-context";
import { VillageLifecycleActions } from "@/features/village-management/components/village-lifecycle-actions";
import { VillageStatusBadge } from "@/features/village-management/components/village-status-badge";
import {
  LIFECYCLE_ERROR_PARAM,
  LIFECYCLE_ERROR_REASON_TOO_LONG,
} from "@/features/village-management/lib/lifecycle-input";
import { requireVillageLifecycleAccess } from "@/lib/authz";
import type { TranslationKey } from "@/lib/i18n/en";
import { getT } from "@/lib/i18n/translations";
import { formatYangonDateTime } from "@/lib/utils";

export const metadata = {
  title: "Village Detail | Village Fund Collection System",
};

type RouteParams = Record<string, string | string[] | undefined>;

async function extractVillageId(rawParams: unknown): Promise<string> {
  if (!rawParams) {
    return "";
  }

  let params: RouteParams;

  const maybePromise = rawParams as {
    then?: unknown;
  };

  if (typeof maybePromise.then === "function") {
    params = await (rawParams as Promise<RouteParams>);
  } else {
    params = rawParams as RouteParams;
  }

  const villageId = params.villageId;

  if (Array.isArray(villageId)) {
    return villageId[0] ?? "";
  }

  return villageId ?? "";
}

async function extractSearchParam(
  rawSearchParams: unknown,
  key: string,
): Promise<string | null> {
  if (!rawSearchParams) {
    return null;
  }

  let searchParams: RouteParams;

  const maybePromise = rawSearchParams as {
    then?: unknown;
  };

  if (typeof maybePromise.then === "function") {
    searchParams = await (rawSearchParams as Promise<RouteParams>);
  } else {
    searchParams = rawSearchParams as RouteParams;
  }

  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export default async function VillageDetailPage({
  params,
  searchParams,
}: {
  params: unknown;
  searchParams?: unknown;
}) {
  const villageId = await extractVillageId(params);

  if (!villageId) {
    notFound();
  }

  const village = await requireVillageLifecycleAccess(villageId);
  const { language } = await getPlatformShellContext();
  const t = getT(language);

  const errorParam = await extractSearchParam(
    searchParams,
    LIFECYCLE_ERROR_PARAM,
  );
  const showReasonTooLong = errorParam === LIFECYCLE_ERROR_REASON_TOO_LONG;

  const statusLabels: Record<typeof village.status, TranslationKey> = {
    ACTIVE: "adminDashboard.status.active",
    SUSPENDED: "adminDashboard.status.suspended",
    DEACTIVATED: "adminDashboard.status.deactivated",
  };

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: t("adminVillages.detail.code"),
      value: village.villageCode,
    },
    {
      label: t("adminVillages.detail.name"),
      value: village.name,
    },
    {
      label: t("adminVillages.detail.status"),
      value: (
        <VillageStatusBadge
          label={t(statusLabels[village.status])}
          status={village.status}
        />
      ),
    },
    {
      label: t("adminVillages.detail.createdAt"),
      value: (
        <time dateTime={village.createdAt.toISOString()}>
          {formatYangonDateTime(village.createdAt)}
        </time>
      ),
    },
    {
      label: t("adminVillages.detail.updatedAt"),
      value: (
        <time dateTime={village.updatedAt.toISOString()}>
          {formatYangonDateTime(village.updatedAt)}
        </time>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/villages"
        backLabel={t("adminVillages.back")}
        eyebrow={village.villageCode}
        meta={
          <VillageStatusBadge
            label={t(statusLabels[village.status])}
            status={village.status}
          />
        }
        title={village.name}
      />

      {showReasonTooLong ? (
        <Alert tone="danger">{t("adminVillages.err.reasonTooLong")}</Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHeader className="pb-3 sm:pb-3">
            <CardTitle as="h2">{t("adminVillages.detail.infoTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y text-sm">
              {rows.map((row) => (
                <div
                  className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5"
                  key={row.label}
                >
                  <dt className="shrink-0 text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 text-right font-medium [overflow-wrap:anywhere]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-3">
            <CardTitle as="h2">
              {t("adminVillages.detail.lifecycleTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VillageLifecycleActions
              language={language}
              status={village.status}
              villageCode={village.villageCode}
              villageId={village.id}
              villageName={village.name}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}