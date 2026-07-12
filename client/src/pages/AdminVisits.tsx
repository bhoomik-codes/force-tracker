import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Visit, Employee } from "@shared/schema";
import { MapPin, Calendar, FileText, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function AdminVisits() {
  const { data: visits = [], isLoading: isLoadingVisits } = useQuery<Visit[]>({ queryKey: ["/api/visits"] });
  const { data: employees = [] } = useQuery<Employee[]>({ queryKey: ["/api/employees"] });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Visits</h1>
          <p className="text-muted-foreground">Review employee site visits and photos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoadingVisits ? (
            <p>Loading visits...</p>
          ) : visits.length === 0 ? (
            <p className="text-muted-foreground">No visits recorded yet.</p>
          ) : (
            visits.map((visit) => {
              const employee = employees.find(e => e.userId === visit.userId);
              const hasPhotos = Boolean(visit.photos && Array.isArray(visit.photos) && visit.photos.length > 0);
              const photoUrl = hasPhotos ? (visit.photos as string[])[0] : null;

              return (
                <Card key={visit.id as string} className="overflow-hidden">
                  {hasPhotos && photoUrl ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="aspect-video w-full cursor-pointer relative group">
                          <img 
                            src={photoUrl} 
                            alt={`Visit at ${visit.clientName as string}`} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-1 bg-black">
                        <img src={photoUrl} alt="Full view" className="w-full h-auto max-h-[90vh] object-contain" />
                      </DialogContent>
                    </Dialog>
                  ) : null}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex justify-between items-start">
                      <span>{visit.clientName as string}</span>
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {employee?.name || "Unknown"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center text-muted-foreground gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{visit.location as string}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground gap-2">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{new Date(visit.visitDate).toLocaleString()}</span>
                    </div>
                    
                    {visit.notes && (
                      <div className="pt-2 border-t mt-2">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                          <p className="whitespace-pre-wrap">{visit.notes as string}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
