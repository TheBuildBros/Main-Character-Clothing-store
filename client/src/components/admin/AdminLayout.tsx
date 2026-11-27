import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  Boxes,
  Layers,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { trpc } from "@/lib/trpc";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Collections", href: "/admin/collections", icon: Layers },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function getPageTitle(pathname: string): string {
  const clean = pathname.replace(/\/$/, "") || "/admin";
  const match = ADMIN_NAV_ITEMS.find((item) => item.href === clean);
  return match ? match.label : "Admin";
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const clean = pathname.replace(/\/$/, "") || "/admin";

  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-1 px-3 py-4">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = clean === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] focus-visible:ring-offset-2 ${
              isActive
                ? "bg-gradient-to-r from-[#0047ff] to-[#0095ff] text-white shadow-[0_8px_20px_rgba(0,87,255,0.28)]"
                : "text-foreground/80 hover:text-[#0057ff] dark:hover:text-[#6cb8ff] hover:bg-[#0057ff]/8"
            }`}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const meQuery = trpc.auth.me.useQuery();
  const adminName = meQuery.data?.name || "Admin";
  const pageTitle = getPageTitle(location);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-[#0057ff]/15 bg-white/85 dark:bg-[#051029]/90 backdrop-blur-xl">
        <div className="h-16 px-5 border-b border-[#0057ff]/15 flex items-center justify-between gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] rounded-md"
            aria-label="主人公 STUDIO Admin home"
          >
            <span className="brand-wordmark text-base font-extrabold" lang="ja">
              主人公
            </span>
            <span className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
              STUDIO
            </span>
          </Link>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-display font-bold uppercase tracking-widest bg-[#0057ff]/12 text-[#0057ff] dark:text-[#6cb8ff] border border-[#0057ff]/20">
            Admin
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarNav pathname={location} />
        </div>

        <div className="p-4 border-t border-[#0057ff]/15">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider text-muted-foreground hover:text-[#0057ff] dark:hover:text-[#6cb8ff] hover:bg-[#0057ff]/8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Back to store</span>
          </Link>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-10 bg-white/90 dark:bg-[#051029]/90 backdrop-blur-xl border-b border-[#0057ff]/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Drawer */}
            <div className="md:hidden">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open admin navigation menu"
                    className="w-10 h-10 rounded-full inline-flex items-center justify-center bg-white/80 dark:bg-white/10 border border-[#0057ff]/20 text-foreground hover:text-[#0057ff] dark:hover:text-[#6cb8ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] focus-visible:ring-offset-2"
                  >
                    <Menu size={19} aria-hidden="true" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="p-0 w-[82%] max-w-xs bg-white/95 dark:bg-[#051029]/95 backdrop-blur-2xl border-r border-[#0057ff]/20"
                >
                  <SheetHeader className="h-16 px-5 border-b border-[#0057ff]/15 flex-row items-center justify-between space-y-0">
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <span className="brand-wordmark font-extrabold" lang="ja">
                        主人公
                      </span>
                      <span className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                        STUDIO
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-display font-bold uppercase tracking-widest bg-[#0057ff]/12 text-[#0057ff] dark:text-[#6cb8ff]">
                        Admin
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto">
                    <SidebarNav
                      pathname={location}
                      onNavigate={() => setMobileNavOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight truncate m-0">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground">
              {adminName}
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#0057ff]/20 bg-white/80 dark:bg-white/10 font-display text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-[#0057ff] hover:text-[#0057ff] dark:hover:text-[#6cb8ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] focus-visible:ring-offset-2"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Back to store</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
