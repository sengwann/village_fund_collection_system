"use server";
import {
  AuditActionType,
  DisputeStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  FundStatus,
} from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import { createAuditLog, AuditEntityType } from "../../../lib/audit";
import { isFundOpenForPayment } from "../../fund-management/lib/fund-lifecycle";
import { requireKpayPaymentAccess } from "../lib/kpay-payment-access";
import { isBlockingPaymentStatus } from "../lib/kpay-payment-rules";
import {
  validateKpayPaymentInput,
  type KpayPaymentField,
} from "../lib/kpay-payment-validators";

export type SubmitKpayPaymentActionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<KpayPaymentField, string>>;
    };

export async function submitKpayPaymentAction(
  formData: FormData,
  minimumAmount: number,
): Promise<SubmitKpayPaymentActionResult> {
  const { user, villageId, houseId, fund } = await requireKpayPaymentAccess();
  if (!fund) {
    return {
      success: false,
      formError: "No active fund is available for payment.",
    };
  }
  const validation = validateKpayPaymentInput(formData, minimumAmount);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }
  const {
    amount,
    kpayTransactionId,
    kpaySenderAccount,
    kpaySenderName,
    kpayReceiverAccount,
  } = validation.data;

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const currentFund = await tx.fund.findUnique({
            where: { id: fund.id },
            select: {
              id: true,
              status: true,
              targetAmount: true,
              startDate: true,
              endDate: true,
            },
          });
          if (!currentFund || currentFund.status !== FundStatus.ACTIVE) {
            throw new Error("FUND_NOT_ACTIVE");
          }
          if (amount < minimumAmount) {
            throw new Error("AMOUNT_BELOW_TARGET");
          }
          if (!isFundOpenForPayment(currentFund)) {
            throw new Error("FUND_NOT_OPEN");
          }

          const existingPayment = await tx.payment.findFirst({
            where: {
              fundId: fund.id,
              houseId,
              villageId,
              status: { in: [PaymentStatus.ACCEPTED, PaymentStatus.PENDING] },
            },
            select: { id: true, status: true },
          });
          if (
            existingPayment &&
            isBlockingPaymentStatus(existingPayment.status)
          ) {
            throw new Error("DUPLICATE_PAYMENT");
          }

          // block if same house + fund + payer has an unresolved dispute ──
          const unresolvedDispute = await tx.dispute.findFirst({
            where: {
              villageId,
              status: {
                in: [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW],
              },
              payment: {
                fundId: fund.id,
                houseId,
                payerUserId: user.id,
              },
            },
            select: { id: true },
          });
          if (unresolvedDispute) {
            throw new Error("UNRESOLVED_DISPUTE_EXISTS");
          }

          const payment = await tx.payment.create({
            data: {
              villageId,
              fundId: fund.id,
              houseId,
              payerUserId: user.id,
              paymentMethod: PaymentMethod.KPAY,
              amount,
              status: PaymentStatus.PENDING,
              kpayTransactionId,
              kpaySenderAccount,
              kpaySenderName,
              kpayReceiverAccount,
            },
          });
          await createAuditLog(tx, {
            actionType: AuditActionType.CREATE,
            entityType: AuditEntityType.PAYMENT,
            entityId: payment.id,
            villageId,
            actorUserId: user.id,
            metadata: {
              amount,
              paymentMethod: PaymentMethod.KPAY,
              fundId: fund.id,
              houseId,
              kpayTransactionId,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "DUPLICATE_PAYMENT") {
        return {
          success: false,
          formError:
            "A valid or pending payment already exists for this fund and house.",
        };
      }

      if (error.message === "UNRESOLVED_DISPUTE_EXISTS") {
        return {
          success: false,
          formError:
            "Your previous payment is currently under review. Please wait until the review is completed before submitting another payment.",
        };
      }

      if (error.message === "FUND_NOT_OPEN") {
        return {
          success: false,
          formError: "This fund is not open for payment today.",
        };
      }
      if (error.message === "FUND_NOT_ACTIVE") {
        return {
          success: false,
          formError: "This fund is no longer active.",
        };
      }
      if (error.message === "AMOUNT_BELOW_TARGET") {
        return {
          success: false,
          fieldErrors: {
            amount: `Amount must be at least ${fund.targetAmount.toLocaleString()}.`,
          },
        };
      }
    }
    return {
      success: false,
      formError: "Unable to submit payment. Please try again.",
    };
  }
}
