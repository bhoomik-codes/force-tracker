import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar, TrendingUp, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { TimeSheet } from "@shared/schema";

export default function MobileTimeSheet() {
  const { employeeId } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");

  const { data: timesheets = [], isLoading } = useQuery<TimeSheet[]>({
    queryKey: ["/api/timesheets", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      const res = await fetch(`/api/timesheets/${employeeId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch timesheets");
      return res.json();
    },
    enabled: !!employeeId,
  });

  // Filter by period
  const now = new Date();
  const filtered = timesheets.filter(ts => {
    const d = new Date(ts.date);
    if (selectedPeriod === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalHours = filtered.reduce((s, ts) => s + parseFloat(ts.workHours ?? "0"), 0);
  const totalDays = filtered.length;
  const avgHours = totalDays > 0 ? (totalHours / totalDays).toFixed(1) : "0.0";
  const totalBreaks = filtered.reduce((s, ts) => s + parseFloat(ts.breaksMinutes ?? "0"), 0);

  const getStatusColor = (status: string) =>
    status === "closed"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : "bg-orange-100 text-orange-700 hover:bg-orange-100";

  const formatTime = (iso: string | Date | null) => {
    if (!iso) return "--:--";
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (iso: string | Date) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
            {[
              { label: "Total Hours", value: `${totalHours.toFixed(1)}h`, icon: Clock, color: "bg-blue-100 text-blue-600" },
              { label: "Avg per Day", value: `${avgHours}h`, icon: TrendingUp, color: "bg-green-100 text-green-600" },
              { label: "Days", value: totalDays, icon: Calendar, color: "bg-orange-100 text-orange-600" },
              { label: "Total Breaks", value: `${Math.round(totalBreaks)}m`, icon: CheckCircle2, color: "bg-purple-100 text-purple-600" },
            ].map(stat => (
              <Card key={stat.label} className="border-0 shadow-sm ring-1 ring-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

          {/* Daily Records */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-foreground text-sm">Daily Records</h3>
            {isLoading ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading timesheets...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No records found for this period.
              </div>
            ) : (
              filtered.map(ts => (
                <Card key={ts.id} className="border-0 shadow-sm ring-1 ring-border overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{formatDate(ts.date)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(ts.checkInTime)} — {ts.checkOutTime ? formatTime(ts.checkOutTime) : "On-duty"}
                          </p>
                        </div>
                      </div>
                      <Badge className={cn("font-medium text-xs", getStatusColor(ts.status ?? "open"))}>
                        {ts.status === "closed" ? "Closed" : "Open"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Work Hrs</p>
                        <p className="text-sm font-bold text-foreground mt-1">{parseFloat(ts.workHours ?? "0").toFixed(1)}h</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Breaks</p>
                        <p className="text-sm font-bold text-foreground mt-1">{Math.round(parseFloat(ts.breaksMinutes ?? "0"))}m</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Net Hrs</p>
                        <p className="text-sm font-bold text-foreground mt-1">
                          {(parseFloat(ts.workHours ?? "0") - parseFloat(ts.breaksMinutes ?? "0") / 60).toFixed(1)}h
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
