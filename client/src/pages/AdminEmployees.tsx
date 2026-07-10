import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, MoreHorizontal, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@shared/schema";

const statusColor = (status: string) =>
  status === "active" || status === "Active" || status === "On Duty"
    ? "bg-green-100 text-green-700 hover:bg-green-100"
    : "bg-gray-100 text-gray-600 hover:bg-gray-100";

const emptyForm = {
  name: "", email: "", phone: "", position: "", department: "",
  location: "", employeeId: "", avatar: "", status: "active",
};

export default function AdminEmployees() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const createEmployee = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, joinDate: new Date().toISOString() }),
        credentials: "include",
      });
      if (!res.ok) throw new Error((await res.json()).error);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({ title: "Employee added!" });
      setOpen(false);
      setForm({ ...emptyForm });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const field = (key: keyof typeof form, label: string, placeholder?: string) => (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground">Workforce</h2>
            <p className="text-muted-foreground">Manage field staff and assignments</p>
          </div>
          <Button className="gap-2 shadow-sm" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        </div>

        <Card className="border-0 shadow-sm ring-1 ring-border">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading employees...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[50px]" />
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        No employees yet. Click "Add Employee" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((emp) => (
                      <TableRow key={emp.id} className="group">
                        <TableCell>
                          <Avatar className="h-9 w-9 border">
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                              {emp.avatar || emp.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{emp.name}</TableCell>
                        <TableCell className="text-muted-foreground">{emp.position}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("font-medium", statusColor(emp.status ?? ""))}>
                            {emp.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            {emp.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono">{emp.employeeId}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {field("name", "Full Name", "Rajesh Kumar")}
            {field("employeeId", "Employee ID", "TC-2024-001")}
            {field("email", "Email", "rajesh@company.com")}
            {field("phone", "Phone", "+91 98765 43210")}
            {field("position", "Position / Role", "Field Technician")}
            {field("department", "Department", "Operations")}
            {field("location", "Base Location", "Gurugram, India")}
            {field("avatar", "Avatar Initials", "RK")}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createEmployee.mutate(form)} disabled={createEmployee.isPending}>
              {createEmployee.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Adding...</> : "Add Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
