import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminEmployees from "@/pages/AdminEmployees";
import AdminLiveMap from "@/pages/AdminLiveMap";
import AdminTasks from "@/pages/AdminTasks";
import AdminReports from "@/pages/AdminReports";
import AdminSettings from "@/pages/AdminSettings";
import AdminVisits from "@/pages/AdminVisits";
import MobileHome from "@/pages/MobileHome";
import MobileTasks from "@/pages/MobileTasks";
import MobileVisit from "@/pages/MobileVisit";
import MobileTimeSheet from "@/pages/MobileTimeSheet";
import MobileProfile from "@/pages/MobileProfile";

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import Register from "@/pages/Register";

function ProtectedRoute({ component: Component, allowedRole }: { component: any, allowedRole?: "admin" | "employee" }) {
  const { isAuthenticated, isLoading, isAdmin, isEmployee } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (allowedRole === "admin" && !isAdmin) {
    setLocation("/app");
    return null;
  }

  if (allowedRole === "employee" && !isEmployee) {
    setLocation("/admin");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} allowedRole="admin" />} />
      <Route path="/admin/employees" component={() => <ProtectedRoute component={AdminEmployees} allowedRole="admin" />} />
      <Route path="/admin/map" component={() => <ProtectedRoute component={AdminLiveMap} allowedRole="admin" />} />
      <Route path="/admin/tasks" component={() => <ProtectedRoute component={AdminTasks} allowedRole="admin" />} />
      <Route path="/admin/visits" component={() => <ProtectedRoute component={AdminVisits} allowedRole="admin" />} />
      <Route path="/admin/reports" component={() => <ProtectedRoute component={AdminReports} allowedRole="admin" />} />
      <Route path="/admin/settings" component={() => <ProtectedRoute component={AdminSettings} allowedRole="admin" />} />
      
      {/* Mobile App Routes */}
      <Route path="/app" component={() => <ProtectedRoute component={MobileHome} allowedRole="employee" />} />
      <Route path="/app/tasks" component={() => <ProtectedRoute component={MobileTasks} allowedRole="employee" />} />
      <Route path="/app/visit" component={() => <ProtectedRoute component={MobileVisit} allowedRole="employee" />} />
      <Route path="/app/timesheet" component={() => <ProtectedRoute component={MobileTimeSheet} allowedRole="employee" />} />
      <Route path="/app/profile" component={() => <ProtectedRoute component={MobileProfile} allowedRole="employee" />} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
