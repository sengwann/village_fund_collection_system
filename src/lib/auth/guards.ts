import "server-only";

import { redirect } from "next/navigation";

import { LOGIN_ROUTE } from "./auth.constants";
import { getCurrentUser } from "./session";
import type { SessionUser } from "./auth.types";

export async function requireAuthenticatedUser(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    return redirect(LOGIN_ROUTE);
  }

  return user;
}
