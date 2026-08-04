import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserCircle,
  CreditCard,
  Receipt,
  Flag,
  Heart,
  Newspaper,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const LINKS = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/profiles", label: "Profiles", icon: UserCircle },
  { to: "/admin/plans", label: "Plans", icon: CreditCard },
  { to: "/admin/billing", label: "Billing", icon: Receipt },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/stories", label: "Success stories", icon: Heart },
  { to: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors";
  const activeClass = "bg-slate-800 text-white font-medium";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const MenuLinks = () => (
    <>
      {LINKS.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 flex items-center justify-between px-4 py-3 z-50">
        <h2 className="font-bold text-white">Admin Panel</h2>
        <button onClick={() => setOpen(true)}>
          <Menu className="text-white" />
        </button>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 p-4 flex flex-col transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Admin Panel</h2>
          <button onClick={() => setOpen(false)}>
            <X className="text-white" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          <MenuLinks />
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-screen bg-slate-900 p-4">
        <h2 className="text-lg font-bold text-white mb-6 px-1">Admin Panel</h2>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          <MenuLinks />
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </>
  );
}
