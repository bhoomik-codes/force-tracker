import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CalendarDays, ChevronRight, LogIn, Coffee, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function MobileHome() {
  const { employeeId, employeeName } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch the active (open) timesheet to know if punched in
  const { data: activeSheet } = useQuery<{ id: string; checkInTime: string | null } | null>({
    queryKey: ["/api/timesheets/active", employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      const res = await fetch(`/api/timesheets/active/${employeeId}`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!employeeId,
    refetchInterval: 60000, // refresh every minute
  });

  const isCheckedIn = !!activeSheet;

  // Calculate live work hours
  const workHoursStr = (() => {
    if (!activeSheet?.checkInTime) return "0h 0m";
    const diff = (currentTime.getTime() - new Date(activeSheet.checkInTime).getTime()) / 60000;
    const h = Math.floor(diff / 60);
    const m = Math.floor(diff % 60);
    return `${h}h ${m}m`;
  })();

  const checkInTimeStr = activeSheet?.checkInTime
    ? new Date(activeSheet.checkInTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "--:--";

  const punchIn = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/timesheets/punch-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: employeeId }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/timesheets/active", employeeId] });
      toast({ title: "Punched In!", description: "Have a great day!" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const punchOut = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/timesheets/punch-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: employeeId }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/timesheets/active", employeeId] });
      qc.invalidateQueries({ queryKey: ["/api/timesheets", employeeId] });
      toast({ title: "Punched Out!", description: "Good work today!" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handlePunch = () => {
    if (isCheckedIn) punchOut.mutate();
    else punchIn.mutate();
  };

  const isPending = punchIn.isPending || punchOut.isPending;

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Good Morning,</p>
            <h1 className="text-2xl font-heading font-bold tracking-wide">{employeeName ?? "Employee"}</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-lg font-bold">
            {(employeeName ?? "E").slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="flex gap-2 text-xs font-medium opacity-90 mb-2">
          <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {currentTime.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
          </div>
          <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-6">
        {/* Attendance Card */}
        <Card className="border-0 shadow-xl ring-1 ring-black/5 overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center gap-6 pt-8">
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {isCheckedIn ? "Checked In At" : "Not Checked In"}
              </p>
              <h2 className="text-4xl font-mono font-medium text-foreground tabular-nums tracking-tight">
                {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </h2>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePunch}
              disabled={isPending}
              className={cn(
                "w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border-4 transition-all duration-500 relative overflow-hidden group disabled:opacity-70",
                isCheckedIn
                  ? "bg-white border-green-500 text-green-600"
                  : "bg-gradient-to-br from-primary to-blue-900 border-white/20 text-white shadow-blue-900/30"
              )}
            >
              {isCheckedIn && <div className="absolute inset-0 border-[6px] border-green-100 rounded-full animate-pulse" />}
              <div className="relative z-10 flex flex-col items-center">
                {isCheckedIn ? <Coffee className="w-10 h-10 mb-1" /> : <LogIn className="w-10 h-10 mb-1" />}
                <span className="font-heading font-bold text-lg tracking-wider">
                  {isPending ? "..." : isCheckedIn ? "ON DUTY" : "PUNCH IN"}
                </span>
                <span className="text-[10px] opacity-70 font-medium">
                  {isCheckedIn ? "Tap to Punch Out" : "Tap to Start"}
                </span>
              </div>
            </motion.button>

            <div className="flex w-full justify-between items-center px-2 pt-2">
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">In Time</p>
                <p className="text-sm font-semibold text-foreground">{checkInTimeStr}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Work Hrs</p>
                <p className="text-sm font-semibold text-accent">{isCheckedIn ? workHoursStr : "—"}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Status</p>
                <p className={cn("text-sm font-semibold", isCheckedIn ? "text-green-600" : "text-muted-foreground")}>
                  {isCheckedIn ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/app/visit">
            <Button className="w-full h-auto py-4 flex flex-col gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg border-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold">New Visit</span>
                <span className="text-[10px] opacity-80">Start Site Visit</span>
              </div>
            </Button>
          </Link>
          <Link href="/app/timesheet">
            <Button className="w-full h-auto py-4 flex flex-col gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg border-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold">Time Sheet</span>
                <span className="text-[10px] opacity-80">Track Hours</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Profile Button */}
        <Link href="/app/profile">
          <Button className="w-full h-auto py-3 flex items-center justify-between bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-xs font-bold">My Profile</span>
                <span className="text-[10px] opacity-80">View & Edit</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </MobileLayout>
  );
}
