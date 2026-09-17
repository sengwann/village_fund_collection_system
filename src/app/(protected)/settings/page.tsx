import { getActiveCollectorContext } from "@/lib/authz";
import { UpdateKpayInfoForm } from "@/features/user-settings/components/update-kpay-info-form";
import Link from "next/link";
import { LanguagePreference } from "@prisma/client";
import { ChangePasswordForm } from "@/features/user-settings/components/change-password-form";
import { EditProfileForm } from "@/features/user-settings/components/edit-profile-form";
import { UpdateSettingsForm } from "@/features/user-settings/components/update-settings-form";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n/translations";

export const metadata = {
  title: "Settings | Village Fund Collection System",
};

function formatRole(role: string): string {
  const labels: Record<string, string> = {
    SYSTEM_ADMIN: "System Admin",
    CHIEF: "Chief",
    VILLAGER: "Villager",
  };
  return labels[role] ?? role;
}

function formatMembership(status: string | null): string {
  if (!status) return "—";
  const labels: Record<string, string> = {
    ACTIVE: "Active",
    PENDING: "Pending",
    REJECTED: "Rejected",
    REMOVED: "Removed",
  };
  return labels[status] ?? status;
}

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser();

  const village = user.villageId
    ? await prisma.village.findUnique({
        where: { id: user.villageId },
        select: { name: true },
      })
    : null;

  const house = user.houseId
    ? await prisma.house.findUnique({
        where: { id: user.houseId },
        select: { houseNumber: true },
      })
    : null;

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
    select: { language: true },
  });

  // Collector KPay info — only loaded/shown for ACTIVE collectors.
  const collectorContext = await getActiveCollectorContext(user);
  const isActiveCollector = Boolean(collectorContext);

  let kpayAccountName = "";
  let kpayAccountNumber = "";
  if (isActiveCollector) {
    const kpayInfo = await prisma.user.findUnique({
      where: { id: user.id },
      select: { kpayAccountName: true, kpayAccountNumber: true },
    });
    kpayAccountName = kpayInfo?.kpayAccountName ?? "";
    kpayAccountNumber = kpayInfo?.kpayAccountNumber ?? "";
  }

  const language = settings?.language ?? LanguagePreference.EN;
  const t = getT(language);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {t("settings.title")}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {t("settings.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
              href="/dashboard"
            >
              {t("settings.backToDashboard")}
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

        <div className="space-y-6">
          {/* Account Info */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium text-slate-900">
              {t("settings.accountInfo")}
            </h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <dt className="font-medium text-slate-700">
                  {t("settings.role")}
                </dt>
                <dd className="text-slate-900">{formatRole(user.role)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <dt className="font-medium text-slate-700">
                  {t("settings.village")}
                </dt>
                <dd className="text-slate-900">{village?.name ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <dt className="font-medium text-slate-700">
                  {t("settings.house")}
                </dt>
                <dd className="text-slate-900">{house?.houseNumber ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="font-medium text-slate-700">
                  {t("settings.membership")}
                </dt>
                <dd className="text-slate-900">
                  {formatMembership(user.membershipStatus)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">
              {t("settings.accountNote")}
            </p>
          </section>

          {/* Edit Profile */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-sm font-medium text-slate-900">
              {t("settings.editProfile")}
            </h2>
            <EditProfileForm
              initialEmail={user.email ?? ""}
              initialName={user.name}
              initialPhone={user.phone ?? ""}
              initialDateOfBirth={user.dateOfBirth ?? ""}
            />
          </section>
          {/* Payment Information — visible to active collectors only */}
          {isActiveCollector ? (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-sm font-medium text-slate-900">
                Payment Information
              </h2>
              <UpdateKpayInfoForm
                initialKpayAccountName={kpayAccountName}
                initialKpayAccountNumber={kpayAccountNumber}
              />
            </section>
          ) : null}

          {/* Change Password */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-sm font-medium text-slate-900">
              {t("settings.changePassword")}
            </h2>
            <ChangePasswordForm />
          </section>

          {/* Preferences */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-sm font-medium text-slate-900">
              {t("settings.preferences")}
            </h2>
            <UpdateSettingsForm initialLanguage={language} />
          </section>
        </div>
      </div>
    </main>
  );
}
