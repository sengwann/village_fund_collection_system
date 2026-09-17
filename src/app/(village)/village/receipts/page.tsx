import type { Prisma } from "@prisma/client";
import { ReceiptList } from "../../../../features/receipt-viewing/components/receipt-list";
import { requireReceiptAccess } from "../../../../features/receipt-viewing/lib/receipt-access";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Receipts | Village Fund Collection System",
};

export default async function ReceiptsPage() {
  const { user, villageId, accessLevel } = await requireReceiptAccess();

  let whereClause: Prisma.ReceiptWhereInput;

  switch (accessLevel) {
    case "village":
      whereClause = { villageId };
      break;
    case "collector":
      whereClause = {
        villageId,
        OR: [
          { payment: { collectorUserId: user.id } },
          { payment: { payerUserId: user.id } },
        ],
      };
      break;
    case "own":
      whereClause = {
        villageId,
        payment: { payerUserId: user.id },
      };
      break;
  }

  const receipts = await prisma.receipt.findMany({
    where: whereClause,
    orderBy: {
      payment: {
        createdAt: "desc",
      },
    },
    take: 50,
    select: {
      id: true,
      receiptNumber: true,
      status: true,
      payment: {
        select: {
          amount: true,
          paymentMethod: true,
          createdAt: true,
          fund: {
            select: { name: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Receipts</h1>
        <p className="mt-1 text-sm text-slate-600">
          View payment receipts for your village.
        </p>
      </div>

      <ReceiptList receipts={receipts} />
    </div>
  );
}
