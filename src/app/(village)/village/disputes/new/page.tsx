import { DisputeStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { CreateDisputeForm } from "@/features/dispute-management/components/create-dispute-form";
import { requireCreateDisputeAccess } from "@/features/dispute-management/lib/dispute-access";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Raise Dispute" };

export default async function NewDisputePage({
  searchParams,
}: {
  searchParams: Promise<{ paymentId?: string }>;
}) {
  const { user, villageId } = await requireCreateDisputeAccess();
  const { paymentId } = await searchParams;
  if (!paymentId) redirect("/village/disputes");

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      id: true,
      villageId: true,
      status: true,
      payerUserId: true,
      paymentMethod: true,
      amount: true,
      fund: { select: { name: true } },
    },
  });

  if (
    !payment ||
    payment.villageId !== villageId ||
    payment.payerUserId !== user.id ||
    payment.status !== PaymentStatus.REJECTED ||
    payment.paymentMethod !== PaymentMethod.KPAY
  ) {
    redirect("/village/disputes");
  }

  const existingActiveDispute = await prisma.dispute.findFirst({
    where: {
      paymentId: payment.id,
      villageId,
      status: {
        in: [
          DisputeStatus.OPEN,
          DisputeStatus.UNDER_REVIEW,
          DisputeStatus.RESOLVED,
        ],
      },
    },
    select: { id: true },
  });

  if (existingActiveDispute) {
    redirect(`/village/disputes/${existingActiveDispute.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          Raise a dispute
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Disputing {payment.fund.name} payment of{" "}
          {new Intl.NumberFormat("en").format(payment.amount)}.
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <CreateDisputeForm paymentId={payment.id} />
      </div>
    </div>
  );
}
