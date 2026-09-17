import "server-only";
import { PaymentStatus } from "@prisma/client";
import { DisputeStatus } from "@prisma/client";

export function isBlockingPaymentStatus(status: PaymentStatus): boolean {
  return status === PaymentStatus.ACCEPTED || status === PaymentStatus.PENDING;
}

export function canSubmitPayment(hasBlockingPayment: boolean): {
  allowed: boolean;
  reason?: string;
} {
  if (hasBlockingPayment) {
    return {
      allowed: false,
      reason:
        "A valid or pending payment already exists for this fund and house. You cannot submit another payment.",
    };
  }
  return { allowed: true };
}

/**
 * Determines whether a villager can raise a new dispute for a payment.
 * Disputes with OPEN, UNDER_REVIEW, or RESOLVED status block new disputes.
 * REJECTED disputes (where the dispute itself was rejected) allow re-disputing.
 */
export function canRaiseDispute(
  existingDisputeStatuses: DisputeStatus[],
): boolean {
  return !existingDisputeStatuses.some(
    (status) =>
      status === DisputeStatus.OPEN ||
      status === DisputeStatus.UNDER_REVIEW ||
      status === DisputeStatus.RESOLVED,
  );
}
