import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyKpayLoading() {
  return (
    <div aria-busy="true" className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-28 w-full rounded-xl" key={index} />
        ))}
      </div>
    </div>
  );
}
