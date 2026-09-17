import { Phone } from "lucide-react";

export function ChiefContactCard({
  chiefName,
  chiefPhone,
}: {
  chiefName: string | null;
  chiefPhone: string | null;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-medium text-slate-900">Village Chief</h2>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Name</dt>
          <dd className="text-slate-900">{chiefName ?? "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-medium text-slate-700">Phone</dt>
          <dd className="text-slate-900">{chiefPhone ?? "—"}</dd>
        </div>
      </dl>
      {chiefPhone ? (
        <a
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          href={`tel:${chiefPhone}`}
        >
          <Phone aria-hidden className="h-4 w-4" />
          Call Chief
        </a>
      ) : null}
    </div>
  );
}
