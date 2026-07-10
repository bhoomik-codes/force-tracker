import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/ui/logo";
import { Building2, Smartphone, Lock, User, AlertCircle } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Login() {
  const queryParams = new URLSearchParams(window.location.search);
  const defaultRole = queryParams.get("role") || "employee";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = useLogin();

  const handleLogin = () => {
    login.mutate({ username, password });
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

            {/* Shared form fields — same credentials work for both tabs */}
            {(["admin", "employee"] as const).map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${tab}-id`}>{tab === "admin" ? "Admin ID" : "Employee / Staff ID"}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`${tab}-id`}
                        placeholder={tab === "admin" ? "e.g. admin" : "e.g. emp01"}
                        className="pl-9"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${tab}-pass`}>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`${tab}-pass`}
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      />
                    </div>
                  </div>

                  {login.error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-in slide-in-from-left-2">
                      <AlertCircle className="w-4 h-4" />
                      {(login.error as Error).message}
                    </div>
                  )}

                  <Button
                    className="w-full font-bold"
                    onClick={handleLogin}
                    disabled={login.isPending || !username || !password}
                    data-testid={`button-${tab}-login`}
                  >
                    {login.isPending ? "Verifying..." : tab === "admin" ? "Login to Dashboard" : "Login to App"}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4 bg-muted/20">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">Forgot password? Contact IT Support.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
