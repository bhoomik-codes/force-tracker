import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Map, label: "Live Tracking", href: "/tracking" },
  { icon: Users, label: "Field Agents", href: "/agents" },
  { icon: ClipboardList, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Map className="h-5 w-5" />
          </div>
          <span>ForceTrack</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-sidebar-border p-4">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="flex h-16 items-center border-b bg-background px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r-sidebar-border text-sidebar-foreground">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 font-display text-lg font-bold">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Map className="h-4 w-4" />
          </div>
          <span>ForceTrack</span>
        </div>
      </div>
    </>
  );
}
