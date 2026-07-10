import { useLocation, Link } from "wouter";
import { MOBILE_NAV_ITEMS } from "./NavItems";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { sendLocation, isConnected } = useWebSocket();

  useEffect(() => {
    // Only track location for logged in employees and when WS is connected
    if (user?.role !== "employee" || !isConnected) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        sendLocation(user.id, position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Error tracking location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000, // 10 seconds
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [user, isConnected]);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto border-x border-border shadow-2xl relative overflow-hidden">
      {/* Mobile Header */}
      <header className="h-14 bg-primary text-primary-foreground px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Logo light className="scale-90 origin-left" />
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
          <Bell className="w-5 h-5" />
        </Button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 bg-muted/20">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="h-16 bg-card border-t border-border fixed bottom-0 w-full max-w-md flex items-center justify-around z-30 pb-safe">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href}>
              <div className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-all cursor-pointer active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "p-1.5 rounded-xl transition-colors",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}>
                  <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
