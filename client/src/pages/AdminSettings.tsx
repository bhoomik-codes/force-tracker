import { useState } from "react";
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
import { Bell, Lock, User, Globe, Smartphone, Mail, Shield } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your changes have been successfully applied.",
      });
    }, 1000);
  };

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
                  value="security" 
                  className="justify-start px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Shield className="mr-2 h-4 w-4" /> Security
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
                        <Input defaultValue="Acme Corp Logistics" />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input defaultValue="Admin User" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input defaultValue="admin@acmecorp.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input defaultValue="+91 98765 43210" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input defaultValue="123 Business Park, Sector 62, Noida, UP" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
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
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Label className="text-base">Geofence Breaches</Label>
                        <span className="text-sm text-muted-foreground">Instant alert when agent leaves assigned area.</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Label className="text-base">Low Battery Warning</Label>
                        <span className="text-sm text-muted-foreground">Notify when agent device is below 15%.</span>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                     <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="m-0 space-y-6">
                 <Card>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>Manage your account security.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm Password</Label>
                        <Input type="password" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSave} disabled={isLoading}>Update Password</Button>
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
                       <Select defaultValue="5">
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
                         <Input type="time" defaultValue="09:00" className="w-[150px]" />
                         <span>to</span>
                         <Input type="time" defaultValue="18:00" className="w-[150px]" />
                       </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSave} disabled={isLoading}>Save Configuration</Button>
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
