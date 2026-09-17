import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { DEFAULT_POST_LOGIN_ROUTE } from "@/lib/auth/auth.constants";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "Login | Village Fund Collection System",
};

type SearchParams = Record<string, string | string[] | undefined>;

async function resolveSearchParams(
  searchParams: unknown,
): Promise<SearchParams> {
  if (!searchParams) {
    return {};
  }

  const maybePromise = searchParams as {
    then?: unknown;
  };

  if (typeof maybePromise.then === "function") {
    return await (searchParams as Promise<SearchParams>);
  }

  return searchParams as SearchParams;
}

function getFirstStringValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: unknown;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect(DEFAULT_POST_LOGIN_ROUTE);
  }

  const params = await resolveSearchParams(searchParams);
  const registered = getFirstStringValue(params.registered) === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 space-y-1">
          <h1 className="text-lg font-semibold text-slate-900">
            Village Fund Collection System
          </h1>
          <p className="text-sm text-slate-600">Sign in to continue.</p>
        </div>

        {registered ? (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            Registration successful. Please sign in.
          </div>
        ) : null}

        <LoginForm />

        <p className="mt-4 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-slate-900 underline underline-offset-4"
            href="/signup"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
