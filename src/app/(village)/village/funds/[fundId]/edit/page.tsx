import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FundStatus } from "@prisma/client";
import { EditFundForm } from "@/features/fund-management/components/edit-fund-form";
import { formatDateInput } from "@/features/fund-management/lib/fund-validators";
import { requireChief, requireSameVillage } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Edit Fund | Village Fund Collection System",
};

type RouteParams = Record<string, string | string[] | undefined>;

async function extractFundId(rawParams: unknown): Promise<string> {
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

  const fundId = params.fundId;

  if (Array.isArray(fundId)) {
    return fundId[0] ?? "";
  }

  return fundId ?? "";
}

export default async function EditFundPage({ params }: { params: unknown }) {
  const context = await requireChief();
  const fundId = await extractFundId(params);

  if (!fundId) {
    notFound();
  }

  const fund = await prisma.fund.findUnique({
    where: {
      id: fundId,
    },
    select: {
      id: true,
      villageId: true,
      name: true,
      description: true,
      targetAmount: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });

  if (!fund) {
    notFound();
  }

  requireSameVillage(context, fund.villageId);

  if (fund.status !== FundStatus.DRAFT) {
    redirect(`/village/funds/${fundId}`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Edit fund</h1>
            <p className="mt-1 text-sm text-slate-600">
              Only draft funds can be edited.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href={`/village/funds/${fundId}`}
          >
            Back to fund
          </Link>
        </div>
      </div>

      <EditFundForm
        fundId={fund.id}
        initialDescription={fund.description ?? ""}
        initialEndDate={formatDateInput(fund.endDate)}
        initialName={fund.name}
        initialStartDate={formatDateInput(fund.startDate)}
        initialTargetAmount={String(fund.targetAmount)}
      />
    </div>
  );
}
