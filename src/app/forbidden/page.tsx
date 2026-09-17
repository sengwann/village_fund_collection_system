import Link from "next/link";

export const metadata = {
  title: "Forbidden | Village Fund Collection System",
};

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Forbidden</h1>

        <p className="mt-2 text-sm text-slate-600">
          You do not have permission to access this page.
        </p>

        <Link
          className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          href="/dashboard"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
