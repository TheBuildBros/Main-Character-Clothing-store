import type { ReactNode } from "react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Link, Redirect } from "wouter";
import { trpc } from "@/lib/trpc";

export function AdminGuard({ children }: { children: ReactNode }) {
  const meQuery = trpc.auth.me.useQuery();
  const user = meQuery.data;

  if (meQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div
          className="glass-card px-8 py-10 text-center max-w-sm w-full flex flex-col items-center gap-4"
          role="status"
          aria-live="polite"
        >
          <span
            className="w-8 h-8 rounded-full border-[3px] border-[#0057ff]/25 border-t-[#0057ff] animate-spin"
            aria-hidden="true"
          />
          <p className="font-display text-sm font-bold tracking-wide uppercase text-foreground m-0">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/account" />;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="glass-card px-6 sm:px-10 py-10 text-center max-w-md w-full space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#0057ff]/10 text-[#0057ff] dark:text-[#6cb8ff] flex items-center justify-center">
            <ShieldAlert size={26} />
          </div>
          <span className="eyebrow">RESTRICTED AREA</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight m-0">
            Admin access required
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed m-0">
            Your account does not have permission to view the admin panel.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="button-primary inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] focus-visible:ring-offset-2"
            >
              <ArrowLeft size={15} />
              <span>Back to store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
