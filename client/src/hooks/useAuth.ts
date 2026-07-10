import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface AuthUser {
  id: string;
  username: string;
  role: "admin" | "employee";
  employeeId: string | null;
  employeeName: string | null;
}

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/me"],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  return {
    user: user ?? null,
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee",
    isLoading,
    isAuthenticated: !!user,
    employeeId: user?.employeeId ?? null,
    employeeName: user?.employeeName ?? null,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }
      return res.json() as Promise<AuthUser>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      setLocation(user.role === "admin" ? "/admin" : "/app");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }
      return res.json() as Promise<AuthUser>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      setLocation(user.role === "admin" ? "/admin" : "/app");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/me"], null);
      setLocation("/login");
    },
  });
}
