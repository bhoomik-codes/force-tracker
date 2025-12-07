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
import MobileHome from "@/pages/MobileHome";
import MobileTasks from "@/pages/MobileTasks";
import MobileVisit from "@/pages/MobileVisit";
import MobileTimeSheet from "@/pages/MobileTimeSheet";
import MobileProfile from "@/pages/MobileProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/employees" component={AdminEmployees} />
      <Route path="/admin/map" component={AdminLiveMap} />
      <Route path="/admin/tasks" component={AdminTasks} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/settings" component={AdminSettings} />
      
      {/* Mobile App Routes */}
      <Route path="/app" component={MobileHome} />
      <Route path="/app/tasks" component={MobileTasks} />
      <Route path="/app/visit" component={MobileVisit} />
      <Route path="/app/timesheet" component={MobileTimeSheet} />
      <Route path="/app/profile" component={MobileProfile} />
      
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
