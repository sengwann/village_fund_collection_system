import "server-only";
import { DisputeStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

export function canCreateDispute(
  paymentStatus: PaymentStatus,
  paymentMethod: PaymentMethod,
): boolean {
  return (
    paymentStatus === PaymentStatus.REJECTED &&
    paymentMethod === PaymentMethod.KPAY
  );
}

export function canStartReview(status: DisputeStatus): boolean {
  return status === DisputeStatus.OPEN;
}

export function canResolveOrReject(status: DisputeStatus): boolean {
  return status === DisputeStatus.UNDER_REVIEW;
}

export function formatDisputeStatus(status: DisputeStatus): string {
  return status.replace(/_/g, " ");
}
