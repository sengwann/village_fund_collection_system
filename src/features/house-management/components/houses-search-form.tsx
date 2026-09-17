"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HouseStatusBadge } from "./house-status-badge";

interface House {
  id: string;
  houseNumber: string;
  isActive: boolean;
}

export function HousesSearchForm({ houses }: { houses: House[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const filteredHouses = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase();

    return houses.filter((house) => {
      const matchesQuery =
        !normalizedQuery ||
        house.houseNumber.toUpperCase().includes(normalizedQuery);

      const matchesStatus =
        status === "all" ||
        (status === "active" && house.isActive) ||
        (status === "inactive" && !house.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [houses, query, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search house number..."
          type="text"
          value={query}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "active", "inactive"] as const).map((value) => (
          <button
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              status === value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
            key={value}
            onClick={() => setStatus(value)}
            type="button"
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>

      {filteredHouses.length === 0 ? (
        <p className="text-sm text-slate-500">
          No houses match your search or filter.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredHouses.map((house) => (
            <Link
              className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
              href={`/village/houses/${house.id}`}
              key={house.id}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-slate-900">
                  {house.houseNumber}
                </p>

                <HouseStatusBadge isActive={house.isActive} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
