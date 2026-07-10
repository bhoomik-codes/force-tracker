import { Users, Map as MapIcon, ClipboardList, Settings, BarChart3, Home, Briefcase, MapPin, Clock, User, Camera } from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { icon: Home, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Employees", href: "/admin/employees" },
  { icon: MapIcon, label: "Live Map", href: "/admin/map" },
  { icon: ClipboardList, label: "Tasks", href: "/admin/tasks" },
  { icon: Camera, label: "Visits", href: "/admin/visits" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export const MOBILE_NAV_ITEMS = [
  { icon: Briefcase, label: "Tasks", href: "/app/tasks" },
  { icon: MapPin, label: "Visit", href: "/app/visit" },
  { icon: Clock, label: "Time", href: "/app/timesheet" },
  { icon: User, label: "Profile", href: "/app/profile" },
];
