import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentVerificationLoading() {
  return (
    <div aria-busy="true" className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
