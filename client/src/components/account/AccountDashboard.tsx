import { useState } from "react";
import {
  ArrowRight,
  Heart,
  KeyRound,
  LogOut,
  Package,
  Shield,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";
import { formatPrice, products, useStore } from "@/store/Storefront";

export type AccountDashboardUser = {
  name: string;
  email: string;
  phone: string | null;
  role: string;
  lastSignedIn: Date | string;
};

type SectionId = "profile" | "orders" | "wishlist" | "bag" | "security";

type AccountDashboardProps = {
  user: AccountDashboardUser;
  onChangePassword: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  logoutError: string;
};

function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] || trimmed;
}

function getUserInitial(fullName: string, email: string): string {
  const source = fullName.trim() || email.trim();
  return source ? source[0].toUpperCase() : "U";
}

function formatLastSignedIn(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const NAV_ITEMS: Array<{
  id: SectionId;
  label: string;
  icon: typeof UserRound;
}> = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "bag", label: "Bag", icon: ShoppingBag },
  { id: "security", label: "Security", icon: KeyRound },
];

export default function AccountDashboard({
  user,
  onChangePassword,
  onLogout,
  isLoggingOut,
  logoutError,
}: AccountDashboardProps) {
  const { count, favorites } = useStore();
  const [activeSection, setActiveSection] = useState<SectionId>("profile");

  const firstName = getFirstName(user.name);
  const initial = getUserInitial(user.name, user.email);
  const savedProducts = products.filter((product) =>
    favorites.includes(product.id)
  );
  const phoneDisplay = user.phone?.trim() ? user.phone.trim() : "Not added";
  const lastSignedInDisplay = formatLastSignedIn(user.lastSignedIn);

  const handleSelectSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const target = document.getElementById(`account-section-${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[var(--surface)] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumbs" className="breadcrumbs !mb-6">
          <Link
            href="/"
            className="hover:text-[var(--blue)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
          >
            HOME
          </Link>{" "}
          <span>/</span> YOUR ACCOUNT
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[296px_minmax(0,1fr)] items-start">
          {/* Left Panel: Greeting Header, Navigation List, and Log out */}
          <aside
            aria-label="Account profile and navigation"
            className="w-full lg:sticky lg:top-24 flex flex-col gap-4"
          >
            {/* Greeting Header Card */}
            <div className="w-full rounded-md border border-[var(--line)] bg-[var(--page)] p-5">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--blue)] text-white text-lg font-semibold select-none"
                >
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="eyebrow !mb-0.5">YOUR ACCOUNT</span>
                  <h1 className="font-['Playfair_Display',Georgia,serif] text-2xl font-medium tracking-[-0.03em] leading-tight text-[var(--text)] truncate">
                    Hi, {firstName}
                  </h1>
                  <p className="mt-0.5 text-xs text-[var(--muted)] truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation & Log Out Card */}
            <div className="w-full rounded-md border border-[var(--line)] bg-[var(--page)] overflow-hidden">
              <nav aria-label="Account sections" className="p-2">
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                    const isActive = activeSection === id;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => handleSelectSection(id)}
                          aria-current={isActive ? "location" : undefined}
                          className={`flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-left text-xs font-semibold transition-colors cursor-pointer border-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)] ${
                            isActive
                              ? "bg-[var(--surface)] text-[var(--blue)]"
                              : "bg-transparent text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--blue)]"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon size={16} aria-hidden="true" />
                            <span>{label}</span>
                          </span>
                          {id === "bag" && count > 0 && (
                            <span
                              aria-label={`${count} items in bag`}
                              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--blue)] px-1.5 text-[10px] font-semibold text-white"
                            >
                              {count}
                            </span>
                          )}
                          {id === "wishlist" && savedProducts.length > 0 && (
                            <span
                              aria-label={`${savedProducts.length} saved items`}
                              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--surface-2)] px-1.5 text-[10px] font-semibold text-[var(--text)]"
                            >
                              {savedProducts.length}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                  {user.role === "admin" && (
                    <li className="mt-1 border-t border-[var(--line)] pt-1">
                      <Link
                        href="/admin"
                        className="flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-xs font-semibold text-[var(--blue)] hover:bg-[var(--surface)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                      >
                        <span className="flex items-center gap-3">
                          <Shield size={16} aria-hidden="true" />
                          <span>Admin panel</span>
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>

              <div className="border-t border-[var(--line)] p-4 flex flex-col gap-3">
                {logoutError && (
                  <p className="form-alert error" role="alert">
                    {logoutError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  aria-label="Log out of your account"
                  className="button-primary auth-submit w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                >
                  {isLoggingOut ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut size={15} aria-hidden="true" />
                      <span>Log out</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>

          {/* Right Column: Section Cards */}
          <div className="flex min-w-0 flex-col gap-5">
            {/* a. Profile */}
            <section
              id="account-section-profile"
              aria-labelledby="account-heading-profile"
              className="w-full rounded-md border border-[var(--line)] bg-[var(--page)] p-5 sm:p-6 scroll-mt-24"
            >
              <div className="flex items-start gap-3.5 border-b border-[var(--line)] pb-4">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--blue)]"
                >
                  <UserRound size={18} />
                </div>
                <div className="min-w-0">
                  <h2
                    id="account-heading-profile"
                    className="font-['Playfair_Display',Georgia,serif] text-2xl font-medium tracking-[-0.03em] leading-tight text-[var(--text)] m-0"
                  >
                    Profile
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)] m-0">
                    Your personal details on file with Main Character.
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 m-0">
                <div className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Name
                  </dt>
                  <dd className="mt-1 ml-0 text-sm font-medium text-[var(--text)] break-words">
                    {user.name}
                  </dd>
                </div>

                <div className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Email
                  </dt>
                  <dd className="mt-1 ml-0 text-sm font-medium text-[var(--text)] break-all">
                    {user.email}
                  </dd>
                </div>

                <div className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Phone
                  </dt>
                  <dd className="mt-1 ml-0 text-sm font-medium text-[var(--text)]">
                    {phoneDisplay}
                  </dd>
                </div>

                <div className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Role
                  </dt>
                  <dd className="mt-1 ml-0 text-sm font-medium text-[var(--text)] capitalize">
                    {user.role}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs text-[var(--muted)] mb-0">
                Profile details are read-only for now. Editing will be available
                later.
              </p>
            </section>

            {/* b. Orders */}
            <section
              id="account-section-orders"
              aria-labelledby="account-heading-orders"
              className="w-full rounded-md border border-[var(--line)] bg-[var(--page)] p-5 sm:p-6 scroll-mt-24"
            >
              <div className="flex items-start gap-3.5 border-b border-[var(--line)] pb-4">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--blue)]"
                >
                  <Package size={18} />
                </div>
                <div className="min-w-0">
                  <h2
                    id="account-heading-orders"
                    className="font-['Playfair_Display',Georgia,serif] text-2xl font-medium tracking-[-0.03em] leading-tight text-[var(--text)] m-0"
                  >
                    Orders
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)] m-0">
                    Review your order history and delivery updates.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-md border border-[var(--line)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--text)] m-0">
                    No orders yet
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)] m-0">
                    Once you place an order, you can track its status here.
                  </p>
                </div>
                <Link
                  href="/collections"
                  className="button-primary rounded-md w-full sm:w-auto shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                >
                  <span>Continue shopping</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </section>

            {/* c. Wishlist */}
            <section
              id="account-section-wishlist"
              aria-labelledby="account-heading-wishlist"
              className="w-full rounded-md border border-[var(--line)] bg-[var(--page)] p-5 sm:p-6 scroll-mt-24"
            >
              <div className="flex items-start gap-3.5 border-b border-[var(--line)] pb-4">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--blue)]"
                >
                  <Heart size={18} />
                </div>
                <div className="min-w-0">
                  <h2
                    id="account-heading-wishlist"
                    className="font-['Playfair_Display',Georgia,serif] text-2xl font-medium tracking-[-0.03em] leading-tight text-[var(--text)] m-0"
                  >
                    Wishlist
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)] m-0">
                    Pieces you saved while exploring the collection.
                  </p>
                </div>
              </div>

              {savedProducts.length > 0 ? (
                <div className="mt-5 flex flex-col gap-4">
                  <p className="text-xs font-medium text-[var(--muted)] m-0">
                    {savedProducts.length}{" "}
                    {savedProducts.length === 1 ? "saved piece" : "saved pieces"}
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {savedProducts.slice(0, 4).map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center gap-3 rounded-md border border-[var(--line)] bg-[var(--surface)] p-3 hover:border-[var(--blue)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-11 shrink-0 rounded-sm object-cover bg-[var(--surface-2)]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[var(--text)] truncate m-0">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-[var(--muted)] mt-0.5 m-0">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--muted)]"
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/wishlist"
                      className="button-primary rounded-md w-full sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                    >
                      <span>View wishlist ({savedProducts.length})</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                    <Link
                      href="/collections"
                      className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-transparent px-4 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--blue)] hover:text-[var(--blue)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                    >
                      <span>Browse products</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-4 rounded-md border border-[var(--line)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)] m-0">
                      Your wishlist is empty
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)] m-0">
                      Save pieces you like so you can come back to them anytime.
                    </p>
                  </div>
                  <Link
                    href="/collections"
                    className="button-primary rounded-md w-full sm:w-auto shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                  >
                    <span>Browse products</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>

            {/* d. Bag */}
            <section
              id="account-section-bag"
              aria-labelledby="account-heading-bag"
              className="w-full rounded-md border border-[var(--line)] bg-[var(--page)] p-5 sm:p-6 scroll-mt-24"
            >
              <div className="flex items-start gap-3.5 border-b border-[var(--line)] pb-4">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--blue)]"
                >
                  <ShoppingBag size={18} />
                </div>
                <div className="min-w-0">
                  <h2
                    id="account-heading-bag"
                    className="font-['Playfair_Display',Georgia,serif] text-2xl font-medium tracking-[-0.03em] leading-tight text-[var(--text)] m-0"
                  >
                    Bag
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)] m-0">
                    Jump back to the pieces waiting in your shopping bag.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-md border border-[var(--line)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--text)] m-0">
                    {count === 0
                      ? "0 items in your bag"
                      : `${count} ${count === 1 ? "item" : "items"} in your bag`}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)] m-0">
                    {count === 0
                      ? "Add items from the store to see them here."
                      : "Review quantities, sizes, and order summary."}
                  </p>
                </div>
                <Link
                  href="/bag"
                  className="button-primary rounded-md w-full sm:w-auto shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                >
                  <span>{count > 0 ? `Open bag (${count})` : "Open bag"}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </section>

            {/* e. Security */}
            <section
              id="account-section-security"
              aria-labelledby="account-heading-security"
              className="w-full rounded-md border border-[var(--line)] bg-[var(--page)] p-5 sm:p-6 scroll-mt-24"
            >
              <div className="flex items-start gap-3.5 border-b border-[var(--line)] pb-4">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--blue)]"
                >
                  <KeyRound size={18} />
                </div>
                <div className="min-w-0">
                  <h2
                    id="account-heading-security"
                    className="font-['Playfair_Display',Georgia,serif] text-2xl font-medium tracking-[-0.03em] leading-tight text-[var(--text)] m-0"
                  >
                    Security
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)] m-0">
                    Keep your password updated and review your latest sign-in.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-md border border-[var(--line)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)] m-0">
                    Last sign-in
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--text)] m-0">
                    {lastSignedInDisplay}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onChangePassword}
                  className="inline-flex min-h-[44px] w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-md border border-[var(--blue)] bg-transparent px-4 text-xs font-semibold text-[var(--blue)] transition-colors hover:bg-[var(--blue)] hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                >
                  <KeyRound size={15} aria-hidden="true" />
                  <span>Change password</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
