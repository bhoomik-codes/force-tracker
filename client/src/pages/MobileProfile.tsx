import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit2, Phone, Mail, Briefcase, MapPin, Shield, Bell, LogOut, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useLogout } from "@/hooks/useAuth";

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  department: string | null;
  location: string | null;
  avatar: string | null;
  employeeId: string;
  joinDate: string;
  status: string;
}

export default function MobileProfile() {
  const { toast } = useToast();
  const { employeeId } = useAuth();
  const logout = useLogout();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<EmployeeProfile>>({});

  useEffect(() => {
    if (!employeeId) { setIsLoading(false); return; }
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/employees/${employeeId}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data: EmployeeProfile = await res.json();
        setProfile(data);
        setEditForm(data);
      } catch {
        toast({ title: "Error", description: "Could not load profile", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [employeeId]);

  const handleSaveProfile = async () => {
    if (!employeeId) return;
    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setProfile(updated);
      setEditForm(updated);
      setIsEditing(false);
      toast({ title: "Success!", description: "Profile updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading profile...
        </div>
      </MobileLayout>
    );
  }

  if (!profile) {
    return (
      <MobileLayout>
        <div className="px-6 py-8 text-center text-muted-foreground">
          <p>Profile not found.</p>
          <Link href="/app"><Button variant="outline" className="mt-4">Go Back</Button></Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-6 py-4 border-b bg-card flex items-center gap-4 sticky top-0 z-10">
        <Link href="/app">
          <Button variant="ghost" size="icon" className="-ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="font-heading font-bold text-lg">Profile</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-0 shadow-sm ring-1 ring-border">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {profile.avatar || profile.name.slice(0, 2).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.position}</p>
            <div className="flex items-center justify-center gap-2 mt-3 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                {profile.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>ID: {profile.employeeId}</p>
              <p>Joined: {new Date(profile.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 shadow-sm ring-1 ring-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: profile.email },
              { icon: Phone, label: "Phone", value: profile.phone },
              { icon: MapPin, label: "Location", value: profile.location },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium break-all">{value || "—"}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card className="border-0 shadow-sm ring-1 ring-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Briefcase, label: "Department", value: profile.department },
              { icon: Shield, label: "Employee ID", value: profile.employeeId },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value || "—"}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card className="border-0 shadow-sm ring-1 ring-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["name", "email", "phone", "location"] as const).map(field => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="capitalize">{field}</Label>
                  <Input
                    id={field}
                    value={(editForm as any)[field] ?? ""}
                    onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => { setIsEditing(false); setEditForm(profile); }}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {!isEditing && (
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </Button>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          {logout.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          Logout
        </Button>
      </div>
    </MobileLayout>
  );
}
