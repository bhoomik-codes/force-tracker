import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, MapPin, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

const statusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-green-100 text-green-700 hover:bg-green-100";
    case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    default: return "bg-orange-100 text-orange-700 hover:bg-orange-100";
  }
};

const priorityColor = (p?: string | null) => {
  switch (p) {
    case "High": return "bg-red-100 text-red-700";
    case "Medium": return "bg-yellow-100 text-yellow-700";
    default: return "bg-green-100 text-green-700";
  }
};

const statusIcon = (status: string) => {
  if (status === "Completed") return <CheckCircle2 className="w-4 h-4" />;
  if (status === "In Progress") return <Clock className="w-4 h-4" />;
  return <AlertCircle className="w-4 h-4" />;
};

const emptyForm = { title: "", address: "", time: "", type: "Visit", priority: "Medium", assigneeName: "", dueDate: "" };

export default function AdminTasks() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "In Progress" | "Completed">("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: tasks = [], isLoading } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });

  const createTask = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error((await res.json()).error);
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/tasks"] }); toast({ title: "Task created!" }); setDialogOpen(false); setForm({ ...emptyForm }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const completeTask = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }), credentials: "include",
      });
      if (!res.ok) throw new Error((await res.json()).error);
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/tasks"] }); toast({ title: "Task completed!" }); },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).error);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/tasks"] }); toast({ title: "Task deleted" }); },
  });

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    Pending: tasks.filter(t => t.status === "Pending").length,
    InProgress: tasks.filter(t => t.status === "In Progress").length,
    Completed: tasks.filter(t => t.status === "Completed").length,
  };

  const f = (key: keyof typeof form) => (
    <Input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground">Task Management</h2>
            <p className="text-muted-foreground">Track and manage field staff assignments</p>
          </div>
          <Button className="gap-2 shadow-sm" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Tasks", value: tasks.length, cls: "text-foreground" },
            { label: "Pending", value: counts.Pending, cls: "text-orange-600" },
            { label: "Completed", value: counts.Completed, cls: "text-green-600" },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm ring-1 ring-border">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                  <p className={cn("text-3xl font-bold mt-2", s.cls)}>{s.value}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-muted-foreground/40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <Input placeholder="Search by title or location..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 shadow-sm" />
          <div className="flex gap-2">
            {(["All", "Pending", "In Progress", "Completed"] as const).map(s => (
              <Button key={s} variant={filterStatus === s ? "default" : "outline"} size="sm" onClick={() => setFilterStatus(s)} className="shadow-sm">{s}</Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm ring-1 ring-border">
          <CardHeader className="px-6 py-4 border-b">
            <CardTitle>{filtered.length} {filtered.length === 1 ? "Task" : "Tasks"}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading tasks...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">No tasks found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Task Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(task => (
                    <TableRow key={task.id} className="group">
                      <TableCell className="font-medium max-w-xs truncate">{task.title}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{task.type}</Badge></TableCell>
                      <TableCell><div className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{task.address}</div></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{task.assigneeName || "Unassigned"}</TableCell>
                      <TableCell><div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="w-3.5 h-3.5" />{task.time}</div></TableCell>
                      <TableCell>{task.priority && <Badge variant="secondary" className={cn("text-xs font-medium", priorityColor(task.priority))}>{task.priority}</Badge>}</TableCell>
                      <TableCell><Badge className={cn("font-medium flex items-center gap-2 w-fit", statusColor(task.status ?? ""))}>{statusIcon(task.status ?? "")}{task.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          {task.status !== "Completed" && (
                            <Button variant="ghost" size="sm" onClick={() => completeTask.mutate(task.id)} className="text-green-600 hover:text-green-700 hover:bg-green-100 text-xs">Complete</Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteTask.mutate(task.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs">Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1"><Label>Task Title</Label>{f("title")}</div>
              <div className="col-span-2 space-y-1"><Label>Location / Address</Label>{f("address")}</div>
              <div className="space-y-1"><Label>Scheduled Time</Label>{f("time")}</div>
              <div className="space-y-1"><Label>Due Date</Label>{f("dueDate")}</div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Visit", "Inspection", "Delivery", "Maintenance", "Survey"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["High", "Medium", "Low"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1"><Label>Assignee Name</Label>{f("assigneeName")}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => createTask.mutate(form)} disabled={createTask.isPending || !form.title || !form.address}>
              {createTask.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
