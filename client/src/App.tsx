import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Scan from "@/pages/scan";
import History from "@/pages/history";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import { UserProvider } from "@/contexts/UserContext";

// Optional: Import any API config or context if needed in future
// import { ApiProvider } from "@/lib/api-context"; 

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scan" component={Scan} />
      <Route path="/history" component={History} />
      <Route path="/about" component={About} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;
