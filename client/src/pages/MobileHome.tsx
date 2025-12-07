import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EMPLOYEES } from "@/lib/mockData";
import { MapPin, Clock, CalendarDays, ChevronRight, LogIn, Coffee, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function MobileHome() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = EMPLOYEES[0]; // Simulate logged in user

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Good Morning,</p>
            <h1 className="text-2xl font-heading font-bold tracking-wide">{user.name}</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-lg font-bold">
            {user.avatar}
          </div>
        </div>

        {/* Date & Location Pill */}
        <div className="flex gap-2 text-xs font-medium opacity-90 mb-2">
           <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5">
             <CalendarDays className="w-3.5 h-3.5" />
             {currentTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
           </div>
           <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5">
             <MapPin className="w-3.5 h-3.5" />
             {user.location.split(',')[0]}
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
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </h2>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckIn}
              className={cn(
                "w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border-4 transition-all duration-500 relative overflow-hidden group",
                isCheckedIn 
                  ? "bg-white border-green-500 text-green-600" 
                  : "bg-gradient-to-br from-primary to-blue-900 border-white/20 text-white shadow-blue-900/30"
              )}
            >
              {isCheckedIn && (
                 <div className="absolute inset-0 border-[6px] border-green-100 rounded-full animate-pulse" />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                {isCheckedIn ? <Coffee className="w-10 h-10 mb-1" /> : <LogIn className="w-10 h-10 mb-1" />}
                <span className="font-heading font-bold text-lg tracking-wider">
                  {isCheckedIn ? "ON DUTY" : "PUNCH IN"}
                </span>
                <span className="text-[10px] opacity-70 font-medium">
                  {isCheckedIn ? "Tap to Break" : "Swipe to Start"}
                </span>
              </div>
            </motion.button>
            
            <div className="flex w-full justify-between items-center px-2 pt-2">
               <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">In Time</p>
                  <p className="text-sm font-semibold text-foreground">09:02 AM</p>
               </div>
               <div className="h-8 w-px bg-border" />
               <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Work Hrs</p>
                  <p className="text-sm font-semibold text-accent">04h 12m</p>
               </div>
               <div className="h-8 w-px bg-border" />
               <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Visits</p>
                  <p className="text-sm font-semibold text-foreground">3 / 5</p>
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
