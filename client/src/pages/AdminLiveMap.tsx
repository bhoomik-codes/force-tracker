import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import type { Employee } from "@shared/schema";
import { MapPin, Navigation, User, Battery, Signal, Clock } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mock coordinates for demo
const LOCATIONS = {
  noida: [28.6139, 77.3590],
  delhi: [28.6304, 77.2177],
  bangalore: [12.9784, 77.6408],
  mumbai: [19.1136, 72.8697],
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

export default function LiveMap() {
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default Delhi
  const [liveLocations, setLiveLocations] = useState<Record<string, {lat: number, lng: number}>>({});
  
  const { lastMessage } = useWebSocket();
  const { data: employees = [] } = useQuery<Employee[]>({ queryKey: ["/api/employees"] });

  useEffect(() => {
    if (lastMessage?.type === 'LOCATION_UPDATE') {
      const { employeeId, latitude, longitude } = lastMessage.payload;
      setLiveLocations(prev => ({
        ...prev,
        [employeeId]: { lat: latitude, lng: longitude }
      }));
    }
  }, [lastMessage]);

  // Transform data to include coordinates
  const agentsWithLocation = employees.map(emp => {
    // 1. Check for live WebSocket updates
    if (liveLocations[emp.id]) {
      return {
        ...emp,
        lat: liveLocations[emp.id].lat,
        lng: liveLocations[emp.id].lng,
        battery: 100,
        lastPing: "Live"
      };
    }

    // 2. Fallback to Database coordinates
    let coords = LOCATIONS.delhi; // Default fallback
    if ((emp.location || "").includes("Noida")) coords = LOCATIONS.noida;
    if ((emp.location || "").includes("Bangalore")) coords = LOCATIONS.bangalore;
    
    if (emp.latitude && emp.longitude) {
      coords = [parseFloat(emp.latitude), parseFloat(emp.longitude)];
    }
    
    return {
      ...emp,
      lat: coords[0],
      lng: coords[1],
      battery: 100, // mock battery
      lastPing: emp.updatedAt ? new Date(emp.updatedAt).toLocaleTimeString() : "Unknown" 
    };
  });

  const handleAgentSelect = (value: string) => {
    setSelectedAgent(value);
    if (value !== "all") {
      const agent = agentsWithLocation.find(a => a.id.toString() === value);
      if (agent) {
        setMapCenter([agent.lat, agent.lng]);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Map</h1>
            <p className="text-muted-foreground">Real-time GPS tracking of force tracker team</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedAgent} onValueChange={handleAgentSelect}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Filter by Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setMapCenter([28.6139, 77.2090])}>
              <Navigation className="w-4 h-4 mr-2" /> Reset View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Sidebar List */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col h-full border-0 shadow-md">
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Active Agents ({agentsWithLocation.filter(a => a.status === "Active" || a.status === "On Duty").length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              <div className="divide-y">
                {agentsWithLocation.map((agent) => (
                  <div 
                    key={agent.id} 
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${selectedAgent === agent.id.toString() ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                    onClick={() => handleAgentSelect(agent.id.toString())}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {agent.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.position}</p>
                        </div>
                      </div>
                      <Badge variant={agent.status === "active" || agent.status === "Active" || agent.status === "On Duty" ? "default" : "secondary"} className="text-[10px]">
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {(agent.location || "").split(',')[0]}
                      </div>
                      <div className="flex items-center gap-1">
                        <Battery className="h-3 w-3" /> {agent.battery}%
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {agent.lastPing}
                      </div>
                      <div className="flex items-center gap-1">
                        <Signal className="h-3 w-3" /> GPS: Strong
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Area */}
          <Card className="lg:col-span-3 overflow-hidden border-0 shadow-md h-full relative z-0">
             <MapContainer 
                center={mapCenter} 
                zoom={12} 
                style={{ height: "100%", width: "100%" }}
                className="z-0"
             >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={mapCenter} />
                
                {agentsWithLocation.map((agent) => (
                  (selectedAgent === "all" || selectedAgent === agent.id.toString()) && (
                    <Marker 
                      key={agent.id} 
                      position={[agent.lat, agent.lng]}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                               {agent.avatar}
                             </div>
                             <div>
                               <h3 className="font-bold text-sm">{agent.name}</h3>
                               <p className="text-xs text-muted-foreground">{agent.position}</p>
                             </div>
                          </div>
                          <div className="space-y-1 text-xs border-t pt-2">
                            <p><strong>Status:</strong> {agent.status}</p>
                            <p><strong>Location:</strong> {agent.location}</p>
                            <p><strong>Last Ping:</strong> {agent.lastPing}</p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" className="h-6 text-xs w-full">View Details</Button>
                              <Button size="sm" variant="outline" className="h-6 text-xs w-full">Message</Button>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
             </MapContainer>
             
             {/* Map Controls Mockup */}
             <div className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-md shadow-md space-y-2">
                <Button size="icon" variant="ghost" className="h-8 w-8" title="Traffic Layer">
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" title="Satellite View">
                  <MapPin className="h-4 w-4" />
                </Button>
             </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
