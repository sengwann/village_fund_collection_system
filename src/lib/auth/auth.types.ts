import type { MembershipStatus, UserRole } from "@prisma/client";

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  villageId: string | null;
  houseId: string | null;
  membershipStatus: MembershipStatus | null;
  email: string | null;
  phone: string | null;
  dateOfBirth: Date | null;
}

export type LoginFailureCode = "INVALID_CREDENTIALS" | "THROTTLED";

export type LoginResult =
  | {
      success: true;
      redirectTo: string;
    }
  | {
      success: false;
      code: "INVALID_CREDENTIALS";
      error: string;
    }
  | {
      success: false;
      code: "THROTTLED";
      error: string;
      retryAfterSeconds: number;
    };
