"use client";

import Link from "next/link";

interface EditHouseLinkProps {
  houseId: string;
  editRules: {
    allowed: boolean;
    reason?: string;
  };
}

export function EditHouseLink({ houseId, editRules }: EditHouseLinkProps) {
  return (
    <div className="space-y-2">
      <Link
        className={`block w-full rounded-md border px-4 py-2 text-center text-sm font-medium transition ${
          editRules.allowed
            ? "border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
            : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
        }`}
        href={editRules.allowed ? `/village/houses/${houseId}/edit` : "#"}
        aria-disabled={!editRules.allowed}
        onClick={(e) => {
          if (!editRules.allowed) {
            e.preventDefault();
          }
        }}
        title={editRules.reason}
      >
        Edit house number
      </Link>
      {!editRules.allowed && editRules.reason ? (
        <p className="text-xs text-slate-600">{editRules.reason}</p>
      ) : null}
    </div>
  );
}
