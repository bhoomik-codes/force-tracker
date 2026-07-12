import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Download, Printer, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { TimeSheet, Employee, Task } from "@shared/schema";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { subDays, format, isSameDay } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7'];

export default function AdminReports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("attendance");
  const [isExporting, setIsExporting] = useState(false);

  const { data: timesheets = [] } = useQuery<TimeSheet[]>({ queryKey: ["/api/timesheets"] });
  const { data: employees = [] } = useQuery<Employee[]>({ queryKey: ["/api/employees"] });
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });

  // ─── DYNAMIC DATA CALCULATIONS ─────────────────────────────────────────────

  // 1. Attendance Data (Last 7 Days)
  const attendanceData = useMemo(() => {
    const totalEmployees = employees.filter(e => e.status === "active").length || 1;
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayName = format(date, 'EEE'); // Mon, Tue, etc.
      
      const tsForDay = timesheets.filter(ts => ts.date && isSameDay(new Date(ts.date), date));
      const present = tsForDay.length;
      const absent = totalEmployees - present;
      
      days.push({
        name: dayName,
        present,
        absent: Math.max(0, absent), // prevent negative if old employees exist
      });
    }
    return days;
  }, [timesheets, employees]);

  // 2. Task Completion Trend (Last 7 Days)
  const taskCompletionData = useMemo(() => {
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayName = format(date, 'MMM d');
      
      const tasksForDay = tasks.filter(t => t.createdAt && isSameDay(new Date(t.createdAt), date));
      const completed = tasksForDay.filter(t => t.status === "Completed").length;
      const pending = tasksForDay.filter(t => t.status === "Pending" || t.status === "In Progress").length;
      
      days.push({
        name: dayName,
        completed,
        pending
      });
    }
    return days;
  }, [tasks]);

  // 3. Task Distribution by Type
  const taskTypeData = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    tasks.forEach(t => {
      typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  // Overall stats
  const avgAttendance = useMemo(() => {
    if (attendanceData.length === 0) return 0;
    const totalPresent = attendanceData.reduce((acc, curr) => acc + curr.present, 0);
    const totalExpected = (employees.filter(e => e.status === "active").length || 1) * 7;
    return Math.round((totalPresent / totalExpected) * 100);
  }, [attendanceData, employees]);


  // ─── EXPORT LOGIC ─────────────────────────────────────────────────────────

  const getExportData = () => {
    return timesheets.map(ts => {
      const emp = employees.find(e => e.userId === ts.userId);
      let workHours = 0;
      if (ts.checkInTime && ts.checkOutTime) {
        const diffMs = new Date(ts.checkOutTime).getTime() - new Date(ts.checkInTime).getTime();
        workHours = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
      }
      return {
        Employee: emp?.name || 'Unknown',
        Date: ts.date ? new Date(ts.date).toLocaleDateString() : 'Unknown',
        CheckIn: ts.checkInTime ? new Date(ts.checkInTime).toLocaleTimeString() : 'N/A',
        CheckOut: ts.checkOutTime ? new Date(ts.checkOutTime).toLocaleTimeString() : 'N/A',
        WorkHours: workHours || '-',
        Status: ts.status || 'Unknown'
      };
    });
  };

  const generateCSV = () => {
    const data = getExportData();
    if (data.length === 0) return toast({ title: "No data", description: "No timesheets to export" });
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => `"${(row as any)[header]}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `timesheets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    const data = getExportData();
    if (data.length === 0) return toast({ title: "No data", description: "No timesheets to export" });

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Timesheet Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const headers = Object.keys(data[0]);
    const tableData = data.map(row => headers.map(header => (row as any)[header]));

    autoTable(doc, {
      startY: 36,
      head: [headers],
      body: tableData,
    });

    doc.save(`timesheets_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExport = (format: string) => {
    setIsExporting(true);
    try {
      if (format === 'csv') generateCSV();
      if (format === 'pdf') generatePDF();
      
      toast({
        title: "Report Generated",
        description: `Successfully downloaded timesheet report in ${format.toUpperCase()} format.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred while generating the report.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">Live, data-driven insights from operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" /> Last 7 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Printer className="mr-2 h-4 w-4" /> Print PDF
            </Button>
            <Button size="sm" onClick={() => handleExport('csv')} disabled={isExporting}>
              {isExporting ? "Generating..." : <><Download className="mr-2 h-4 w-4" /> Export CSV</>}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="attendance" className="w-full" onValueChange={setReportType}>
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="attendance">Attendance Tracking</TabsTrigger>
            <TabsTrigger value="performance">Tasks & Operations</TabsTrigger>
          </TabsList>

          {/* Attendance Report */}
          <TabsContent value="attendance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Attendance (7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgAttendance}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Timesheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{timesheets.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Daily Attendance Overview (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance & Operations Report */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task Completion Trend (Last 7 Days)</CardTitle>
                  <CardDescription>Daily volume of tasks logged</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={taskCompletionData}>
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

              <Card>
                <CardHeader>
                  <CardTitle>Distribution by Task Type</CardTitle>
                  <CardDescription>Total tasks categorized</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={taskTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taskTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
