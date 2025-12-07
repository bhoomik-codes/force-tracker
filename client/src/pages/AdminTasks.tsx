import { AdminLayout } from "@/components/layout/AdminLayout";
import { TASKS } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  address: string;
  time: string;
  status: "Completed" | "Pending" | "In Progress";
  type: "Visit" | "Inspection" | "Delivery" | "Maintenance" | "Survey";
  assignee?: string;
  priority?: "High" | "Medium" | "Low";
  dueDate?: string;
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    ...TASKS,
    { id: 104, title: "Equipment Maintenance", address: "Central Warehouse", time: "11:00 AM", status: "In Progress", type: "Maintenance", assignee: "Vikram Malhotra", priority: "High", dueDate: "Dec 7, 2025" },
    { id: 105, title: "Building Survey - Zone C", address: "Tech Park, Bangalore", time: "03:00 PM", status: "Pending", type: "Survey", assignee: "Priya Sharma", priority: "Medium", dueDate: "Dec 8, 2025" },
    { id: 106, title: "Client Follow-up Call", address: "Remote", time: "05:00 PM", status: "Pending", type: "Visit", assignee: "Rajesh Kumar", priority: "Low", dueDate: "Dec 7, 2025" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "In Progress" | "Completed">("All");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    Pending: tasks.filter(t => t.status === "Pending").length,
    "In Progress": tasks.filter(t => t.status === "In Progress").length,
    Completed: tasks.filter(t => t.status === "Completed").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "In Progress":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Pending":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: "Completed" as const } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground">Task Management</h2>
            <p className="text-muted-foreground">Track and manage field staff assignments</p>
          </div>
          <Button className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm ring-1 ring-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{tasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm ring-1 ring-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Pending Tasks</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{statusCounts.Pending}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm ring-1 ring-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Completed Today</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.Completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search by task title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 shadow-sm"
          />
          <div className="flex gap-2">
            {(["All", "Pending", "In Progress", "Completed"] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="shadow-sm"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <Card className="border-0 shadow-sm ring-1 ring-border">
          <CardHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle>
                {filteredTasks.length} {filteredTasks.length === 1 ? "Task" : "Tasks"}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Showing results for: {filterStatus !== "All" ? filterStatus : "All statuses"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Task Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className="group">
                      <TableCell className="font-medium text-foreground max-w-xs truncate">
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {task.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {task.address}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {task.assignee || "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {task.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.priority && (
                          <Badge variant="secondary" className={cn("text-xs font-medium", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("font-medium flex items-center gap-2 w-fit", getStatusColor(task.status))}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          {task.status !== "Completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompleteTask(task.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-100 text-xs"
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">No tasks found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
