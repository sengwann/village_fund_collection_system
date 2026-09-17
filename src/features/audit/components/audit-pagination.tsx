import Link from "next/link";

export function AuditPagination({
  basePath,
  currentPage,
  totalPages,
  baseQuery,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  baseQuery: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  function buildHref(page: number): string {
    const params = new URLSearchParams(baseQuery);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  const linkClass =
    "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100";
  const disabledClass =
    "rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400";

  return (
    <div className="flex items-center justify-between gap-3">
      {currentPage > 1 ? (
        <Link className={linkClass} href={buildHref(currentPage - 1)}>
          Previous
        </Link>
      ) : (
        <span className={disabledClass}>Previous</span>
      )}
      <p className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </p>
      {currentPage < totalPages ? (
        <Link className={linkClass} href={buildHref(currentPage + 1)}>
          Next
        </Link>
      ) : (
        <span className={disabledClass}>Next</span>
      )}
    </div>
  );
}
