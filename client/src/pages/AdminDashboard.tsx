import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MapWidget } from "@/components/widgets/MapWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Users, CheckCircle2, Clock, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalVisitsToday: number;
  totalTasksCompleted: number;
  totalTasksPending: number;
}

interface RecentActivity {
  id: string;
  name: string;
  type: string;
  location: string;
  time: string;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats/dashboard"],
  });

  const attendancePercent = stats
    ? Math.round((stats.activeEmployees / (stats.totalEmployees || 1)) * 100)
    : 0;

  return (
    <AdminLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Total Workforce"
          value={isLoading ? "—" : stats?.totalEmployees ?? 0}
          icon={Users}
          trend="Registered employees"
        />
        <StatsCard
          title="Active Today"
          value={isLoading ? "—" : stats?.activeEmployees ?? 0}
          icon={CheckCircle2}
          trend={`${attendancePercent}% attendance`}
          trendPositive
        />
        <StatsCard
          title="Tasks Completed"
          value={isLoading ? "—" : stats?.totalTasksCompleted ?? 0}
          icon={Clock}
          trend={`${stats?.totalTasksPending ?? 0} pending`}
          trendPositive
        />
        <StatsCard
          title="Visits Done"
          value={isLoading ? "—" : stats?.totalVisitsToday ?? 0}
          icon={MapPin}
          trend="Total site visits"
          trendPositive
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7 h-[600px]">
        {/* Map Section */}
        <Card className="md:col-span-2 lg:col-span-5 flex flex-col overflow-hidden border-0 shadow-sm ring-1 ring-border">
          <CardHeader className="px-6 py-4 bg-white border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-heading">Live Workforce Map</CardTitle>
                <CardDescription>Real-time location of field agents</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Active
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Offline
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative">
            <MapWidget />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="md:col-span-1 lg:col-span-2 flex flex-col border-0 shadow-sm ring-1 ring-border bg-white">
          <CardHeader className="px-6 py-4 border-b">
            <CardTitle className="text-lg font-heading">Quick Stats</CardTitle>
            <CardDescription>Current snapshot</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {[
                    { label: "Active Employees", value: stats?.activeEmployees ?? 0, color: "text-green-600" },
                    { label: "Tasks Pending", value: stats?.totalTasksPending ?? 0, color: "text-orange-600" },
                    { label: "Tasks Completed", value: stats?.totalTasksCompleted ?? 0, color: "text-blue-600" },
                    { label: "Total Visits", value: stats?.totalVisitsToday ?? 0, color: "text-purple-600" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <span className={cn("text-2xl font-bold", item.color)}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatsCard({ title, value, icon: Icon, trend, trendPositive = true }: {
  title: string; value: string | number; icon: any; trend: string; trendPositive?: boolean;
}) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-border bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold font-heading">{value}</div>
          <div className={cn("text-xs flex items-center font-medium", trendPositive ? "text-green-600" : "text-red-600")}>
            {trend}
            {trendPositive ? <ArrowUpRight className="ml-1 h-3 w-3" /> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
