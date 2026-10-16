import { Skeleton } from "@/components/ui/skeleton";

export default function PayLoading() {
  return (
    <div
      aria-busy="true"
      className="mx-auto w-full max-w-5xl space-y-6"
      role="status"
    >
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
        <div className="space-y-6 lg:col-span-2">
          {/* Fund card */}
          <Skeleton className="h-72 w-full rounded-xl" />
          {/* How to pay */}
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
        <div className="space-y-4 lg:col-span-3">
          {/* Amount + details form */}
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>

      {/* History */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}
