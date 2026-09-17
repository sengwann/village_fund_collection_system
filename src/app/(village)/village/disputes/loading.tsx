export default function DisputesLoading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-7 w-24 animate-pulse rounded-full bg-slate-200"
          />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
