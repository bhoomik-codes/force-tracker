import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DatePickerWithRange } from "@/components/ui/date-range-picker"; 
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { Download, Printer, Filter, Calendar as CalendarIcon, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const ATTENDANCE_DATA = [
  { name: "Mon", present: 45, absent: 5, late: 2 },
  { name: "Tue", present: 48, absent: 2, late: 0 },
  { name: "Wed", present: 47, absent: 3, late: 1 },
  { name: "Thu", present: 44, absent: 6, late: 4 },
  { name: "Fri", present: 49, absent: 1, late: 0 },
  { name: "Sat", present: 30, absent: 20, late: 0 },
];

const TASK_COMPLETION_DATA = [
  { name: "Week 1", completed: 120, pending: 30 },
  { name: "Week 2", completed: 132, pending: 25 },
  { name: "Week 3", completed: 101, pending: 45 },
  { name: "Week 4", completed: 154, pending: 15 },
];

const TRAVEL_DATA = [
  { name: "Sales", value: 400 },
  { name: "Service", value: 300 },
  { name: "Delivery", value: 300 },
  { name: "Survey", value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminReports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("attendance");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: string) => {
    setIsExporting(true);
    // Simulate API call
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Report Generated",
        description: `Successfully downloaded ${reportType}_report.${format}`,
      });
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into field operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" /> Last 30 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button size="sm" onClick={() => handleExport('csv')} disabled={isExporting}>
              {isExporting ? (
                "Generating..." 
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="attendance" className="w-full" onValueChange={setReportType}>
          <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Task Performance</TabsTrigger>
            <TabsTrigger value="travel">Travel & Expenses</TabsTrigger>
          </TabsList>

          {/* Attendance Report */}
          <TabsContent value="attendance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">-4 from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Daily Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={ATTENDANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" name="Late Arrival" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Report */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Trend</CardTitle>
                <CardDescription>Tasks completed vs pending over the last 4 weeks</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={TASK_COMPLETION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travel Report */}
          <TabsContent value="travel" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distance Covered by Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={TRAVEL_DATA}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {TRAVEL_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Fuel Allowance</p>
                        <p className="text-sm text-muted-foreground">
                          Total: ₹45,230
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+12%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Travel Tickets</p>
                        <p className="text-sm text-muted-foreground">
                          Total: ₹12,400
                        </p>
                      </div>
                      <div className="ml-auto font-medium">-5%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Food & Lodging</p>
                        <p className="text-sm text-muted-foreground">
                          Total: ₹8,500
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+2%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
