import { useLocation, Link } from "wouter";
import { ADMIN_NAV_ITEMS } from "./NavItems";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { LogOut, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground fixed h-full hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-sidebar-border">
          <Logo light />
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all cursor-pointer font-medium text-sm group",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/70"
                )}>
                  <Icon className={cn("w-4 h-4", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="font-heading text-xl font-medium text-primary uppercase tracking-wide">
            {ADMIN_NAV_ITEMS.find(i => i.href === location)?.label || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs text-muted-foreground">Operations Manager</p>
              </div>
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 bg-muted/30">
          {children}
        </div>
      </main>
    </div>
  );
}
