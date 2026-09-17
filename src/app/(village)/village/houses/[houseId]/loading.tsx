export default function HouseDetailLoading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-40 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
