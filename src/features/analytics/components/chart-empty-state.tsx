export function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
