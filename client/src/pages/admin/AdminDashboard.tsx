import { ArrowRight, ShieldCheck, UserPlus, Users } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const overviewQuery = trpc.admin.overview.useQuery();

  const kpis = overviewQuery.data
    ? [
        {
          label: "Total users",
          value: overviewQuery.data.totalUsers,
          description: "All registered customer and staff accounts.",
          icon: Users,
        },
        {
          label: "Admin users",
          value: overviewQuery.data.adminUsers,
          description: "Accounts with access to this admin panel.",
          icon: ShieldCheck,
        },
        {
          label: "New users (last 7 days)",
          value: overviewQuery.data.newUsersLast7Days,
          description: "Accounts created within the past 7 days.",
          icon: UserPlus,
        },
      ]
    : [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <span className="eyebrow">OVERVIEW</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-1 mb-1">
          Storefront summary
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground m-0">
          Live account metrics from your database.
        </p>
      </div>

      {overviewQuery.isError && (
        <div className="form-alert error" role="alert">
          {overviewQuery.error.message.split("\n")[0] ||
            "Unable to load admin overview."}
        </div>
      )}

      {overviewQuery.isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          aria-label="Loading overview metrics"
        >
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="glass-card p-6 space-y-4">
              <div className="skeleton-line short !mt-0" />
              <div className="skeleton-line !h-10 !w-24" />
              <div className="skeleton-line !w-4/5" />
            </div>
          ))}
        </div>
      ) : (
        overviewQuery.data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="glass-card p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {kpi.label}
                    </span>
                    <span className="w-9 h-9 rounded-full bg-[#0057ff]/10 text-[#0057ff] dark:text-[#6cb8ff] flex items-center justify-center">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                  </div>
                  <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground m-0">
                    {kpi.value.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed m-0">
                    {kpi.description}
                  </p>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Customers Directory Quick Card */}
      <div className="glass-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="eyebrow">DIRECTORY</span>
          <h3 className="font-display text-xl font-bold tracking-tight m-0">
            Customers
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground m-0">
            Search registered customer accounts, roles, and recent sign-ins.
          </p>
        </div>
        <Link
          href="/admin/customers"
          className="button-primary shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] focus-visible:ring-offset-2"
        >
          <span>View customers</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
