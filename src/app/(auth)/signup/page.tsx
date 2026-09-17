import Link from "next/link";
import { redirect } from "next/navigation";
import { VillageCodeForm } from "@/features/villager-registration/components/village-code-form";
import { DEFAULT_POST_LOGIN_ROUTE } from "@/lib/auth/auth.constants";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "Sign Up | Village Fund Collection System",
};

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(DEFAULT_POST_LOGIN_ROUTE);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 space-y-1">
          <h1 className="text-lg font-semibold text-slate-900">
            Villager registration
          </h1>
          <p className="text-sm text-slate-600">
            Enter your village code to continue.
          </p>
        </div>

        <VillageCodeForm />

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            className="font-medium text-slate-900 underline underline-offset-4"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
