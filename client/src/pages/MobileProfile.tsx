import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit2, Phone, Mail, Briefcase, MapPin, Shield, Bell, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  avatar: string;
  employeeId: string;
  joinDate: string;
  status: "active" | "inactive";
}

export default function MobileProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<EmployeeProfile>({
    id: "emp-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@techcorp.com",
    phone: "+91 98765 43210",
    position: "Field Technician",
    department: "Operations",
    location: "Gurugram, India",
    avatar: "RK",
    employeeId: "TC-2024-001",
    joinDate: "January 15, 2024",
    status: "active",
  });

  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    // Fetch employee profile from backend
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/employees/emp-001");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfile(data);
        setEditForm(data);
      } catch (error) {
        console.log("Using default profile data");
        // Keep default data if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/employees/emp-001", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setProfile(editForm);
      setIsEditing(false);
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    setTimeout(() => setLocation("/login"), 1500);
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="px-6 py-8 text-center">Loading profile...</div>
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
              {profile.avatar}
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
              <p>Joined: {profile.joinDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 shadow-sm ring-1 ring-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Email</p>
                <p className="text-sm font-medium break-all">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{profile.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card className="border-0 shadow-sm ring-1 ring-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="w-full">
                <p className="text-xs font-semibold text-muted-foreground">Department</p>
                <p className="text-sm font-medium">{profile.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="w-full">
                <p className="text-xs font-semibold text-muted-foreground">Employee ID</p>
                <p className="text-sm font-medium">{profile.employeeId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card className="border-0 shadow-sm ring-1 ring-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="border-input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm(profile);
                  }}
                >
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
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </Button>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </MobileLayout>
  );
}
