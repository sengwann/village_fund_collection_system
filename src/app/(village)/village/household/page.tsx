import { MembershipStatus } from "@prisma/client";
import { EmptyState } from "../../../../components/ui/empty-state";
import { approveMemberAction } from "../../../../features/household-management/actions/approve-member.action";
import { changeHeadAction } from "../../../../features/household-management/actions/change-head.action";
import { rejectMemberAction } from "../../../../features/household-management/actions/reject-member.action";
import { removeMemberAction } from "../../../../features/household-management/actions/remove-member.action";
import { MembershipStatusBadge } from "../../../../features/household-management/components/membership-status-badge";
import { requireHouseholdManagementAccess } from "../../../../features/household-management/lib/household-access";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Household Members | Village Fund Collection System",
};

export default async function HouseholdPage() {
  const { house } = await requireHouseholdManagementAccess();

  const members = await prisma.user.findMany({
    where: {
      houseId: house.id,
    },
    select: {
      id: true,
      name: true,
      role: true,
      membershipStatus: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const currentHead = members.find(
    (member) => member.id === house.headOfHouseId,
  );

  const pendingMembers = members.filter(
    (member) => member.membershipStatus === MembershipStatus.PENDING,
  );

  const activeMembers = members.filter(
    (member) => member.membershipStatus === MembershipStatus.ACTIVE,
  );

  const historicalMembers = members.filter(
    (member) =>
      member.membershipStatus === MembershipStatus.REJECTED ||
      member.membershipStatus === MembershipStatus.REMOVED,
  );

  const changeHeadCandidates = activeMembers.filter(
    (member) => member.id !== house.headOfHouseId,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          Household members
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage membership for House {house.houseNumber}.
        </p>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="font-medium text-slate-700">Current Head</dt>
            <dd className="mt-1 text-slate-900">
              {currentHead ? currentHead.name : "—"}
            </dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="font-medium text-slate-700">Active Members</dt>
            <dd className="mt-1 text-slate-900">{activeMembers.length}</dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="font-medium text-slate-700">Pending Requests</dt>
            <dd className="mt-1 text-slate-900">{pendingMembers.length}</dd>
          </div>
        </dl>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Pending membership requests
        </h2>

        {pendingMembers.length === 0 ? (
          <EmptyState
            className="mt-3"
            description="There are no pending membership requests for this house."
            title="No pending requests"
          />
        ) : (
          <div className="mt-3 space-y-3">
            {pendingMembers.map((member) => (
              <div
                className="rounded-md border border-slate-200 p-3"
                key={member.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-slate-600">
                      {member.role}
                    </p>
                  </div>
                  <MembershipStatusBadge status={member.membershipStatus} />
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <form action={approveMemberAction} className="flex-1">
                    <input name="memberId" type="hidden" value={member.id} />
                    <button
                      className="w-full rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100"
                      type="submit"
                    >
                      Approve
                    </button>
                  </form>

                  <form action={rejectMemberAction} className="flex-1">
                    <input name="memberId" type="hidden" value={member.id} />
                    <button
                      className="w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100"
                      type="submit"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Active members</h2>

        {activeMembers.length === 0 ? (
          <EmptyState
            className="mt-3"
            description="There are no active members in this house."
            title="No active members"
          />
        ) : (
          <div className="mt-3 space-y-3">
            {activeMembers.map((member) => {
              const isCurrentHead = member.id === house.headOfHouseId;

              return (
                <div
                  className="rounded-md border border-slate-200 p-3"
                  key={member.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {member.name}
                        {isCurrentHead ? " · Head of House" : ""}
                      </p>
                      <p className="truncate text-xs text-slate-600">
                        {member.role}
                      </p>
                    </div>
                    <MembershipStatusBadge status={member.membershipStatus} />
                  </div>

                  {isCurrentHead ? (
                    <p className="mt-3 text-xs text-slate-600">
                      The current Head of House cannot be removed directly.
                      Transfer head responsibility first.
                    </p>
                  ) : (
                    <form action={removeMemberAction} className="mt-3">
                      <input name="memberId" type="hidden" value={member.id} />
                      <button
                        className="w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100"
                        type="submit"
                      >
                        Remove member
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Change Head of House
        </h2>

        {changeHeadCandidates.length === 0 ? (
          <EmptyState
            className="mt-3"
            description="Only active members who are not the current head can become the new Head of House."
            title="No eligible members"
          />
        ) : (
          <form action={changeHeadAction} className="mt-3 space-y-3">
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-slate-900"
                htmlFor="targetUserId"
              >
                Select new Head of House
              </label>
              <select
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                defaultValue=""
                id="targetUserId"
                name="targetUserId"
              >
                <option disabled value="">
                  Select an active member
                </option>
                {changeHeadCandidates.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              type="submit"
            >
              Change Head of House
            </button>

            <p className="text-xs text-slate-600">
              This immediately transfers household head responsibility. The
              previous head remains an active member.
            </p>
          </form>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Historical membership
        </h2>

        {historicalMembers.length === 0 ? (
          <EmptyState
            className="mt-3"
            description="There are no rejected or removed members in this house."
            title="No historical records"
          />
        ) : (
          <div className="mt-3 space-y-3">
            {historicalMembers.map((member) => (
              <div
                className="rounded-md border border-slate-200 p-3"
                key={member.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-slate-600">
                      {member.role}
                    </p>
                  </div>
                  <MembershipStatusBadge status={member.membershipStatus} />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs text-slate-600">
          Rejected and removed membership states are preserved as lifecycle
          history. They cannot be directly changed back to active. A new join
          request is required if the person wants to join the household again.
        </p>
      </section>
    </div>
  );
}
