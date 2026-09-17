export default function VerifyKpayLoading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="h-24 animate-pulse rounded-lg bg-slate-200"
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
