export default function VillagesLoading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg bg-slate-200" />

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="h-7 w-24 animate-pulse rounded-full bg-slate-200"
            key={index}
          />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className="h-24 animate-pulse rounded-lg bg-slate-200"
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
