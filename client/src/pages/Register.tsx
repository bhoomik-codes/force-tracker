import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { User, Lock, Building2, AlertCircle } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const register = useRegister();

  const handleRegister = () => {
    setErrorMsg("");
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (username.length < 3) {
      setErrorMsg("Username must be at least 3 characters");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    register.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 scale-125">
        <Logo />
      </div>

      <Card className="w-full max-w-md border-0 shadow-xl ring-1 ring-border bg-white">
        <CardHeader className="text-center pb-2 pt-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Building2 className="w-24 h-24" />
          </div>
          <CardTitle className="text-2xl font-heading relative z-10">Create Admin Account</CardTitle>
          <CardDescription className="relative z-10">Sign up your organization</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 relative z-20">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-username">Admin Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-username"
                  placeholder="e.g. admin"
                  className="pl-9"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reg-pass">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-pass"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-confirm"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>
            </div>

            {(errorMsg || register.error) && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-in slide-in-from-left-2">
                <AlertCircle className="w-4 h-4" />
                {errorMsg || (register.error as Error).message}
              </div>
            )}

            <Button
              className="w-full font-bold mt-2"
              onClick={handleRegister}
              disabled={register.isPending || !username || !password || !confirmPassword}
            >
              {register.isPending ? "Creating Account..." : "Sign Up"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4 bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
