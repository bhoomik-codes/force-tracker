import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Lock, User, Globe, Smartphone, Mail, Shield, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";

export default function AdminSettings() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: settings, isLoading: isFetching } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const [formData, setFormData] = useState<Partial<Settings>>({});

  // Sync state when data loads
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Saved",
        description: "Your changes have been successfully applied.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  });

  const handleChange = (key: keyof Settings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings.mutate(formData);
  };

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const isLoading = updateSettings.isPending;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-[250px] shrink-0">
              <TabsList className="flex flex-col h-auto items-stretch bg-transparent p-0 gap-1">
                <TabsTrigger 
                  value="profile" 
                  className="justify-start px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <User className="mr-2 h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Bell className="mr-2 h-4 w-4" /> Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="app" 
                  className="justify-start px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Smartphone className="mr-2 h-4 w-4" /> App Settings
                </TabsTrigger>
              </TabsList>
            </aside>
            
            <div className="flex-1">
              {/* Profile Settings */}
              <TabsContent value="profile" className="m-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Profile</CardTitle>
                    <CardDescription>Update your company details visible on reports.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input 
                          value={formData.companyName || ""} 
                          onChange={(e) => handleChange("companyName", e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input 
                          value={formData.contactPerson || ""} 
                          onChange={(e) => handleChange("contactPerson", e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input 
                          value={formData.emailAddress || ""} 
                          onChange={(e) => handleChange("emailAddress", e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                          value={formData.phoneNumber || ""} 
                          onChange={(e) => handleChange("phoneNumber", e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input 
                        value={formData.address || ""} 
                        onChange={(e) => handleChange("address", e.target.value)} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="m-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts & Notifications</CardTitle>
                    <CardDescription>Configure how you receive alerts.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Label className="text-base">Email Alerts</Label>
                        <span className="text-sm text-muted-foreground">Receive daily summaries via email.</span>
                      </div>
                      <Switch 
                        checked={formData.emailAlerts ?? true} 
                        onCheckedChange={(checked) => handleChange("emailAlerts", checked)} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Label className="text-base">Geofence Breaches</Label>
                        <span className="text-sm text-muted-foreground">Instant alert when agent leaves assigned area.</span>
                      </div>
                      <Switch 
                        checked={formData.geofenceBreaches ?? true} 
                        onCheckedChange={(checked) => handleChange("geofenceBreaches", checked)} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Label className="text-base">Low Battery Warning</Label>
                        <span className="text-sm text-muted-foreground">Notify when agent device is below 15%.</span>
                      </div>
                      <Switch 
                        checked={formData.lowBatteryWarning ?? false} 
                        onCheckedChange={(checked) => handleChange("lowBatteryWarning", checked)} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                     <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Preferences"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* App Settings */}
              <TabsContent value="app" className="m-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Global settings for the field app.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                       <Label>GPS Tracking Interval</Label>
                       <Select 
                         value={formData.trackingInterval || "5"} 
                         onValueChange={(val) => handleChange("trackingInterval", val)}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Select interval" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="1">High Accuracy (Every 1 min)</SelectItem>
                           <SelectItem value="5">Balanced (Every 5 mins)</SelectItem>
                           <SelectItem value="15">Battery Saver (Every 15 mins)</SelectItem>
                         </SelectContent>
                       </Select>
                       <p className="text-xs text-muted-foreground">Affects battery life of agent devices.</p>
                    </div>
                    <div className="space-y-2">
                       <Label>Working Hours</Label>
                       <div className="flex items-center gap-2">
                         <Input 
                           type="time" 
                           value={formData.workingHoursStart || "09:00"} 
                           onChange={(e) => handleChange("workingHoursStart", e.target.value)} 
                           className="w-[150px]" 
                         />
                         <span>to</span>
                         <Input 
                           type="time" 
                           value={formData.workingHoursEnd || "18:00"} 
                           onChange={(e) => handleChange("workingHoursEnd", e.target.value)} 
                           className="w-[150px]" 
                         />
                       </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Configuration"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
