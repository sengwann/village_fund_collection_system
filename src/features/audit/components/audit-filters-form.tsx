"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
function formatOptionLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());
}
const controlClass =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

export function AuditFiltersForm({
  basePath,
  actionTypeOptions,
  entityTypeOptions,
  entityTypesByAction,
  initialActionType,
  initialEntityType,
  initialDateFrom,
  initialDateTo,
  showEntityTypeFilter,
}: {
  basePath: string;
  actionTypeOptions: string[];
  entityTypeOptions: string[];
  entityTypesByAction: Record<string, string[]>;
  initialActionType: string;
  initialEntityType: string;
  initialDateFrom: string;
  initialDateTo: string;
  showEntityTypeFilter: boolean;
}) {
  const router = useRouter();
  const [actionType, setActionType] = useState(initialActionType);
  const [entityType, setEntityType] = useState(initialEntityType);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
  /* * Determine which entity types are available * for the currently selected action type. * * If no action type is selected, * show all entity types. */ const availableEntityTypes =
    actionType ? (entityTypesByAction[actionType] ?? []) : entityTypeOptions;
  /* * If the selected action type changes and the * current entity type is no longer valid, * clear the entity type. */ useEffect(() => {
    if (entityType && !availableEntityTypes.includes(entityType)) {
      setEntityType("");
    }
  }, [actionType, entityType, availableEntityTypes]);
  const hasActiveFilters = Boolean(
    initialActionType || initialEntityType || initialDateFrom || initialDateTo,
  );
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (actionType) {
      params.set("actionType", actionType);
    }
    if (entityType && showEntityTypeFilter) {
      params.set("entityType", entityType);
    }
    if (dateFrom) {
      params.set("dateFrom", dateFrom);
    }
    if (dateTo) {
      params.set("dateTo", dateTo);
    }
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }
  function handleReset() {
    setActionType("");
    setEntityType("");
    setDateFrom("");
    setDateTo("");
    router.push(basePath);
  }
  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      {" "}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {" "}
        {/* Action Type */}{" "}
        <div className="space-y-2">
          {" "}
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="actionType"
          >
            {" "}
            Action type{" "}
          </label>{" "}
          <select
            className={controlClass}
            id="actionType"
            onChange={(event) => setActionType(event.target.value)}
            value={actionType}
          >
            {" "}
            <option value="">All actions</option>{" "}
            {actionTypeOptions.map((option) => (
              <option key={option} value={option}>
                {" "}
                {formatOptionLabel(option)}{" "}
              </option>
            ))}{" "}
          </select>{" "}
        </div>{" "}
        {/* Entity Type */}{" "}
        {showEntityTypeFilter ? (
          <div className="space-y-2">
            {" "}
            <label
              className="block text-sm font-medium text-slate-900"
              htmlFor="entityType"
            >
              {" "}
              Entity type{" "}
            </label>{" "}
            <select
              className={controlClass}
              id="entityType"
              onChange={(event) => setEntityType(event.target.value)}
              value={entityType}
            >
              {" "}
              <option value="">All entities</option>{" "}
              {availableEntityTypes.map((option) => (
                <option key={option} value={option}>
                  {" "}
                  {formatOptionLabel(option)}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
        ) : null}{" "}
        {/* From Date */}{" "}
        <div className="space-y-2">
          {" "}
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="dateFrom"
          >
            {" "}
            From date{" "}
          </label>{" "}
          <input
            className={controlClass}
            id="dateFrom"
            onChange={(event) => setDateFrom(event.target.value)}
            type="date"
            value={dateFrom}
          />{" "}
        </div>{" "}
        {/* To Date */}{" "}
        <div className="space-y-2">
          {" "}
          <label
            className="block text-sm font-medium text-slate-900"
            htmlFor="dateTo"
          >
            {" "}
            To date{" "}
          </label>{" "}
          <input
            className={controlClass}
            id="dateTo"
            onChange={(event) => setDateTo(event.target.value)}
            type="date"
            value={dateTo}
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {" "}
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          type="submit"
        >
          {" "}
          Apply filters{" "}
        </button>{" "}
        {hasActiveFilters ? (
          <button
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            onClick={handleReset}
            type="button"
          >
            {" "}
            Reset{" "}
          </button>
        ) : null}{" "}
      </div>{" "}
    </form>
  );
}
