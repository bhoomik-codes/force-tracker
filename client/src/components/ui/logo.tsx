import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 font-heading font-bold text-xl tracking-tight select-none", className)}>
      <img 
        src="/favicon.png" 
        alt="Force Tracker" 
        className="w-8 h-8 object-contain"
      />
      <span className={light ? "text-white" : "text-primary"}>
        Force<span className="text-accent">Tracker</span>
      </span>
    </div>
  );
}
