import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Account from "./pages/Account";
import Bag from "./pages/Bag";
import Collections from "./pages/Collections";
import Home from "./pages/Home";
import Product from "./pages/Product";
import { StoreLayout, StoreProvider } from "./store/Storefront";

function Router() {
  return <StoreLayout><Switch>
    <Route path="/" component={Home} />
    <Route path="/collections" component={Collections} />
    <Route path="/shop/:category" component={Collections} />
    <Route path="/limited/:tag" component={Collections} />
    <Route path="/bag" component={Bag} />
    <Route path="/account" component={Account} />
    <Route path="/product/:id" component={Product} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></StoreLayout>;
}
export default function App() {
  return <ErrorBoundary><StoreProvider><TooltipProvider><Toaster /><Router /></TooltipProvider></StoreProvider></ErrorBoundary>;
}
