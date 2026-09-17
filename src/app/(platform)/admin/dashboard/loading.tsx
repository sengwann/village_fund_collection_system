export default function AdminDashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg bg-slate-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="h-40 animate-pulse rounded-lg bg-slate-200"
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
