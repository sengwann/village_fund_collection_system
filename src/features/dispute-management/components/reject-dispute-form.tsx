"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition, FormEvent } from "react";
import { rejectDisputeAction } from "../actions/reject-dispute.action";

export function RejectDisputeForm({ disputeId }: { disputeId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await rejectDisputeAction(formData);
      if (result.success) {
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setError(result.error ?? "Failed.");
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="disputeId" type="hidden" value={disputeId} />
      <textarea
        name="resolutionNote"
        rows={3}
        placeholder="Why is the original rejection upheld?"
        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      {fieldErrors.resolutionNote && (
        <p className="text-xs text-red-600">{fieldErrors.resolutionNote}</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-100 disabled:opacity-60"
      >
        {isPending ? "Rejecting..." : "Reject Dispute (Uphold Rejection)"}
      </button>
    </form>
  );
}
