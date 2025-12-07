import { AdminLayout } from "@/components/layout/AdminLayout";
import { MapWidget } from "@/components/widgets/MapWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EMPLOYEES, RECENT_ATTENDANCE } from "@/lib/mockData";
import { ArrowUpRight, Users, CheckCircle2, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const activeCount = EMPLOYEES.filter(e => e.status !== "Inactive").length;
  const totalCount = EMPLOYEES.length;

  return (
    <AdminLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard 
          title="Total Workforce" 
          value={totalCount} 
          icon={Users} 
          trend="+2 this week" 
        />
        <StatsCard 
          title="Active Today" 
          value={activeCount} 
          icon={CheckCircle2} 
          trend={`${Math.round((activeCount/totalCount)*100)}% attendance`}
          trendPositive
        />
        <StatsCard 
          title="Avg Work Hrs" 
          value="7.2h" 
          icon={Clock} 
          trend="-0.5h vs yesterday"
          trendPositive={false}
        />
        <StatsCard 
          title="Visits Done" 
          value="45" 
          icon={MapPin} 
          trend="85% of target"
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
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Active
                 </div>
                 <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                    Offline
                 </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative">
            <MapWidget />
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="md:col-span-1 lg:col-span-2 flex flex-col border-0 shadow-sm ring-1 ring-border bg-white">
          <CardHeader className="px-6 py-4 border-b">
            <CardTitle className="text-lg font-heading">Recent Activity</CardTitle>
            <CardDescription>Latest check-ins & visits</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-border">
              {RECENT_ATTENDANCE.map((item) => (
                <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-3">
                  <div className="mt-0.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.type} at <span className="font-medium text-foreground">{item.location}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">{item.time}</p>
                  </div>
                </div>
              ))}
              {[1,2,3].map(i => (
                 <div key={`mock-${i}`} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-3 opacity-60">
                  <div className="mt-0.5 w-2 h-2 rounded-full bg-muted-foreground/30 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">System Alert</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Sync completed for Region {i}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">Yesterday</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatsCard({ title, value, icon: Icon, trend, trendPositive = true }: any) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-border bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold font-heading">{value}</div>
          <div className={cn(
            "text-xs flex items-center font-medium",
            trendPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend}
            {trendPositive ? <ArrowUpRight className="ml-1 h-3 w-3" /> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
