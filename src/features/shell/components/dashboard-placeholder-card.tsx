import { EmptyState } from "../../../components/ui/empty-state";

export function DashboardPlaceholderCard({
  title,
  description,
  badge = "Soon",
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-slate-900">{title}</h2>

        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {badge}
        </span>
      </div>

      <EmptyState
        className="mt-3"
        description={description}
        title="Coming soon"
      />
    </div>
  );
}
