import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle2, AlertCircle, Clock, MapPin, ArrowUpRight, MoreHorizontal, ClipboardList } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Active Agents",
    value: "24",
    change: "+12%",
    icon: Users,
    trend: "up",
    description: "Currently in the field"
  },
  {
    title: "Tasks Completed",
    value: "142",
    change: "+8%",
    icon: CheckCircle2,
    trend: "up",
    description: "Today's completion rate"
  },
  {
    title: "Pending Tasks",
    value: "18",
    change: "-2%",
    icon: Clock,
    trend: "down",
    description: "Requires attention"
  },
  {
    title: "Avg. Response",
    value: "24m",
    change: "-5%",
    icon: AlertCircle,
    trend: "up",
    description: "Time to arrival"
  }
];

const activityData = [
  { time: "09:00", tasks: 12 },
  { time: "10:00", tasks: 18 },
  { time: "11:00", tasks: 24 },
  { time: "12:00", tasks: 15 },
  { time: "13:00", tasks: 28 },
  { time: "14:00", tasks: 32 },
  { time: "15:00", tasks: 26 },
];

const recentTasks = [
  {
    id: "TSK-1234",
    title: "HVAC Maintenance - Sector 4",
    agent: "Sarah Wilson",
    status: "In Progress",
    time: "15 min ago",
    priority: "High"
  },
  {
    id: "TSK-1235",
    title: "Network Installation - Downtown",
    agent: "Mike Chen",
    status: "Completed",
    time: "45 min ago",
    priority: "Medium"
  },
  {
    id: "TSK-1236",
    title: "Security System Check - Mall",
    agent: "Alex Rodriguez",
    status: "Pending",
    time: "1h ago",
    priority: "Low"
  },
  {
    id: "TSK-1237",
    title: "Emergency Repair - Hospital",
    agent: "David Kim",
    status: "In Progress",
    time: "1h 20m ago",
    priority: "Critical"
  }
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of your field operations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>New Task</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                  {stat.change}
                </span>{" "}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Live Map Placeholder */}
        <Card className="col-span-4 md:col-span-5 lg:col-span-5 h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Live Fleet Tracking</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative overflow-hidden rounded-b-xl">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800">
              <div className="absolute inset-0 opacity-10" style={{ 
                backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
              }}></div>
              
              {/* Mock Map Pins */}
              <div className="absolute top-1/4 left-1/4 animate-pulse">
                 <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 animate-pulse delay-75">
                 <div className="h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30"></div>
              </div>
              <div className="absolute bottom-1/3 right-1/4 animate-pulse delay-150">
                 <div className="h-4 w-4 rounded-full bg-amber-500 ring-4 ring-amber-500/30"></div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur p-2 rounded-md shadow-sm border text-xs">
              <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Moving</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Idle</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Offline</div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card className="col-span-3 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Volume</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorTasks)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Tasks</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border",
                    task.priority === "Critical" && "bg-rose-100 text-rose-600 border-rose-200",
                    task.priority === "High" && "bg-amber-100 text-amber-600 border-amber-200",
                    task.priority === "Medium" && "bg-blue-100 text-blue-600 border-blue-200",
                    task.priority === "Low" && "bg-slate-100 text-slate-600 border-slate-200",
                  )}>
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Users className="h-3 w-3" /> {task.agent} • {task.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    task.status === "Completed" ? "default" : 
                    task.status === "In Progress" ? "secondary" : "outline"
                  }>
                    {task.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
