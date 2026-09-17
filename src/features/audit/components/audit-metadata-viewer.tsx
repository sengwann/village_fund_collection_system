function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export function AuditMetadataViewer({ metadata }: { metadata: unknown }) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return <p className="text-sm text-slate-500">No additional details.</p>;
  }

  const entries = Object.entries(metadata as Record<string, unknown>);
  if (entries.length === 0) {
    return <p className="text-sm text-slate-500">No additional details.</p>;
  }

  return (
    <dl className="space-y-2 text-sm">
      {entries.map(([key, value]) => (
        <div className="flex items-start justify-between gap-3" key={key}>
          <dt className="shrink-0 font-medium text-slate-700">
            {formatKey(key)}
          </dt>
          <dd className="break-all text-right text-slate-900">
            {formatValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
