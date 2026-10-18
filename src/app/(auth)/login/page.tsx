import { redirect } from "next/navigation";
import { LoginScreen } from "@/features/auth/components/login-screen";
import { getCurrentUser } from "@/lib/auth/session";
import { getSafeRedirectPath } from "@/lib/auth/validators";

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

  const params = await resolveSearchParams(searchParams);
  // Only same-origin paths survive; anything else falls back to the default.
  const redirectTo = getSafeRedirectPath(getFirstStringValue(params.redirect));

  if (user) {
    redirect(redirectTo);
  }

  const registered = getFirstStringValue(params.registered) === "1";

  return <LoginScreen redirectTo={redirectTo} registered={registered} />;
}
