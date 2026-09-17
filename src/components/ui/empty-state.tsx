import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-600 dark:bg-slate-800/50 ${className}`}
    >
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
