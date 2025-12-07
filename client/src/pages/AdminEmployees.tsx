import { AdminLayout } from "@/components/layout/AdminLayout";
import { EMPLOYEES } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminEmployees() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-heading font-bold text-foreground">Workforce</h2>
                <p className="text-muted-foreground">Manage field staff and assignments</p>
            </div>
            <Button className="gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                Add Employee
            </Button>
        </div>

        <Card className="border-0 shadow-sm ring-1 ring-border">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Employee</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Current Location</TableHead>
                            <TableHead>Battery</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {EMPLOYEES.map((emp) => (
                            <TableRow key={emp.id} className="group">
                                <TableCell>
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{emp.avatar}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium text-foreground">{emp.name}</TableCell>
                                <TableCell className="text-muted-foreground">{emp.role}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={cn(
                                        "font-medium",
                                        emp.status === "Active" || emp.status === "On Duty" 
                                            ? "bg-green-100 text-green-700 hover:bg-green-100" 
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                                    )}>
                                        {emp.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {emp.location}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-12 bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className={cn("h-full rounded-full", emp.battery > 20 ? "bg-green-500" : "bg-red-500")} 
                                                style={{ width: `${emp.battery}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{emp.battery}%</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
