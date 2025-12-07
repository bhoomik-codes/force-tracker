import { MobileLayout } from "@/components/layout/MobileLayout";
import { TASKS } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ChevronRight, Filter, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function MobileTasks() {
  return (
    <MobileLayout>
      <div className="px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-foreground">Today's Tasks</h1>
          <button className="p-2 bg-white rounded-full shadow-sm text-muted-foreground border hover:text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {TASKS.map((task) => (
            <Card key={task.id} className={cn(
              "border-0 shadow-sm ring-1 ring-border overflow-hidden transition-all active:scale-[0.98]",
              task.status === "Completed" ? "opacity-70 grayscale" : "bg-white"
            )}>
              <CardContent className="p-0">
                <div className={cn(
                  "h-1.5 w-full",
                  task.status === "Completed" ? "bg-green-500" : 
                  task.type === "Visit" ? "bg-primary" : "bg-accent"
                )} />
                
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Badge variant="secondary" className={cn(
                        "text-[10px] font-bold tracking-wider mb-1",
                        task.status === "Pending" && "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                        {task.type.toUpperCase()}
                      </Badge>
                      <h3 className="font-bold text-lg leading-tight">{task.title}</h3>
                    </div>
                    {task.status === "Completed" && (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{task.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{task.time}</span>
                    </div>
                  </div>

                  {task.status !== "Completed" && (
                    <div className="pt-2 flex gap-3">
                       <Link href="/app/visit" className="flex-1">
                         <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 flex items-center justify-center gap-2">
                           Start Visit <ChevronRight className="w-4 h-4" />
                         </button>
                       </Link>
                       <button className="w-10 flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">
                         <Navigation className="w-4 h-4" />
                       </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
