import Link from "next/link";
import { notFound } from "next/navigation";
import { DisputeStatus } from "@prisma/client";
import { DisputeDetailCard } from "@/features/dispute-management/components/dispute-detail-card";
import { ResolveDisputeForm } from "@/features/dispute-management/components/resolve-dispute-form";
import { RejectDisputeForm } from "@/features/dispute-management/components/reject-dispute-form";
import {
  canResolveOrReject,
  canStartReview,
} from "@/features/dispute-management/lib/dispute-rules";
import {
  requireDisputeAccess,
  type DisputeAccessLevel,
} from "@/features/dispute-management/lib/dispute-access";
import { startDisputeReviewAction } from "@/features/dispute-management/actions/start-dispute-review.action";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dispute Detail | Village Fund Collection System",
};

// ── Safe param extraction (Next.js 15+ params is a Promise) ───
type RouteParams = Record<string, string | string[] | undefined>;

async function extractDisputeId(rawParams: unknown): Promise<string> {
  if (!rawParams) return "";
  let params: RouteParams;
  const maybePromise = rawParams as { then?: unknown };
  if (typeof maybePromise.then === "function") {
    params = await (rawParams as Promise<RouteParams>);
  } else {
    params = rawParams as RouteParams;
  }
  const disputeId = params.disputeId;
  if (Array.isArray(disputeId)) return disputeId[0] ?? "";
  return disputeId ?? "";
}

// ── Access check ───────────────────────────────────────────────
function canAccessDisputeDetail(
  accessLevel: DisputeAccessLevel,
  dispute: { villageId: string; raisedByUserId: string },
  villageId: string,
  userId: string,
): boolean {
  if (dispute.villageId !== villageId) return false;
  if (accessLevel === "village") return true;
  return dispute.raisedByUserId === userId;
}

// ── Page ───────────────────────────────────────────────────────
export default async function DisputeDetailPage({
  params,
}: {
  params: unknown;
}) {
  const { user, villageId, accessLevel } = await requireDisputeAccess();

  const disputeId = await extractDisputeId(params);
  if (!disputeId) {
    notFound();
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    select: {
      id: true,
      villageId: true,
      status: true,
      description: true,
      resolutionNote: true,
      createdAt: true,
      raisedByUserId: true,
      raisedBy: { select: { name: true } },
      payment: {
        select: {
          id: true,
          amount: true,
          paymentMethod: true,
          kpayTransactionId: true,
          kpayReceiverAccount: true,
          rejectionNote: true,
          createdAt: true,
          fund: { select: { name: true } },
          house: { select: { houseNumber: true } },
          payer: { select: { name: true } },
          collector: { select: { name: true } },
        },
      },
    },
  });

  if (!dispute) {
    notFound();
  }

  if (!canAccessDisputeDetail(accessLevel, dispute, villageId, user.id)) {
    notFound();
  }

  const isChief = accessLevel === "village";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Dispute Detail
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Review dispute information and disputed payment.
            </p>
          </div>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100"
            href="/village/disputes"
          >
            Back to disputes
          </Link>
        </div>
      </div>

      <DisputeDetailCard dispute={dispute} />

      {isChief ? (
        <div className="space-y-6">
          {canStartReview(dispute.status) ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
              <h2 className="text-sm font-medium text-blue-900">
                Start Review
              </h2>
              <p className="mb-3 mt-2 text-xs text-blue-800">
                Mark this dispute as under review before resolving or rejecting
                it.
              </p>
              <form action={startDisputeReviewAction}>
                <input name="disputeId" type="hidden" value={dispute.id} />
                <button
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  type="submit"
                >
                  Start Review
                </button>
              </form>
            </div>
          ) : null}

          {canResolveOrReject(dispute.status) ? (
            <>
              <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-medium text-emerald-900">
                  Resolve Dispute
                </h2>
                <p className="mb-3 text-xs text-slate-600">
                  Resolving marks the dispute as addressed. The payment status
                  remains separate — the villager may resubmit if appropriate.
                </p>
                <ResolveDisputeForm disputeId={dispute.id} />
              </div>
              <div className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-medium text-red-900">
                  Reject Dispute
                </h2>
                <p className="mb-3 text-xs text-slate-600">
                  Rejecting upholds the original payment rejection.
                </p>
                <RejectDisputeForm disputeId={dispute.id} />
              </div>
            </>
          ) : null}

          {dispute.status === DisputeStatus.RESOLVED ||
          dispute.status === DisputeStatus.REJECTED ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <p className="text-sm text-slate-600">
                This dispute has been {dispute.status.toLowerCase()}. No further
                actions are available.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
