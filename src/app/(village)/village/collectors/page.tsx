import { MembershipStatus } from "@prisma/client";
import { EmptyState } from "@/components/ui/empty-state";
import { AssignCollectorForm } from "@/features/collector-assignment/components/assign-collector-form";
import { CollectorAssignmentStatusBadge } from "@/features/collector-assignment/components/collector-assignment-status-badge";
import { deactivateCollectorAssignmentAction } from "@/features/collector-assignment/actions/deactivate-collector-assignment.action";
import { canDeactivateAssignment } from "@/features/collector-assignment/lib/collector-assignment-rules";
import { getCurrentPeriod, requireChief } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Collector Assignments | Village Fund Collection System",
};

function formatPeriod(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export default async function CollectorsPage() {
  const { villageId } = await requireChief();
  const currentPeriod = getCurrentPeriod();

  const currentActiveAssignment = await prisma.collectorAssignment.findFirst({
    where: {
      villageId,
      year: currentPeriod.year,
      month: currentPeriod.month,
      isActive: true,
    },
    select: {
      id: true,
      isActive: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const assignments = await prisma.collectorAssignment.findMany({
    where: {
      villageId,
    },
    orderBy: [{ year: "desc" }, { month: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      year: true,
      month: true,
      isActive: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const eligibleUsers = await prisma.user.findMany({
    where: {
      villageId,
      membershipStatus: MembershipStatus.ACTIVE,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          Collector Assignments
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Assign monthly Collectors for your village.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Current Period</h2>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {formatPeriod(currentPeriod.year, currentPeriod.month)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {currentActiveAssignment
                ? `Active Collector: ${currentActiveAssignment.user.name}`
                : "No active Collector"}
            </p>
          </div>
          {currentActiveAssignment ? (
            <CollectorAssignmentStatusBadge isActive={true} />
          ) : (
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              Unassigned
            </span>
          )}
        </div>
      </div>

      <AssignCollectorForm
        currentYear={currentPeriod.year}
        eligibleUsers={eligibleUsers}
      />

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">
          Assignment History
        </h2>

        {assignments.length === 0 ? (
          <EmptyState
            className="mt-3"
            description="No collector assignments have been created yet."
            title="No assignments"
          />
        ) : (
          <div className="mt-3 space-y-3">
            {assignments.map((assignment) => (
              <div
                className="rounded-md border border-slate-200 p-3"
                key={assignment.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {assignment.user.name}
                    </p>
                    <p className="truncate text-xs text-slate-600">
                      Period: {formatPeriod(assignment.year, assignment.month)}
                    </p>
                  </div>
                  <CollectorAssignmentStatusBadge
                    isActive={assignment.isActive}
                  />
                </div>

                {canDeactivateAssignment(assignment.isActive) ? (
                  <form
                    action={deactivateCollectorAssignmentAction}
                    className="mt-3"
                  >
                    <input
                      name="assignmentId"
                      type="hidden"
                      value={assignment.id}
                    />
                    <button
                      className="w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100"
                      type="submit"
                    >
                      Deactivate
                    </button>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
