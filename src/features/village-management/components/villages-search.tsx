"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { VillageStatus } from "@prisma/client";
import { VillageStatusBadge } from "@/features/village-management/components/village-status-badge";

interface Village {
  id: string;
  villageCode: string;
  name: string;
  status: VillageStatus;
  createdAt: Date;
}

type StatusFilter = "ALL" | VillageStatus;

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

export function VillagesSearch({ villages }: { villages: Village[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const filteredVillages = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase();

    return villages.filter((village) => {
      const matchesQuery =
        !normalizedQuery ||
        village.villageCode.toUpperCase().includes(normalizedQuery) ||
        village.name.toUpperCase().includes(normalizedQuery);

      const matchesStatus = status === "ALL" || village.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [villages, query, status]);

  const filters: {
    label: string;
    value: StatusFilter;
  }[] = [
    {
      label: "All",
      value: "ALL",
    },
    {
      label: "Active",
      value: VillageStatus.ACTIVE,
    },
    {
      label: "Suspended",
      value: VillageStatus.SUSPENDED,
    },
    {
      label: "Deactivated",
      value: VillageStatus.DEACTIVATED,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search village code or name..."
          type="search"
          value={query}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              status === filter.value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
            key={filter.value}
            onClick={() => setStatus(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredVillages.length === 0 ? (
        <EmptyState
          description="No villages match your search or filter."
          title="No villages found"
        />
      ) : (
        <div className="space-y-3">
          {filteredVillages.map((village) => (
            <Link
              className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
              href={`/admin/villages/${village.id}`}
              key={village.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {village.villageCode}
                  </p>

                  <p className="truncate text-xs text-slate-600">
                    {village.name}
                  </p>
                </div>

                <VillageStatusBadge status={village.status} />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Created {formatDate(village.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
