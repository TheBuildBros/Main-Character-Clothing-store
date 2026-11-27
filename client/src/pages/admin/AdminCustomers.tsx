import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminCustomers() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const usersQuery = trpc.admin.listUsers.useQuery({
    search: debouncedSearch || undefined,
    limit: 50,
  });

  const rows = usersQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="eyebrow">DIRECTORY</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-1 mb-1">
            Customers
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground m-0">
            Search accounts by name or email.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <label htmlFor="admin-customer-search" className="sr-only">
            Search customers by name or email
          </label>
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            id="admin-customer-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email..."
            className="field-input pl-10 pr-9"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear customer search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff]"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {usersQuery.isError && (
        <div className="form-alert error" role="alert">
          {usersQuery.error.message.split("\n")[0] ||
            "Unable to load customer accounts."}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[#0057ff]/[0.04]">
                <th className="py-3.5 px-4 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Name
                </th>
                <th className="py-3.5 px-4 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="py-3.5 px-4 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Phone
                </th>
                <th className="py-3.5 px-4 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Role
                </th>
                <th className="py-3.5 px-4 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Last sign-in
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {usersQuery.isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="py-4 px-4" colSpan={5}>
                      <div className="skeleton-line !mt-0 !w-full" />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 px-4 text-center text-muted-foreground text-sm"
                  >
                    {debouncedSearch
                      ? `No accounts matching "${debouncedSearch}".`
                      : "No customer accounts yet."}
                  </td>
                </tr>
              ) : (
                rows.map((account) => (
                  <tr
                    key={account.email}
                    className="hover:bg-[#0057ff]/[0.03] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                      {account.name}
                    </td>
                    <td className="py-3.5 px-4 text-foreground/90 whitespace-nowrap">
                      {account.email}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {account.phone?.trim() ? account.phone : "Not added"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-display text-[10px] font-bold uppercase tracking-wider ${
                          account.role === "admin"
                            ? "bg-gradient-to-r from-[#0047ff] to-[#0095ff] text-white"
                            : "bg-[#0057ff]/10 text-[#0057ff] dark:text-[#6cb8ff]"
                        }`}
                      >
                        {account.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(account.lastSignedIn)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
