import { EMPLOYEES } from "@/lib/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export function MapWidget({ className }: { className?: string }) {
  // Center of Delhi for default view
  const center: [number, number] = [28.6139, 77.2090];

  return (
    <div className={cn("relative w-full h-full rounded-xl overflow-hidden border bg-muted shadow-inner group", className)}>
       <MapContainer 
          center={center} 
          zoom={11} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
       >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {EMPLOYEES.map((emp) => {
             // Mock locations around Delhi
             const lat = 28.6139 + (Math.random() * 0.1 - 0.05);
             const lng = 77.2090 + (Math.random() * 0.1 - 0.05);

             return (
              <Marker key={emp.id} position={[lat, lng]}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{emp.name}</p>
                    <p>{emp.role}</p>
                    <p className="text-[10px] text-muted-foreground">{emp.status}</p>
                  </div>
                </Popup>
              </Marker>
             );
          })}
       </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md text-xs font-medium shadow-sm z-[1000]">
        Live Tracking Active
      </div>
    </div>
  );
}
