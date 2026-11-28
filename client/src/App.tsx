import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { AdminGuard } from "./components/admin/AdminGuard";
import { AdminLayout } from "./components/admin/AdminLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import Account from "./pages/Account";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import Bag from "./pages/Bag";
import Collections from "./pages/Collections";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import { StoreLayout, StoreProvider } from "./store/Storefront";

function AdminRoutes() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products">
            {() => <AdminPlaceholder title="Products" />}
          </Route>
          <Route path="/admin/orders">
            {() => <AdminPlaceholder title="Orders" />}
          </Route>
          <Route path="/admin/customers" component={AdminCustomers} />
          <Route path="/admin/inventory">
            {() => <AdminPlaceholder title="Inventory" />}
          </Route>
          <Route path="/admin/collections">
            {() => <AdminPlaceholder title="Collections" />}
          </Route>
          <Route path="/admin/settings">
            {() => <AdminPlaceholder title="Settings" />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    </AdminGuard>
  );
}

function Router() {
  const [location] = useLocation();

  if (location === "/admin" || location.startsWith("/admin/")) {
    return <AdminRoutes />;
  }

  return (
    <StoreLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/collections" component={Collections} />
        <Route path="/shop/:category" component={Collections} />
        <Route path="/limited/:tag" component={Collections} />
        <Route path="/contact" component={Contact} />
        <Route path="/bag" component={Bag} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/account" component={Account} />
        <Route path="/product/:id" component={Product} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </StoreLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}
