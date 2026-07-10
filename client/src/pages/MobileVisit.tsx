import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Camera, X, MapPin, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function MobileVisit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { employeeId } = useAuth();

  const [step, setStep] = useState<"details" | "camera">("details");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Real form state
  const [clientName, setClientName] = useState("");
  const [visitLocation, setVisitLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [issues, setIssues] = useState("");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setStep("details");
    }
  }, [webcamRef]);

  const handleSubmit = async () => {
    if (!clientName.trim() || !visitLocation.trim()) {
      toast({ title: "Required", description: "Client name and location are required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const visitPayload = {
        userId: employeeId ?? "unknown",
        clientName: clientName.trim(),
        location: visitLocation.trim(),
        notes: `${notes.trim()}${issues.trim() ? `\n\nIssues: ${issues.trim()}` : ""}`,
        photos: image ? [image] : [],
        status: "completed",
        visitDate: new Date().toISOString(),
      };

      const response = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitPayload),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to submit");

      toast({ title: "Success!", description: "Visit report submitted successfully" });
      setTimeout(() => setLocation("/app/tasks"), 1500);
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit visit report", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      {step === "camera" ? (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setStep("details")}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: "environment" }}
            />
          </div>
          <div className="h-24 bg-black/50 absolute bottom-0 w-full flex items-center justify-center pb-4">
            <button
              onClick={capture}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
            >
              <div className="w-12 h-12 bg-white rounded-full active:scale-90 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b bg-card flex items-center gap-4 sticky top-0 z-10">
            <Link href="/app/tasks">
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-heading font-bold text-lg">Site Visit Report</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Client Details */}
            <Card className="border-0 shadow-sm ring-1 ring-border">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm">Client Information</h3>
                </div>
                <div className="space-y-2">
                  <Label>Client Name <span className="text-destructive">*</span></Label>
                  <Input
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Enter client or company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visit Location <span className="text-destructive">*</span></Label>
                  <Input
                    value={visitLocation}
                    onChange={e => setVisitLocation(e.target.value)}
                    placeholder="e.g. Cyber City, Gurugram"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visit Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Visit Notes</Label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Describe what was done during this visit..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Issues / Findings</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Any issues found or items to follow up..."
                  value={issues}
                  onChange={e => setIssues(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Site Photo</Label>
                {image ? (
                  <div className="relative rounded-lg overflow-hidden aspect-video border bg-muted">
                    <img src={image} alt="Site capture" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setStep("camera")}
                    className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 transition-colors w-full"
                  >
                    <Camera className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-primary">Take Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-card sticky bottom-0">
            <Button
              className="w-full font-bold h-12 text-base"
              onClick={handleSubmit}
              disabled={isSubmitting || !clientName.trim() || !visitLocation.trim()}
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</> : "Submit Report"}
            </Button>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
