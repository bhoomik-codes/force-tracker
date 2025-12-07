import { User, MapPin, Calendar, CheckSquare, BarChart3, Settings, LogOut, LayoutDashboard } from "lucide-react";

export const EMPLOYEES = [
  { id: 1, name: "Rajesh Kumar", role: "Field Sales", status: "Active", location: "Sector 62, Noida", battery: 85, lastPing: "2 mins ago", avatar: "RK" },
  { id: 2, name: "Amit Singh", role: "Service Engineer", status: "On Duty", location: "Connaught Place, Delhi", battery: 42, lastPing: "5 mins ago", avatar: "AS" },
  { id: 3, name: "Priya Sharma", role: "Surveyor", status: "Inactive", location: "Indiranagar, Bangalore", battery: 0, lastPing: "Offline", avatar: "PS" },
  { id: 4, name: "Vikram Malhotra", role: "Delivery", status: "Active", location: "Andheri West, Mumbai", battery: 67, lastPing: "Just now", avatar: "VM" },
];

export const TASKS = [
  { id: 101, title: "Client Meeting - TechCorp", address: "Cyber City, Gurugram", time: "10:00 AM", status: "Completed", type: "Visit" },
  { id: 102, title: "Site Inspection - Phase 2", address: "Dwarka Sec 21", time: "02:00 PM", status: "Pending", type: "Inspection" },
  { id: 103, title: "Delivery #4459", address: "Vasant Kunj, Delhi", time: "04:30 PM", status: "Pending", type: "Delivery" },
];

export const RECENT_ATTENDANCE = [
  { id: 1, name: "Rajesh Kumar", time: "09:02 AM", type: "Check In", location: "Office HQ" },
  { id: 2, name: "Amit Singh", time: "09:15 AM", type: "Check In", location: "Site A" },
  { id: 4, name: "Vikram Malhotra", time: "08:55 AM", type: "Check In", location: "Warehouse" },
];

export const ADMIN_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: User, label: "Employees", path: "/admin/employees" },
  { icon: MapPin, label: "Live Map", path: "/admin/map" },
  { icon: CheckSquare, label: "Tasks", path: "/admin/tasks" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export const MOBILE_NAV_ITEMS = [
  { icon: Calendar, label: "Attendance", path: "/app" },
  { icon: CheckSquare, label: "Tasks", path: "/app/tasks" },
  { icon: User, label: "Profile", path: "/app/profile" },
];
