import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DailyTimeSheet {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  workHours: number;
  status: "open" | "closed";
  breaksMinutes: number;
}

export default function MobileTimeSheet() {
  const [timesheets, setTimesheets] = useState<DailyTimeSheet[]>([
    {
      id: "1",
      date: "Dec 7, 2025",
      checkInTime: "09:02 AM",
      checkOutTime: "05:30 PM",
      workHours: 8.5,
      status: "closed",
      breaksMinutes: 30,
    },
    {
      id: "2",
      date: "Dec 6, 2025",
      checkInTime: "08:45 AM",
      checkOutTime: "05:15 PM",
      workHours: 8.5,
      status: "closed",
      breaksMinutes: 30,
    },
    {
      id: "3",
      date: "Dec 5, 2025",
      checkInTime: "09:15 AM",
      checkOutTime: "04:45 PM",
      workHours: 7.5,
      status: "closed",
      breaksMinutes: 45,
    },
    {
      id: "4",
      date: "Dec 4, 2025",
      checkInTime: "09:00 AM",
      checkOutTime: "05:30 PM",
      workHours: 8.5,
      status: "closed",
      breaksMinutes: 30,
    },
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");

  const totalHours = timesheets.reduce((sum, ts) => sum + ts.workHours, 0);
  const totalDays = timesheets.length;
  const avgHoursPerDay = (totalHours / totalDays).toFixed(1);
  const totalBreaks = timesheets.reduce((sum, ts) => sum + ts.breaksMinutes, 0);

  const getStatusColor = (status: string) => {
    return status === "closed"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : "bg-orange-100 text-orange-700 hover:bg-orange-100";
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-card flex items-center gap-4 sticky top-0 z-10">
          <Link href="/app">
            <Button variant="ghost" size="icon" className="-ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-heading font-bold text-lg">Time Sheet</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm ring-1 ring-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Hours</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{totalHours}h</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Avg per Day</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{avgHoursPerDay}h</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Days</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{totalDays}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Breaks</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{totalBreaks}m</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("week")}
              className="flex-1 shadow-sm"
            >
              This Week
            </Button>
            <Button
              variant={selectedPeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("month")}
              className="flex-1 shadow-sm"
            >
              This Month
            </Button>
          </div>

          {/* Daily TimeSheets */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-foreground text-sm">Daily Records</h3>
            {timesheets.map((ts) => (
              <Card key={ts.id} className="border-0 shadow-sm ring-1 ring-border overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{ts.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {ts.checkInTime} - {ts.checkOutTime || "On-duty"}
                        </p>
                      </div>
                    </div>
                    <Badge className={cn("font-medium text-xs", getStatusColor(ts.status))}>
                      {ts.status === "closed" ? "Closed" : "Open"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Work Hrs</p>
                      <p className="text-sm font-bold text-foreground mt-1">{ts.workHours}h</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Breaks</p>
                      <p className="text-sm font-bold text-foreground mt-1">{ts.breaksMinutes}m</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Net Hrs</p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {(ts.workHours - ts.breaksMinutes / 60).toFixed(1)}h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Option */}
          <Card className="border-0 shadow-sm ring-1 ring-border bg-accent/5">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Download your timesheet as PDF or Excel for records and approval.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 shadow-sm">
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1 shadow-sm">
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
