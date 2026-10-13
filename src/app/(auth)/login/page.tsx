import { redirect } from "next/navigation";
import { LoginScreen } from "@/features/auth/components/login-screen";
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

  return <LoginScreen registered={registered} />;
}
