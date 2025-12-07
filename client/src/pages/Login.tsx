import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/ui/logo";
import { Building2, Smartphone, Lock, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Parse query params to select default tab
  const queryParams = new URLSearchParams(window.location.search);
  const defaultRole = queryParams.get("role") || "employee";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (expectedRole: "admin" | "employee") => {
    setError("");
    setIsLoading(true);

    // Mock Login Simulation (Client-side only)
    setTimeout(() => {
      try {
        let success = false;
        let isAdmin = false;

        // Admin Mock Check
        if (expectedRole === "admin") {
           if (username === "admin" && password === "admin123") {
             success = true;
             isAdmin = true;
           } else {
             setError("Invalid admin credentials");
           }
        } 
        // Employee Mock Check
        else {
           // Accept any username starting with 'emp' for demo flexibility, or specific mock user
           if ((username === "emp01" || username.startsWith("emp")) && password === "emp123") {
             success = true;
             isAdmin = false;
           } else {
             setError("Invalid employee credentials");
           }
        }

        if (success) {
          toast({
            title: isAdmin ? "Welcome back, Admin" : "Login Successful",
            description: isAdmin ? "Redirecting to dashboard..." : "Syncing field data...",
          });

          // Store auth state in localStorage for persistence across reloads in mockup
          localStorage.setItem("user_role", isAdmin ? "admin" : "employee");
          localStorage.setItem("user_name", username);

          setTimeout(() => {
            setLocation(isAdmin ? "/admin" : "/app");
          }, 500);
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate network delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 scale-125">
        <Logo />
      </div>

      <Card className="w-full max-w-md border-0 shadow-xl ring-1 ring-border bg-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-heading">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access the portal</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultRole} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="admin" className="gap-2">
                <Building2 className="w-4 h-4" /> Admin
              </TabsTrigger>
              <TabsTrigger value="employee" className="gap-2">
                <Smartphone className="w-4 h-4" /> Employee
              </TabsTrigger>
            </TabsList>

            {/* Admin Login Form */}
            <TabsContent value="admin">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-id">Admin ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="admin-id" 
                      placeholder="e.g. admin" 
                      className="pl-9" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-pass">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="admin-pass" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-in slide-in-from-left-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button 
                  className="w-full font-bold" 
                  onClick={() => handleLogin("admin")}
                  disabled={isLoading}
                  data-testid="button-admin-login"
                >
                  {isLoading ? "Verifying..." : "Login to Dashboard"}
                </Button>
                
                <div className="text-center text-xs text-muted-foreground mt-4">
                  Demo Credentials: <strong>admin</strong> / <strong>admin123</strong>
                </div>
              </div>
            </TabsContent>

            {/* Employee Login Form */}
            <TabsContent value="employee">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emp-id">Employee / Staff ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="emp-id" 
                      placeholder="e.g. emp01" 
                      className="pl-9"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emp-pass">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="emp-pass" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-in slide-in-from-left-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button 
                  className="w-full font-bold bg-accent hover:bg-accent/90 text-white" 
                  onClick={() => handleLogin("employee")}
                  disabled={isLoading}
                  data-testid="button-employee-login"
                >
                  {isLoading ? "Verifying..." : "Login to App"}
                </Button>

                <div className="text-center text-xs text-muted-foreground mt-4">
                  Demo Credentials: <strong>emp01</strong> / <strong>emp123</strong>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4 bg-muted/20">
            <p className="text-xs text-muted-foreground">Forgot password? Contact IT Support.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
