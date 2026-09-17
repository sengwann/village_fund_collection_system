import type { ReactNode } from "react";
import { MembershipStatus } from "@prisma/client";
import type { SessionUser } from "../../../lib/auth/auth.types";
import type { ShellNavigation } from "../lib/navigation";
import { AppHeader } from "./app-header";
import { MobileBottomNavigation } from "./mobile-bottom-navigation";
import { PendingMembershipBanner } from "./pending-membership-banner";
import { ShellUserSummary } from "./shell-user-summary";
import { SidebarNavigation } from "./sidebar-navigation";

export function AppShell({
  user,
  navigation,
  variant,
  children,
}: {
  user: SessionUser;
  navigation: ShellNavigation;
  variant: "platform" | "village";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader user={user} variant={variant} />
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:pb-10">
        <div className="flex items-start gap-6">
          <div className="hidden w-56 shrink-0 md:block">
            <ShellUserSummary user={user} variant={variant} />
            <SidebarNavigation items={navigation.sidebarItems} />
          </div>
          <main className="w-full space-y-6">
            {variant === "village" &&
            user.membershipStatus === MembershipStatus.PENDING ? (
              <PendingMembershipBanner />
            ) : null}
            {children}
          </main>
        </div>
      </div>
      <MobileBottomNavigation items={navigation.mobileItems} />
    </div>
  );
}
